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
exports.UserController = void 0;
const handleError_1 = require("../common/handleError");
const domain_1 = require("../../domain");
class UserController {
    constructor(registerUserService) {
        this.registerUserService = registerUserService;
        this.register = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const [error, data] = yield domain_1.CreateUserDto.execute(req.body);
                yield this.registerUserService.execute(data);
                res.status(201).json({ message: 'User registered successfully' });
            }
            catch (error) {
                (0, handleError_1.handleError)(error, res);
            }
        });
        this.validateAccount = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { token } = req.params;
            try {
                const message = yield this.registerUserService.validateAccount(token);
                res.status(200).json({ message });
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                res.status(400).json({ error: errorMessage });
            }
        });
    }
}
exports.UserController = UserController;
