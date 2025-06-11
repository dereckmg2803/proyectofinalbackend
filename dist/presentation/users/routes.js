"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = require("express");
const controller_1 = require("./controller");
const register_user_service_1 = require("./services/register-user.service");
const email_service_1 = require("../common/services/email.service");
const config_1 = require("../../config");
class UserRoutes {
    static get routes() {
        const router = (0, express_1.Router)();
        const emailService = new email_service_1.EmailService(config_1.envs.MAILER_SERVICE, config_1.envs.MAILER_EMAIL, config_1.envs.MAILER_SECRET_KEY, config_1.envs.SEND_MAIL);
        const registerUserService = new register_user_service_1.RegisterUserService(emailService);
        const controller = new controller_1.UserController(registerUserService);
        router.post('/register', controller.register);
        router.get('/validate-email/:token', controller.validateAccount);
        return router;
    }
}
exports.UserRoutes = UserRoutes;
