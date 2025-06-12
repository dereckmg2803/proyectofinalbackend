import { User } from '../../../data';

export class UpdateUserBalanceService {
    async execute(user: User, amountChange: number) {
        user.balance += amountChange;
        try {
            await user.save();
        } catch (error) {
            console.error('Error updating user balance:', error);
            throw new Error('Failed to update balance');
        }
    }
}
