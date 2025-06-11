import { encryptAdapter, envs, JwtAdapter } from '../../../config';
import { User } from '../../../data';
import { CustomError } from '../../../domain';
import { LoginUserDto } from '../../../domain/dtos/users/login-user.dto';

export class LoginUserService {
    async execute(credentials: LoginUserDto) {
        const user = await this.ensureUserExist(credentials);

        this.ensurePasswordIsCorrect(credentials, user);

        const token = await this.generateToken(
            { id: user.id },
            envs.JWT_EXPIRE_IN
        );

        return {
            token,
            user: {
                id: user.id,
                fullname: user.name,
                email: user.email,
                account_number: user.account_number,
                balance: user.balance,
            },
        };
    }

    private ensurePasswordIsCorrect(credentials: LoginUserDto, user: User) {
        const isMatch = encryptAdapter.compare(credentials.password, user.password);

        if (!isMatch) {
            throw CustomError.unAuthorized('Invalid Credentials');
        }
    }

    private async ensureUserExist(credentials: LoginUserDto) {
        const user = await User.findOne({
            where: {
                email: credentials.email,
                status: true,
            },
        });

        if (!user) {
            throw CustomError.unAuthorized('Invalid Credentials');
        }

        return user;
    }

    private async generateToken(payload: any, duration: string) {
        const token = await JwtAdapter.generateToken(payload, duration);
        if (!token) throw CustomError.internalServer('Error while creating jwt');
        return token;
    }
}
