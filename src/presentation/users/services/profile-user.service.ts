import { User } from '../../../data';

export class ProfileUserService {
    async execute(authenticatedUser: User) {
        return {
            id: authenticatedUser.id,
            fullname: authenticatedUser.name,
            email: authenticatedUser.email,
            account_number: authenticatedUser.account_number,
            balance: authenticatedUser.balance,
        };
    }
}
