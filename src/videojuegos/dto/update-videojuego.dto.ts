import { PartialType } from '@nestjs/swagger';
import { CreateVideojuegoDto } from './create-videojuego.dto';

export class UpdateVideojuegoDto extends PartialType(
  CreateVideojuegoDto,
) {}