// src/domain/dtos/transactions/create-transaction.dto.ts
import { z } from 'zod';

const CreateTransactionSchema = z.object({
    account_number: z
        .string({ required_error: 'Receiver account_number is required' })
        .length(14, 'account_number must be exactly 14 digits'), // o ajusta según tus reglas,

    amount: z
        .string()
        .regex(/^\d+(\.\d{1,2})?$/, 'Amount must be a valid decimal number')
});

export class CreateTransactionDto {
    constructor(
        public readonly account_number: string,
        public readonly amount: string
    ) { }

    static execute(input: { [key: string]: any }): [string?, CreateTransactionDto?] {
        const result = CreateTransactionSchema.safeParse(input);

        if (!result.success) {
            const error = result.error.errors[0]?.message ?? 'Validation failed';
            return [error];
        }

        const { account_number, amount } = result.data;
        return [undefined, new CreateTransactionDto(account_number, amount)];
    }
}
