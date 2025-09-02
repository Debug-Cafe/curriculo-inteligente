import { Router, Response } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { db } from '../database/database';

const router = Router();

// GET /api/users/:userId/resumes - Buscar currículos por usuário
router.get('/:userId/resumes', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;
    
    // Verificar se o usuário está tentando acessar seus próprios currículos
    if (userId !== req.userId) {
      return res.status(403).json({ message: 'Acesso negado' });
    }

    db.all('SELECT * FROM resumes WHERE user_id = ?', [userId], (err, rows: any[]) => {
      if (err) {
        return res.status(500).json({ message: 'Erro interno do servidor' });
      }
      
      const resumes = rows.map(row => ({
        id: row.id,
        userId: row.user_id,
        personalData: JSON.parse(row.personal_data),
        skills: JSON.parse(row.skills),
        experiences: JSON.parse(row.experiences),
        educations: row.educations ? JSON.parse(row.educations) : [],
        objectives: row.objectives,
        template: row.template,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }));
      
      res.json(resumes);
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

export { router as usersRouter };

