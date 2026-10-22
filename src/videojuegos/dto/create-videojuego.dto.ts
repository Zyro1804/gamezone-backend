
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsInt,
  IsBoolean,
  IsUUID,
  Min,
  MaxLength,
} from 'class-validator';

import { Transform, Type } from 'class-transformer';

import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

export class CreateVideojuegoDto {

  @ApiProperty({
    example: 'Grand Theft Auto V',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  nombre: string;

  @ApiPropertyOptional({
    example: 'Videojuego de mundo abierto desarrollado por Rockstar Games.',
  })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiProperty({
    example: 599.99,
    minimum: 0,
  })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  precio: number;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'UUID de una categoría existente y activa',
  })
  @IsUUID('4')
  categoriaId: string;

  @ApiPropertyOptional({
    example: 'PC',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  plataforma?: string;

  @ApiPropertyOptional({
    example: 250000,
    minimum: 0,
    description: 'Estadística interna de popularidad',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  totalJugadores?: number;

  @ApiPropertyOptional({
    example: 15000,
    minimum: 0,
    description: 'Unidades vendidas registradas en GameZone',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  totalVentas?: number;

  @ApiPropertyOptional({
    example: true,
    default: false,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === true || value === 'true') return true;
    if (value === false || value === 'false') return false;
    return value;
  })
  @IsBoolean()
  destacado?: boolean;
}
