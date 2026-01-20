// school.model.ts
import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  HasMany,
} from 'sequelize-typescript';
import { User } from '../users/user.model';
import { Course } from '../courses/course.model';
import { Section } from './section.model';
import { Class } from './class.model';

export type EducationLevel =
  | 'nursery'
  | 'primary'
  | 'secondary'
  | 'university'
  | 'master';

@Table({ tableName: 'schools', timestamps: true })
export class School extends Model<School> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  declare id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  name!: string;

  @Column({ type: DataType.STRING, allowNull: true })
  matricule?: string;

  @Column({
    type: DataType.ENUM('nursery', 'primary', 'secondary', 'university', 'master'),
    allowNull: true,
  })
  level?: EducationLevel;

  @Column({ type: DataType.TEXT, allowNull: true })
  description?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  logoUrl?: string;

  @Column({ type: DataType.INTEGER, allowNull: true })
  member?: number;

  @Default(true)
  @Column({ type: DataType.BOOLEAN })
  isActive!: boolean;

  // Associations
  @HasMany(() => User)
  users!: User[];

  @HasMany(() => Course)
  courses!: Course[];

  @HasMany(() => Section)
  sections!: Section[];

  @HasMany(() => Class)
  classes!: Class[];
}
