import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { User, LoginData, RegisterData, AuthResponse } from '../types';
import { generateToken } from '../utils/jwt';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

// Banco de dados em memória
const users: User[] = [];

// POST /api/auth/register
router.post('/register', async (req: Request<{}, AuthResponse, RegisterData>, res: Response<AuthResponse>) => {
  try {
    const { name, email, password } = req.body;

    // Verificar se o usuário já existe
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'Usuário já existe' } as any);
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar novo usuário
    const newUser: User = {
      id: uuidv4(),
      name,
      email,
      password: hashedPassword,
      createdAt: new Date()
    };

    users.push(newUser);

    // Gerar token
    const token = generateToken(newUser.id);

    // Retornar usuário sem senha
    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro interno do servidor' } as any);
  }
});

// POST /api/auth/login
router.post('/login', async (req: Request<{}, AuthResponse, LoginData>, res: Response<AuthResponse>) => {
  try {
    const { email, password } = req.body;

    // Encontrar usuário
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ message: 'Credenciais inválidas' } as any);
    }

    // Verificar senha
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Credenciais inválidas' } as any);
    }

    // Gerar token
    const token = generateToken(user.id);

    // Retornar usuário sem senha
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro interno do servidor' } as any);
  }
});

// GET /api/auth/me
router.get('/me', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const user = users.find(u => u.id === req.userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

export { router as authRouter, users };

