import { Table, Column, Model, DataType } from 'sequelize-typescript';

export type UserRole = 'student' | 'instructor' | 'admin' | 'inspector' | 'school-admin';

@Table({ tableName: 'users', timestamps: true })
export class User extends Model<User> {
  @Column({ type: DataType.STRING, allowNull: false })
  firstname!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  lastname!: string;

  @Column({ type: DataType.STRING, allowNull: true })
  surname?: string;

  @Column({ type: DataType.INTEGER, allowNull: true })
  age?: number;

  @Column({ type: DataType.STRING, allowNull: true })
  school?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  province?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  location?: string;

  @Column({
    type: DataType.ENUM('student', 'instructor', 'admin', 'inspector', 'school-admin'),
    allowNull: false,
    defaultValue: 'student',
  })
  role!: UserRole;

  @Column({ type: DataType.ENUM('male', 'female'), allowNull: true })
  sex?: 'male' | 'female';

  @Column({ type: DataType.STRING, allowNull: true })
  section?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  class?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  email?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  avatar?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  googleId?: string;
}
