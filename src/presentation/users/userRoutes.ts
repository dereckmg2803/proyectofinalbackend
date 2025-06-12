import { Router } from "express";
import { UserController } from "./controller";
import { RegisterUserService } from "./services/register-user.service";
import { LoginUserService } from "./services/login-user.service";
import { EmailService } from "../common/services/email.service";
import { envs } from "../../config";
import { ProfileUserService } from "./services/profile-user.service";

export class UserRoutes {
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
        const profileUserService = new ProfileUserService(); // Assuming you have a ProfileUserService, replace undefined with the actual service

        const controller = new UserController(registerUserService, loginUserService, profileUserService);

        router.post('/register', controller.register);
        router.post('/login', controller.login);
        router.get('/validate-email/:token', controller.validateAccount);
        router.get('/me', controller.getProfile);


        return router;
    }
}