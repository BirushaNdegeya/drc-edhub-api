// school.model.ts
import { Table, Column, Model, DataType, PrimaryKey, Default, HasMany } from 'sequelize-typescript';
import { User } from '../users/user.model';
import { Course } from '../courses/course.model';

@Table({ tableName: 'schools', timestamps: true })
export class School extends Model<School> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  declare id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  name!: string;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  slug!: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  description?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  logoUrl?: string;

  @Default(true)
  @Column({ type: DataType.BOOLEAN })
  isActive!: boolean;

  // Associations
  @HasMany(() => User)
  users!: User[];

  @HasMany(() => Course)
  courses!: Course[];
}
