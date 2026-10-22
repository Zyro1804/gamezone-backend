
import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  AllowNull,
  Unique,
} from 'sequelize-typescript';

@Table({
  tableName: 'categorias',
  timestamps: true,
  underscored: true,
})
export class Categoria extends Model<Categoria> {

  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @AllowNull(false)
  @Unique
  @Column(DataType.STRING(100))
  declare nombre: string;

  @AllowNull(true)
  @Column(DataType.TEXT)
  declare descripcion: string | null;

  @Default(true)
  @AllowNull(false)
  @Column(DataType.BOOLEAN)
  declare activo: boolean;
}
