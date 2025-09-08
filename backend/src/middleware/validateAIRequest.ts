import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

export const validateAIRequest = [
  body('text').notEmpty().withMessage('O campo \'text\' é obrigatório.').isString().withMessage('O campo \'text\' deve ser uma string.'),
  body('type').notEmpty().withMessage('O campo \'type\' é obrigatório.').isString().withMessage('O campo \'type\' deve ser uma string.'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];