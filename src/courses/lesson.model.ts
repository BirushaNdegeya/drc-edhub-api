// lesson.model.ts
import { Table, Column, Model, DataType, PrimaryKey, Default, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { Module } from './module.model';
import { User } from '../users/user.model';
import { LessonProgress } from './lesson-progress.model';

export type ContentType = 'video' | 'text' | 'quiz' | 'assignment';

@Table({ tableName: 'lessons', timestamps: true })
export class Lesson extends Model<Lesson> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  declare id: string;

  @ForeignKey(() => Module)
  @Column({ type: DataType.UUID, allowNull: false })
  moduleId!: string;

  @BelongsTo(() => Module)
  module!: Module;

  @Column({ type: DataType.STRING, allowNull: false })
  title!: string;

  @Column({
    type: DataType.ENUM('video', 'text', 'quiz', 'assignment'),
    allowNull: false
  })
  contentType!: ContentType;

  @Column({ type: DataType.INTEGER, allowNull: true })
  durationMinutes?: number;

  @Column({ type: DataType.TEXT, allowNull: true })
  contentUrl?: string;

  @Default(false)
  @Column({ type: DataType.BOOLEAN })
  isPublished!: boolean;

  @Default(0)
  @Column({ type: DataType.INTEGER })
  orderIndex!: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: true })
  createdById?: string;

  @BelongsTo(() => User)
  createdBy?: User;

  // Associations
  @HasMany(() => LessonProgress)
  progresses!: LessonProgress[];
}
