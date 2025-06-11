import { encryptAdapter } from "../../../config";
import { JwtAdapter } from "../../../config";
import { User } from "../../../data";
import { CreateUserDto, CustomError } from "../../../domain";
import { EmailService } from "../../common/services/email.service";
import { renderValidateEmail, renderEmailValidated } from '../../../templates';

export class RegisterUserService {
    constructor(private readonly emailService: EmailService) { }

    async execute(data: CreateUserDto) {
        const user = new User();
        user.name = data.name;
        user.email = data.email;
        user.password = encryptAdapter.hash(data.password);
        user.account_number = this.generateAccountNumber();

        try {
            await user.save();
            await this.sendLinkToEmailFromValidation(data.email);
        } catch (error) {
            console.error('Error saving user:', error);
            throw CustomError.internalServer("Error saving user");
        }
    }

    private generateAccountNumber() {
        const timestamp = Date.now().toString().slice(-8);
        const randomDigits = Math.floor(100000 + Math.random() * 900000).toString();
        return timestamp + randomDigits;
    }

    private sendLinkToEmailFromValidation = async (email: string) => {
        const token = await JwtAdapter.generateToken({ email }, '300s');
        if (!token) throw CustomError.internalServer("Error generating token");

        // 🔄 Cambiado: ahora el token va como parte de la URL, no como query param
        const link = `http://localhost:3000/api/auth/validate-email/${token}`;
        const html = renderValidateEmail(link);
        const isSent = await this.emailService.sendEmail({
            to: email,
            subject: 'Validate your account!',
            htmlBody: html,
        });

        if (!isSent) throw CustomError.internalServer('Error sending email');
        return true;
    };


    public validateAccount = async (token: string) => {
        const payload = await this.validateToken(token);

        const { email } = payload as { email: string };
        if (!email) throw CustomError.internalServer('Email not found in token');

        const user = await this.ensureUserExistsByEmail(email);

        user.status = true;

        try {
            await user.save();
            return renderEmailValidated();
        } catch (error) {
            console.error(error);
            throw CustomError.internalServer('Something went very wrong');
        }
    };

    private async ensureUserExistsByEmail(email: string) {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            throw CustomError.internalServer('Email not registered in DB');
        }
        return user;
    }

    private async validateToken(token: string) {
        const payload = await JwtAdapter.validateToken(token);
        if (!payload) throw CustomError.badRequest('Invalid Token');
        return payload;
    }
}