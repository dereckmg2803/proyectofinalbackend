"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = void 0;
const domain_1 = require("../../domain");
const handleError = (error, res) => {
    console.error(error);
    if (error instanceof domain_1.CustomError) {
        return res.status(error.statusCode).json({
            status: 'error ❌',
            message: error.message,
        });
    }
    return res.status(500).json({
        status: 'fail 🧨',
        message: 'Something went very wrong! Please try again later.',
    });
};
exports.handleError = handleError;
