import { Module } from '@nestjs/common';
import { CategoriasService } from './categorias.service';
import { CategoriasController } from './categorias.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Categoria } from './entities/categoria.model';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Categoria]),
    AuthModule,
  ],
  providers: [CategoriasService],
  controllers: [CategoriasController]
})
export class CategoriasModule {}
