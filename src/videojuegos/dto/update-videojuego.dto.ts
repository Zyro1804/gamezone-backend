import { PartialType } from '@nestjs/swagger';
import { CreateVideojuegoDto } from './create-videojuego.dto';
import { IsBoolean, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateVideojuegoDto extends PartialType(CreateVideojuegoDto) {
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  activo?: boolean;
}