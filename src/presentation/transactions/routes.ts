import { Router } from "express";
import { TransactionController } from "./controller";
import { CreateTransactionService } from "./services/create-transaction.service";
import { GetTransactionsService } from "./services/get-transactions.service";
import { FinderUserService } from "../users/services/finder-user.service";

export class TransactionRoutes {
    static get routes(): Router {
        const router = Router();
        const finderUserService = new FinderUserService();
        const createTransactionService = new CreateTransactionService(finderUserService);
        const getTransactionsService = new GetTransactionsService();

        const controller = new TransactionController(
            createTransactionService,
            getTransactionsService
        );

        router.post('/', controller.createTransaction);
        router.get('/', controller.getAllTransactions);
        router.get('/:id', controller.getTransactionById);

        return router;
    }
}
