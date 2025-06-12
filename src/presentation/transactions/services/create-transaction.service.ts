import { Transaction, User } from '../../../data';
import { CreateTransactionDto } from '../../../domain/dtos/transactions/transfer.dto';
import { FinderUserService } from '../../users/services/finder-user.service';
import { UpdateUserBalanceService } from './update-balance.service';
import { CustomError } from '../../../domain';

export class CreateTransactionService {
    constructor(
        private readonly finderUserService: FinderUserService,
    ) { }

    async execute(sender: User, dto: CreateTransactionDto) {
        console.log('Executing transaction creation service with DTO:', dto);
        console.log('Sender:', sender);
        const receiver = await this.finderUserService.executeByAccountNumber(dto.account_number);
        console.log('Receiver:', receiver);
        if (!receiver) throw CustomError.notFound('Receiver not found');
        if (receiver.id === sender.id) throw CustomError.badRequest('Cannot transfer to yourself');

        const amount = parseFloat(dto.amount);
        if (isNaN(amount) || amount <= 0) throw CustomError.badRequest('Invalid amount');
        if (sender.balance < amount) throw CustomError.badRequest('Insufficient balance');

        const transaction = new Transaction();
        transaction.sender = sender;
        transaction.receiver = receiver;
        transaction.amount = amount;

        try {
            await transaction.save();
            return { message: 'Transfer completed successfully' };
        } catch (error) {
            console.error('Error saving user:', error);
            throw CustomError.internalServer("Error saving user");
        }
    }
}
