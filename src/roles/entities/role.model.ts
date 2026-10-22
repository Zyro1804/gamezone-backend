import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  AllowNull,
  Unique,
  HasMany,
} from 'sequelize-typescript';
import { Usuario } from '../../usuarios/entities/usuario.model';

@Table({
  tableName: 'roles',
  timestamps: true,
  underscored: true,
})
export class Role extends Model<Role> {

  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @AllowNull(false)
  @Unique
  @Column(DataType.STRING(50))
  declare nombre: string;

  @HasMany(() => Usuario)
  declare usuarios: Usuario[];

}