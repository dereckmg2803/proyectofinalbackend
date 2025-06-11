// src/templates/email/index.ts
import path from 'path';
import pug from 'pug';

const renderValidateEmail = (link: string): string => {
    const filePath = path.join(__dirname, 'email', 'validateEmail.pug');
    return pug.renderFile(filePath, { link });
};

const renderEmailValidated = (): string => {
    const filePath = path.join(__dirname, 'email', 'validatedEmail.pug');
    return pug.renderFile(filePath);
};

export {
    renderValidateEmail,
    renderEmailValidated
};
