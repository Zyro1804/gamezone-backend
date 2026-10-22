
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoriaDto {
  @ApiProperty({
    example: 'Acción',
    description: 'Nombre de la categoría',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre: string;

  @ApiPropertyOptional({
    example: 'Videojuegos de combate y acción',
    description: 'Descripción de la categoría',
  })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Indica si la categoría está activa',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
