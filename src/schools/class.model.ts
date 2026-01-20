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

@Table({ tableName: 'classes', timestamps: true })
export class Class extends Model<Class> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  declare id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  class!: string;

  @ForeignKey(() => School)
  @Column({ type: DataType.UUID, allowNull: false })
  schoolId!: string;

  @BelongsTo(() => School)
  school?: School;
}
