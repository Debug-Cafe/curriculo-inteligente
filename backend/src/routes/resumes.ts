import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Resume } from '../types';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { validateResume } from '../middleware/validation';
import { db } from '../database/database';

const router = Router();

// GET /api/resumes - Buscar todos os currículos
router.get('/', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    db.all('SELECT * FROM resumes WHERE user_id = ?', [req.userId], (err, rows: any[]) => {
      if (err) {
        return res.status(500).json({ message: 'Erro interno do servidor' });
      }
      
      const resumes = rows.map(row => ({
        id: row.id,
        userId: row.user_id,
        personalData: JSON.parse(row.personal_data),
        skills: JSON.parse(row.skills),
        experiences: JSON.parse(row.experiences),
        education: row.educations ? JSON.parse(row.educations) : [],
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

// GET /api/resumes/:id - Buscar currículo por ID
router.get('/:id', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    
    db.get('SELECT * FROM resumes WHERE id = ? AND user_id = ?', [id, req.userId], (err, row: any) => {
      if (err) {
        return res.status(500).json({ message: 'Erro interno do servidor' });
      }
      
      if (!row) {
        return res.status(404).json({ message: 'Currículo não encontrado' });
      }

      const resume = {
        id: row.id,
        userId: row.user_id,
        personalData: JSON.parse(row.personal_data),
        skills: JSON.parse(row.skills),
        experiences: JSON.parse(row.experiences),
        education: row.educations ? JSON.parse(row.educations) : [],
        objectives: row.objectives,
        template: row.template,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      };
      
      res.json(resume);
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});


// POST /api/resumes - Criar novo currículo
router.post('/', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const resumeData = req.body;
    const resumeId = uuidv4();
    
    db.run(
      `INSERT INTO resumes (id, user_id, personal_data, skills, experiences, educations, objectives, template) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        resumeId,
        req.userId,
        JSON.stringify(resumeData.personalData),
        JSON.stringify(resumeData.skills),
        JSON.stringify(resumeData.experiences),
        JSON.stringify(resumeData.education || []),
        resumeData.objectives,
        resumeData.template || 'modern'
      ],
      function(err) {
        if (err) {
          return res.status(500).json({ message: 'Erro interno do servidor' });
        }
        
        const newResume = {
          ...resumeData,
          id: resumeId,
          userId: req.userId,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        res.status(201).json(newResume);
      }
    );
  } catch (error) {
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// PUT /api/resumes/:id - Atualizar currículo
router.put('/:id', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const resumeData = req.body;
    
    db.run(
      `UPDATE resumes SET 
       personal_data = ?, skills = ?, experiences = ?, educations = ?, 
       objectives = ?, template = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ? AND user_id = ?`,
      [
        JSON.stringify(resumeData.personalData),
        JSON.stringify(resumeData.skills),
        JSON.stringify(resumeData.experiences),
        JSON.stringify(resumeData.education || []),
        resumeData.objectives,
        resumeData.template || 'modern',
        id,
        req.userId
      ],
      function(err) {
        if (err) {
          return res.status(500).json({ message: 'Erro interno do servidor' });
        }
        
        if (this.changes === 0) {
          return res.status(404).json({ message: 'Currículo não encontrado' });
        }
        
        const updatedResume = {
          ...resumeData,
          id,
          userId: req.userId,
          updatedAt: new Date()
        };
        
        res.json(updatedResume);
      }
    );
  } catch (error) {
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// DELETE /api/resumes/:id - Remover currículo
router.delete('/:id', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    
    db.run('DELETE FROM resumes WHERE id = ? AND user_id = ?', [id, req.userId], function(err) {
      if (err) {
        return res.status(500).json({ message: 'Erro interno do servidor' });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ message: 'Currículo não encontrado' });
      }
      
      res.status(204).send();
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

export { router as resumesRouter };

