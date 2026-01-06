import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
} from 'sequelize-typescript';

@Table({ tableName: 'academic_years', timestamps: true })
export class AcademicYear extends Model<AcademicYear> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  declare id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  name!: string;

  @Column({ type: DataType.STRING, allowNull: true })
  link?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  province?: string;
}
