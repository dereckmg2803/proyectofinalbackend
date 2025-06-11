import { Router } from "express";
import { UserController } from "./controller";
import { RegisterUserService } from "./services/register-user.service";
import { LoginUserService } from "./services/login-user.service";
import { EmailService } from "../common/services/email.service";
import { envs } from "../../config";

export class AuthRoutes {
    static get routes(): Router {
        const router = Router();
        const emailService = new EmailService(
            envs.MAILER_SERVICE,
            envs.MAILER_EMAIL,
            envs.MAILER_SECRET_KEY,
            envs.SEND_MAIL
        );
        const registerUserService = new RegisterUserService(emailService);
        const loginUserService = new LoginUserService();

        const controller = new UserController(registerUserService, loginUserService);

        router.post('/register', controller.register);
        router.post('/login', controller.login);
        router.get('/validate-email/:token', controller.validateAccount);


        return router;
    }
}