import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  // Tratamento de erros de validação do Zod (Erro 400)
  if (err instanceof ZodError) {
    return res.status(400).json({
      status: 'error',
      message: 'Erro de validação nos dados enviados.',
      errors: err.errors.map(e => ({
        field: e.path.join('.'),
        message: e.message
      }))
    });
  }

  // Erro customizado de Não Encontrado (404) ou Regra de Negócio
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message
    });
  }

  // Erro interno padrão do servidor (500)
  console.error('Erro interno não tratado:', err);
  return res.status(500).json({
    status: 'error',
    message: 'Erro interno no servidor.',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
}