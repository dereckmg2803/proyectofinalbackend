import { User } from '../../../data';
import { CustomError } from '../../../domain';

export class FinderUserService {


    async executeByAccountNumber(account_number: string) {
        const user = await User.findOne({
            where: {
                status: true,
                account_number: account_number,
            },
        });

        if (!user) {
            throw CustomError.notFound('Receiver not found not found');
        }

        return user;
    }


}
