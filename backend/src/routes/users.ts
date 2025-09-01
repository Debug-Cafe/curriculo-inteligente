import { Router, Response } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { resumes } from './resumes';

const router = Router();

// GET /api/users/:userId/resumes - Buscar currículos por usuário
router.get('/:userId/resumes', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;
    
    // Verificar se o usuário está tentando acessar seus próprios currículos
    if (userId !== req.userId) {
      return res.status(403).json({ message: 'Acesso negado' });
    }

    const userResumes = resumes.filter(resume => resume.userId === userId);
    res.json(userResumes);
  } catch (error) {
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

export { router as usersRouter };

