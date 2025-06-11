"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderValidateEmail = void 0;
// src/templates/email/index.ts
const path_1 = __importDefault(require("path"));
const pug_1 = __importDefault(require("pug"));
const renderValidateEmail = (link) => {
    const filePath = path_1.default.join(__dirname, 'validateEmail.pug');
    return pug_1.default.renderFile(filePath, { link });
};
exports.renderValidateEmail = renderValidateEmail;
