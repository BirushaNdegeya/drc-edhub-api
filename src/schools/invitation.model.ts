import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { School } from './school.model';

export type InvitationStatus = 'pending' | 'accepted' | 'rejected' | 'expired';

@Table({ tableName: 'invitations', timestamps: true })
export class Invitation extends Model<Invitation> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  declare id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  email!: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  token!: string;

  @ForeignKey(() => School)
  @Column({ type: DataType.UUID, allowNull: false })
  schoolId!: string;

  @BelongsTo(() => School)
  school?: School;

  @Column({
    type: DataType.ENUM('pending', 'accepted', 'rejected', 'expired'),
    defaultValue: 'pending',
  })
  status!: InvitationStatus;

  @Column({ type: DataType.DATE, allowNull: false })
  expiresAt!: Date;
}
