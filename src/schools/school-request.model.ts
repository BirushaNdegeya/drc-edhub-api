import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
} from 'sequelize-typescript';

export type SchoolRequestStatus = 'pending' | 'in_progress' | 'accepted' | 'rejected';

@Table({ tableName: 'school_requests', timestamps: true })
export class SchoolRequest extends Model<SchoolRequest> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  declare id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  school!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  email!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  phone!: string;

  @Column({
    type: DataType.ENUM('pending', 'in_progress', 'accepted', 'rejected'),
    defaultValue: 'pending',
  })
  status!: SchoolRequestStatus;
}
