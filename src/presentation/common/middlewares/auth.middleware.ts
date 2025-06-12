// middlewares/auth.middleware.ts
import { NextFunction, Request, Response } from 'express';
import { JwtAdapter } from '../../../config';
import { User } from '../../../data';
import { CustomError } from '../../../domain';

declare global {
  namespace Express {
    interface Request {
      sessionUser?: User;
    }
  }
}

export class AuthMiddleware {
  static async protect(req: Request, res: Response, next: NextFunction) {
    try {
      // Obtener token desde cookies o header Authorization
      let token = req.cookies?.token;

      if (!token) {
        const authHeader = req.header('Authorization');
        if (authHeader && authHeader.startsWith('Bearer ')) {
          token = authHeader.split(' ')[1];
        }
      }

      if (!token) {
        return res.status(401).json({ message: 'No token provided' });
      }

      // Validar el token y extraer el payload
      const payload = await JwtAdapter.validateToken(token) as { id: string };

      if (!payload || !payload.id) {
        return res.status(401).json({ message: 'Invalid token payload' });
      }

      // Buscar el usuario en la base de datos
      const user = await User.findOne({
        where: {
          id: payload.id,
          status: true,
        },
      });

      if (!user) {
        return res.status(401).json({ message: 'User not found or inactive' });
      }

      // Asignar usuario a la request
      req.sessionUser = user;

      next();
    } catch (error) {
      console.error('[AuthMiddleware] Error:', error);
      return res.status(500).json({ message: 'Authentication failed 😢' });
    }
  }

  // static restrictTo = (...allowedRoles: string[]) => {
  //   return (req: Request, res: Response, next: NextFunction) => {
  //     const user = req.sessionUser;
  //     if (!user) {
  //       return res.status(401).json({ message: 'Unauthorized' });
  //     }

  //     if (!allowedRoles.includes(user)) {
  //       return res.status(403).json({
  //         message: 'You are not authorized to access this route',
  //       });
  //     }

  //     next();
  //   };
  // };
}
