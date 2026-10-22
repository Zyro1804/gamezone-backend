import { Module } from '@nestjs/common';
import { VideojuegosService } from './videojuegos.service';
import { VideojuegosController } from './videojuegos.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Videojuego } from './entities/videojuego.model';
import { Categoria } from '../categorias/entities/categoria.model';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
  SequelizeModule.forFeature([Videojuego, Categoria]),
  AuthModule,
  ],
  providers: [VideojuegosService],
  controllers: [VideojuegosController]
})
export class VideojuegosModule {}
