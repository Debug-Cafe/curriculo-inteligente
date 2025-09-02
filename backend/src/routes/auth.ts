import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { User, LoginData, RegisterData, AuthResponse } from '../types';
import { generateToken } from '../utils/jwt';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { validateAuth, validateRegister } from '../middleware/validation';
import { db } from '../database/database';

const router = Router();

// POST /api/auth/register
router.post('/register', validateRegister, async (req: Request<{}, AuthResponse, RegisterData>, res: Response<AuthResponse>) => {
  try {
    const { name, email, password } = req.body;

    // Verificar se o usuário já existe
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, row) => {
      if (err) {
        return res.status(500).json({ message: 'Erro interno do servidor' } as any);
      }
      
      if (row) {
        return res.status(400).json({ message: 'Usuário já existe' } as any);
      }

      // Hash da senha
      const hashedPassword = await bcrypt.hash(password, 10);
      const userId = uuidv4();

      // Inserir novo usuário
      db.run(
        'INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)',
        [userId, name, email, hashedPassword],
        function(err) {
          if (err) {
            return res.status(500).json({ message: 'Erro interno do servidor' } as any);
          }

          // Gerar token
          const token = generateToken(userId);

          res.status(201).json({
            user: { id: userId, name, email, createdAt: new Date() },
            token
          });
        }
      );
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro interno do servidor' } as any);
  }
});

// POST /api/auth/login
router.post('/login', validateAuth, async (req: Request<{}, AuthResponse, LoginData>, res: Response<AuthResponse>) => {
  try {
    const { email, password } = req.body;

    // Encontrar usuário
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, row: any) => {
      if (err) {
        return res.status(500).json({ message: 'Erro interno do servidor' } as any);
      }
      
      if (!row) {
        return res.status(401).json({ message: 'Credenciais inválidas' } as any);
      }

      // Verificar senha
      const isValidPassword = await bcrypt.compare(password, row.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: 'Credenciais inválidas' } as any);
      }

      // Gerar token
      const token = generateToken(row.id);

      res.json({
        user: { id: row.id, name: row.name, email: row.email, createdAt: row.created_at },
        token
      });
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro interno do servidor' } as any);
  }
});

// GET /api/auth/me
router.get('/me', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    db.get('SELECT id, name, email, created_at FROM users WHERE id = ?', [req.userId], (err, row: any) => {
      if (err) {
        return res.status(500).json({ message: 'Erro interno do servidor' });
      }
      
      if (!row) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }

      res.json({ id: row.id, name: row.name, email: row.email, createdAt: row.created_at });
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

export { router as authRouter };

