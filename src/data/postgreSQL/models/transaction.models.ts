import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from './user.model';

@Entity()
export class Transaction extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, (user) => user.sentTransactions, { nullable: false })
  sender!: User;

  @ManyToOne(() => User, (user) => user.receivedTransactions, { nullable: false })
  receiver!: User;

  @Column('decimal', { precision: 10, scale: 2, nullable: false })
  amount!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
