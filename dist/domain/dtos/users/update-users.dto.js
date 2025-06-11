"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserDto = exports.UpdateUserSchema = void 0;
const zod_1 = require("zod");
exports.UpdateUserSchema = zod_1.z.object({
    username: zod_1.z
        .string()
        .min(3, 'username must be at least 3 characters long')
        .max(30, 'username must be at most 30 characters long')
        .optional(),
    email: zod_1.z
        .string()
        .email('email must be a valid email address')
        .optional(),
    password: zod_1.z
        .string()
        .min(6, 'password must be at least 6 characters long')
        .optional(),
    avatar_url: zod_1.z
        .string()
        .url('avatar_url must be a valid URL')
        .optional(),
});
class UpdateUserDto {
    constructor(username, email, password, avatar_url) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.avatar_url = avatar_url;
    }
    static execute(input) {
        var _a, _b;
        const parseResult = exports.UpdateUserSchema.safeParse(input);
        if (!parseResult.success) {
            const error = (_b = (_a = parseResult.error.errors[0]) === null || _a === void 0 ? void 0 : _a.message) !== null && _b !== void 0 ? _b : 'Validation failed';
            return [error];
        }
        const { username, email, password, avatar_url } = parseResult.data;
        return [undefined, new UpdateUserDto(username, email, password, avatar_url)];
    }
}
exports.UpdateUserDto = UpdateUserDto;
