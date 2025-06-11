"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterUserService = void 0;
const config_1 = require("../../../config");
const config_2 = require("../../../config");
const data_1 = require("../../../data");
const domain_1 = require("../../../domain");
const templates_1 = require("../../../templates");
class RegisterUserService {
    constructor(emailService) {
        this.emailService = emailService;
        this.sendLinkToEmailFromValidation = (email) => __awaiter(this, void 0, void 0, function* () {
            const token = yield config_2.JwtAdapter.generateToken({ email }, '300s');
            if (!token)
                throw domain_1.CustomError.internalServer("Error generating token");
            // 🔄 Cambiado: ahora el token va como parte de la URL, no como query param
            const link = `http://localhost:3000/validate-email/${token}`;
            const html = (0, templates_1.renderValidateEmail)(link);
            const isSent = yield this.emailService.sendEmail({
                to: email,
                subject: 'Validate your account!',
                htmlBody: html,
            });
            if (!isSent)
                throw domain_1.CustomError.internalServer('Error sending email');
            return true;
        });
        this.validateAccount = (token) => __awaiter(this, void 0, void 0, function* () {
            const payload = yield this.validateToken(token);
            const { email } = payload;
            if (!email)
                throw domain_1.CustomError.internalServer('Email not found in token');
            const user = yield this.ensureUserExistsByEmail(email);
            user.status = true;
            try {
                yield user.save();
                return 'User activated successfully';
            }
            catch (error) {
                console.error(error);
                throw domain_1.CustomError.internalServer('Something went very wrong');
            }
        });
    }
    execute(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = new data_1.User();
            user.name = data.name;
            user.email = data.email;
            user.password = config_1.encryptAdapter.hash(data.password);
            user.account_number = Math.floor(Math.random() * 1000000000).toString();
            user.balance = '0.00';
            try {
                yield user.save();
                yield this.sendLinkToEmailFromValidation(data.email);
            }
            catch (error) {
                console.error('Error saving user:', error);
                throw domain_1.CustomError.internalServer("Error saving user");
            }
        });
    }
    ensureUserExistsByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield data_1.User.findOne({ where: { email } });
            if (!user) {
                throw domain_1.CustomError.internalServer('Email not registered in DB');
            }
            return user;
        });
    }
    validateToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = yield config_2.JwtAdapter.validateToken(token);
            if (!payload)
                throw domain_1.CustomError.badRequest('Invalid Token');
            return payload;
        });
    }
}
exports.RegisterUserService = RegisterUserService;
