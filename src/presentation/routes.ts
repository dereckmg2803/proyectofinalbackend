import { Request, Response, Router } from 'express';
import { AuthRoutes } from "./users/authroutes";


export class AppRoutes {
    static get routes(): Router {
        const router = Router();

        router.use('/api/auth', AuthRoutes.routes);  // Usar las rutas de usuarios


        return router;
    }
}
