import {
    BaseEntity,
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    OneToMany,
    Decimal128,
} from 'typeorm';
import { Transaction } from './transaction.models';
@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column('varchar', { length: 100, nullable: false })
    name!: string;

    @Column('varchar', { length: 100, unique: true, nullable: false })
    email!: string;

    @Column('text', { nullable: false })
    password!: string;

    @Column('varchar', { length: 20, nullable: false })
    account_number!: string;

    @Column('double precision', { nullable: true, default: 1000 })
    balance!: number;

    @Column({ type: 'boolean', default: false, nullable: false })
    status: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @OneToMany(() => Transaction, (transaction) => transaction.sender)
    sentTransactions!: Transaction[];

    @OneToMany(() => Transaction, (transaction) => transaction.receiver)
    receivedTransactions!: Transaction[];

}