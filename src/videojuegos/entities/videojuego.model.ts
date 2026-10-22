
import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  AllowNull,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';

import { Categoria } from '../../categorias/entities/categoria.model';

@Table({
  tableName: 'videojuegos',
  timestamps: true,
  underscored: true,
})
export class Videojuego extends Model<Videojuego> {

  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @AllowNull(false)
  @Column(DataType.STRING(150))
  declare nombre: string;

  @AllowNull(true)
  @Column(DataType.TEXT)
  declare descripcion: string | null;

  @AllowNull(true)
  @Column(DataType.TEXT)
  declare imagenUrl: string | null;

  @AllowNull(false)
  @Column(DataType.DECIMAL(10, 2))
  declare precio: number;

  @ForeignKey(() => Categoria)
  @AllowNull(false)
  @Column(DataType.UUID)
  declare categoriaId: string;

  @BelongsTo(() => Categoria)
  declare categoria: Categoria;

  @AllowNull(true)
  @Column(DataType.STRING(100))
  declare plataforma: string | null;

  @Default(0)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare totalJugadores: number;

  @Default(0)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare totalVentas: number;

  @Default(false)
  @AllowNull(false)
  @Column(DataType.BOOLEAN)
  declare destacado: boolean;

  @Default(true)
  @AllowNull(false)
  @Column(DataType.BOOLEAN)
  declare activo: boolean;
}
