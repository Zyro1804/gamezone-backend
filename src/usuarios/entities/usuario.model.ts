import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  AllowNull,
  Unique,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';

import { Role } from '../../roles/entities/role.model';

@Table({
  tableName: 'usuarios',
  timestamps: true,
  underscored: true,
})
export class Usuario extends Model<Usuario> {

  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @AllowNull(false)
  @Column(DataType.STRING(100))
  declare nombre: string;

  @AllowNull(false)
  @Unique
  @Column(DataType.STRING(150))
  declare email: string;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  declare password: string;

  @ForeignKey(() => Role)
  @AllowNull(false)
  @Column(DataType.UUID)
  declare rolId: string;

  @BelongsTo(() => Role)
  declare rol: Role;

  @Default(true)
  @AllowNull(false)
  @Column(DataType.BOOLEAN)
  declare activo: boolean;
}