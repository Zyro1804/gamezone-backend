import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Categoria } from './entities/categoria.model';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UniqueConstraintError } from 'sequelize';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';

@Injectable()
export class CategoriasService {
  constructor(
    @InjectModel(Categoria)
    private readonly categoriaModel: typeof Categoria,
  ) {}

  async findAll() {
    return this.categoriaModel.findAll({
      where: { activo: true },    
      order: [['nombre', 'ASC']],
    });
  }

   async findAllAdmin() {
    return this.categoriaModel.findAll({
      order: [['nombre', 'ASC']],
    });
  }

  async findOne(id: string) {
    const categoria = await this.categoriaModel.findOne({
      where: {
        id,
      },
    });

    if (!categoria) {
      throw new NotFoundException(
        'Categoría no encontrada o inactiva',
      );
    }

    return categoria;
  }

  async create(dto: CreateCategoriaDto) {
    const nombre = dto.nombre.trim();

    if (!nombre) {
      throw new BadRequestException(
        'El nombre no puede estar vacío',
      );
    }

    const existe = await this.categoriaModel.findOne({
      where: { nombre },
    });

    if (existe) {
      throw new ConflictException(
        'La categoría ya existe',
      );
    }

    try {
      return await this.categoriaModel.create({
        nombre,
        descripcion: dto.descripcion ?? null,
        activo: true,
      } as any);
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        throw new ConflictException('La categoría ya existe');
      }

      throw error;
    }
  }

  async update(id: string, dto: UpdateCategoriaDto) {
    const categoria = await this.findOne(id);

    const cambios: Record<string, unknown> = { ...dto };

    if (dto.nombre !== undefined) {
      const nombre = dto.nombre.trim();

      if (!nombre) {
        throw new BadRequestException(
          'El nombre no puede estar vacío',
        );
      }

      const existe = await this.categoriaModel.findOne({
        where: { nombre },
      });

      if (existe && existe.id !== id) {
        throw new ConflictException(
          'La categoría ya existe',
        );
      }

      cambios.nombre = nombre;
    }

    delete cambios.activo;

    try {
      await categoria.update(cambios);
      return categoria;
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        throw new ConflictException('La categoría ya existe');
      }

      throw error;
    }
  }

  async remove(id: string) {
    const categoria = await this.findOne(id);

    await categoria.update({
      activo: false,
    });

    return {
      message: 'Categoría desactivada correctamente',
      id: categoria.id,
      activo: categoria.activo,
    };
  }
}