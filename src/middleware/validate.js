import { validationResult } from 'express-validator';

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Return only the first error message for a cleaner UI
    return res.status(400).json({ 
      message: errors.array()[0].msg, 
      errors: errors.array() 
    });
  }
  next();
};