import { Request, Response } from "express";
import { handleError } from '../common/handleError';
import { CreateTransactionService } from "./services/create-transaction.service";
import { GetTransactionsService } from "./services/get-transactions.service";
import { CreateTransactionDto } from "../../domain/dtos/transactions/transfer.dto";
import { User } from "../../data";

interface AuthenticatedRequest extends Request {
    sessionUser?: User;
}

export class TransactionController {
    constructor(
        private readonly createTransactionService: CreateTransactionService,
        private readonly getTransactionsService: GetTransactionsService
    ) { }

    // Crear transacción
    createTransaction = async (req: Request, res: Response) => {
        const { sessionUser: sender } = req as AuthenticatedRequest;

        if (!sender) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const [error, dto] = CreateTransactionDto.execute(req.body);
        if (error) {
            return res.status(422).json({ error });
        }

        try {
            const result = await this.createTransactionService.execute(sender, dto!);
            return res.status(201).json(result);
        } catch (error) {
            handleError(error, res);
        }
    };

    // Obtener todas las transacciones del usuario autenticado
    getAllTransactions = async (req: Request, res: Response) => {
        const { sessionUser: user } = req as AuthenticatedRequest;

        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        try {
            const transactions = await this.getTransactionsService.getAll(user);
            return res.status(200).json(transactions);
        } catch (error) {
            handleError(error, res);
        }
    };

    // Obtener una transacción específica del usuario
    getTransactionById = async (req: Request, res: Response) => {
        const { sessionUser: user } = req as AuthenticatedRequest;
        const { id } = req.params;

        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        try {
            const transaction = await this.getTransactionsService.getOne(user, id);
            return res.status(200).json(transaction);
        } catch (error) {
            handleError(error, res);
        }
    };
}
