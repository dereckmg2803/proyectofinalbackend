

import { Transaction, User } from "../../../data";
import { CustomError } from "../../../domain";

export class GetTransactionsService {

    async getAll(user: User) {
        console.log("Fetching transactions for user:", user.id);
        const transactions = await Transaction.find({
            where: [
                { sender: { id: user.id } },
                { receiver: { id: user.id } }
            ],
            relations: ['sender', 'receiver'],
            order: {
                createdAt: 'DESC',
            },
        });

        return transactions;
    }

    async getOne(user: User, transactionId: string) {
        console.log("Fetching transaction with ID:", transactionId, "for user:", user.id);
        const transaction = await Transaction.findOne({
            where: [
                { id: transactionId, sender: { id: user.id } },
                { id: transactionId, receiver: { id: user.id } }
            ],
            relations: ['sender', 'receiver'],
        });


        if (!transaction) {
            throw CustomError.notFound("Transaction not found or not accessible");
        }

        return transaction;
    }
}


// export class GetTransactionsService {
//     // private transactionRepo = AppDataSource.getRepository(Transaction);

//     // Obtener todas las transacciones donde el usuario es emisor o receptor
//     async getAll(user: User) {
//         const transactions = await this.transactionRepo.find({
//             where: [
//                 { sender: { id: user.id } },
//                 { receiver: { id: user.id } }
//             ],
//             relations: ['sender', 'receiver'],
//             order: { createdAt: 'DESC' }
//         });

//         return transactions;
//     }

//     // Obtener una transacción específica (si el usuario es emisor o receptor)
//     async getOne(user: User, transactionId: string) {
//         const transaction = await this.transactionRepo.findOne({
//             where: {
//                 id: transactionId,
//             },
//             relations: ['sender', 'receiver'],
//         });

//         if (!transaction) {
//             throw CustomError.notFound('Transaction not found');
//         }

//         const isSenderOrReceiver = transaction.sender.id === user.id || transaction.receiver.id === user.id;

//         if (!isSenderOrReceiver) {
//             throw CustomError.unAuthorized('You are not allowed to view this transaction');
//         }

//         return transaction;
//     }
// }
