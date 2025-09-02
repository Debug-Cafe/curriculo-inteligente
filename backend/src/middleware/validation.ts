import { Request, Response, NextFunction } from 'express';

export const validateResume = (req: Request, res: Response, next: NextFunction) => {
  const { personalData, skills, experiences, education, objectives } = req.body;

  if (!personalData?.name?.trim()) {
    return res.status(400).json({ error: 'Nome é obrigatório' });
  }

  if (!personalData?.email?.trim() || !personalData.email.includes('@')) {
    return res.status(400).json({ error: 'Email válido é obrigatório' });
  }

  if (!Array.isArray(skills)) {
    return res.status(400).json({ error: 'Skills deve ser um array' });
  }

  if (!Array.isArray(experiences)) {
    return res.status(400).json({ error: 'Experiences deve ser um array' });
  }

  next();
};

export const validateAuth = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!email?.trim() || !email.includes('@')) {
    return res.status(400).json({ error: 'Email válido é obrigatório' });
  }

  if (!password?.trim() || password.length < 6) {
    return res.status(400).json({ error: 'Senha deve ter pelo menos 6 caracteres' });
  }

  next();
};

export const validateRegister = (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.body;

  if (!name?.trim()) {
    return res.status(400).json({ error: 'Nome é obrigatório' });
  }

  validateAuth(req, res, next);
};