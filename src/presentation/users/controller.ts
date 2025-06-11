import { Request, Response } from "express";
import { handleError } from '../common/handleError';
import { RegisterUserService } from "./services/register-user.service";
import { LoginUserService } from "./services/login-user.service";
import { LoginUserDto } from "../../domain/dtos/users/login-user.dto";
import { CreateUserDto } from "../../domain";

export class UserController {
    constructor(private readonly registerUserService: RegisterUserService,
        private readonly loginUserService: LoginUserService
    ) { }

    register = (req: Request, res: Response) => {
        const [error, data] = CreateUserDto.execute(req.body);

        if (error) {
            console.error('Validation error:', error);
            return res.status(422).json({ error: error });
        }

        this.registerUserService.execute(data!)
            .then(() => {
                res.status(201).json({ message: 'User registered successfully' });
            })
            .catch((error) => handleError(error, res));
    };

    login = (req: Request, res: Response) => {
        const [error, data] = LoginUserDto.execute(req.body);

        if (error) {
            return res.status(422).json({ message: error });
        }

        this.loginUserService
            .execute(data!)
            .then((data) => {
                res.cookie('token', data.token, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'strict',
                    maxAge: 3 * 60 * 60 * 1000,
                });
                res.status(201).json(data);
            })
            .catch((error) => handleError(error, res));
    };

    validateAccount = async (req: Request, res: Response) => {
        const { token } = req.params;

        try {
            const html = await this.registerUserService.validateAccount(token); // ← AQUÍ va el await
            res.send(html); // ← Ahora sí manda el HTML renderizado correctamente
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            res.status(400).json({ error: errorMessage });
        }
    };

}