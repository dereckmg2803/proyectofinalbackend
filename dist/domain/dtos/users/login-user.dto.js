"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUserDto = exports.LoginUserSchema = void 0;
const zod_1 = require("zod");
exports.LoginUserSchema = zod_1.z.object({
    email: zod_1.z
        .string({ required_error: 'Please enter your email.' })
        .email('The email address is badly formatted.'),
    password: zod_1.z
        .string({ required_error: 'Please enter your password.' })
        .min(8, 'Your password must have 8 characters or more.'),
});
class LoginUserDto {
    constructor(email, password) {
        this.email = email;
        this.password = password;
    }
    static execute(input) {
        var _a, _b;
        const parseResult = exports.LoginUserSchema.safeParse(input);
        if (!parseResult.success) {
            const error = (_b = (_a = parseResult.error.errors[0]) === null || _a === void 0 ? void 0 : _a.message) !== null && _b !== void 0 ? _b : 'Validation failed';
            return [error];
        }
        const { email, password } = parseResult.data;
        return [undefined, new LoginUserDto(email, password)];
    }
}
exports.LoginUserDto = LoginUserDto;
