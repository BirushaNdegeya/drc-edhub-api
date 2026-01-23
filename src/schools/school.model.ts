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
  declare name: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare slug: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare matricule?: string;

  @Column({
    type: DataType.ENUM('nursery', 'primary', 'secondary', 'university', 'master'),
    allowNull: true,
  })
  declare level?: EducationLevel;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare description?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare logoUrl?: string;

  @Column({ type: DataType.INTEGER, allowNull: true })
  declare member?: number;

  @Default(true)
  @Column({ type: DataType.BOOLEAN })
  declare isActive: boolean;

  // Associations
  @HasMany(() => User)
  declare users: User[];

  @HasMany(() => Course)
  declare courses: Course[];

  @HasMany(() => Section)
  declare sections: Section[];

  @HasMany(() => Class)
  declare classes: Class[];
}
