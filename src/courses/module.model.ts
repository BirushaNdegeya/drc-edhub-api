// module.model.ts
import { Table, Column, Model, DataType, PrimaryKey, Default, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { Course } from './course.model';
import { Lesson } from './lesson.model';

@Table({ tableName: 'modules', timestamps: true })
export class Module extends Model<Module> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  declare id: string;

  @ForeignKey(() => Course)
  @Column({ type: DataType.UUID, allowNull: false })
  courseId!: string;

  @BelongsTo(() => Course)
  course!: Course;

  @Column({ type: DataType.STRING, allowNull: false })
  title!: string;

  @Default(0)
  @Column({ type: DataType.INTEGER })
  orderIndex!: number;

  @Default(false)
  @Column({ type: DataType.BOOLEAN })
  isPublished!: boolean;

  // Associations
  @HasMany(() => Lesson)
  lessons!: Lesson[];
}
