import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  HasMany,
} from 'sequelize-typescript';
import { Course } from '../courses/course.model';

@Table({ tableName: 'levels', timestamps: true })
export class Level extends Model<Level> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  declare id: string;

  @Column({
    type: DataType.ENUM('nursery', 'primary', 'secondary', 'university', 'master'),
    allowNull: false,
    unique: true,
  })
  name!: 'nursery' | 'primary' | 'secondary' | 'university' | 'master';

  @Column({ type: DataType.TEXT, allowNull: true })
  description?: string;

  // Associations
  @HasMany(() => Course)
  courses!: Course[];
}
