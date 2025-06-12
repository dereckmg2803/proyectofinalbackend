import { Request, Response, Router } from 'express';
import { UserRoutes } from "./users/userRoutes";
import { AuthMiddleware } from './common/middlewares/auth.middleware';
import { TransactionRoutes } from './transactions/routes';

export class AppRoutes {
    static get routes(): Router {
        const router = Router();
        router.use('/api/users', AuthMiddleware.protect, UserRoutes.routes);  // Usar las rutas de usuarios
        router.use('/api/auth', UserRoutes.routes);  // Usar las rutas de usuarios

        // Aquí puedes agregar más rutas de otros módulos
        router.use('/api/transactions', AuthMiddleware.protect, TransactionRoutes.routes);  // Usar las rutas de usuarios




        return router;
    }
}
