import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Resume } from '../types';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

// Banco de dados em memória para currículos
const resumes: Resume[] = [];

// GET /api/resumes - Buscar todos os currículos
router.get('/', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const userResumes = resumes.filter(resume => resume.userId === req.userId);
    res.json(userResumes);
  } catch (error) {
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// GET /api/resumes/:id - Buscar currículo por ID
router.get('/:id', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const resume = resumes.find(r => r.id === id && r.userId === req.userId);
    
    if (!resume) {
      return res.status(404).json({ message: 'Currículo não encontrado' });
    }

    res.json(resume);
  } catch (error) {
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});


// POST /api/resumes - Criar novo currículo
router.post('/', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const resumeData = req.body;
    
    const newResume: Resume = {
      ...resumeData,
      id: uuidv4(),
      userId: req.userId!,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    resumes.push(newResume);
    res.status(201).json(newResume);
  } catch (error) {
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// PUT /api/resumes/:id - Atualizar currículo
router.put('/:id', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const resumeData = req.body;
    
    const resumeIndex = resumes.findIndex(r => r.id === id && r.userId === req.userId);
    
    if (resumeIndex === -1) {
      return res.status(404).json({ message: 'Currículo não encontrado' });
    }

    const updatedResume: Resume = {
      ...resumeData,
      id,
      userId: req.userId!,
      createdAt: resumes[resumeIndex].createdAt,
      updatedAt: new Date()
    };

    resumes[resumeIndex] = updatedResume;
    res.json(updatedResume);
  } catch (error) {
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// DELETE /api/resumes/:id - Remover currículo
router.delete('/:id', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    
    const resumeIndex = resumes.findIndex(r => r.id === id && r.userId === req.userId);
    
    if (resumeIndex === -1) {
      return res.status(404).json({ message: 'Currículo não encontrado' });
    }

    resumes.splice(resumeIndex, 1);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

export { router as resumesRouter, resumes };

