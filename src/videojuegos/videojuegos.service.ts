import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Videojuego } from './entities/videojuego.model';
import { Categoria } from '../categorias/entities/categoria.model';
import { CreateVideojuegoDto } from './dto/create-videojuego.dto';
import { join } from 'path';
import { unlink } from 'fs/promises';
import { UpdateVideojuegoDto } from './dto/update-videojuego.dto';

@Injectable()
export class VideojuegosService {
    constructor(
        @InjectModel(Videojuego)
        private readonly videojuegoModel: typeof Videojuego,

        @InjectModel(Categoria)
        private readonly categoriaModel: typeof Categoria,
    ) { }

    async create(dto: CreateVideojuegoDto, imagen?: Express.Multer.File) {
        try {
            const categoria = await this.categoriaModel.findOne({
                where: {
                    id: dto.categoriaId,
                    activo: true,
                },
            });

            if (!categoria) {
                throw new NotFoundException('La categoría no existe o está inactiva');
            }

            const videojuego = await this.videojuegoModel.create({
                nombre: dto.nombre.trim(),
                descripcion: dto.descripcion ?? null,
                imagenUrl: imagen ? `/uploads/videojuegos/${imagen.filename}` : null,
                precio: dto.precio,
                categoriaId: dto.categoriaId,
                plataforma: dto.plataforma ?? null,
                totalJugadores: dto.totalJugadores ?? 0,
                totalVentas: dto.totalVentas ?? 0,
                destacado: dto.destacado ?? false,
                activo: true,
            } as Videojuego);

            return {
                message: 'Videojuego creado correctamente',
                videojuego,
            };
        } catch (error) {
            if (imagen) {
                const ruta = join(
                    process.cwd(),
                    'uploads',
                    'videojuegos',
                    imagen.filename,
                );

                await unlink(ruta).catch(() => undefined);
            }

            throw error;
        }
    }

    async findAll(pagina = 1, limite = 12, categoriaId?: string) {
        const page = Math.max(1, pagina);
        const limit = Math.min(50, Math.max(1, limite));

        const where = {
            activo: true,
            ...(categoriaId ? { categoriaId } : {}),
        };

        const { rows, count } = await this.videojuegoModel.findAndCountAll({
            where,
            include: [
                {
                    model: Categoria,
                    attributes: ['id', 'nombre'],
                },
            ],
            order: [['createdAt', 'DESC']],
            limit,
            offset: (page - 1) * limit,
        });

        return {
            data: rows,
            paginacion: {
                total: count,
                pagina: page,
                limite: limit,
                totalPaginas: Math.ceil(count / limit),
            },
        };
    }

    
    async findAllAdmin(pagina = 1, limite = 12, categoriaId?: string) {
        const page = Math.max(1, pagina);
        const limit = Math.min(50, Math.max(1, limite));

        const where = {
            ...(categoriaId ? { categoriaId } : {}),
        };

        const { rows, count } = await this.videojuegoModel.findAndCountAll({
            where,
            include: [
                {
                    model: Categoria,
                    attributes: ['id', 'nombre'],
                },
            ],
            order: [['createdAt', 'DESC']],
            limit,
            offset: (page - 1) * limit,
        });

        return {
            data: rows,
            paginacion: {
                total: count,
                pagina: page,
                limite: limit,
                totalPaginas: Math.ceil(count / limit),
            },
        };
    }

    async findMasJugados() {
        return this.videojuegoModel.findAll({
            where: { activo: true },
            include: [
                {
                    model: Categoria,
                    attributes: ['id', 'nombre'],
                },
            ],
            order: [
                ['totalJugadores', 'DESC'],
                ['nombre', 'ASC'],
            ],
            limit: 10,
        });
    }

    async findMasVendidos() {
        return this.videojuegoModel.findAll({
            where: { activo: true },
            include: [
                {
                    model: Categoria,
                    attributes: ['id', 'nombre'],
                },
            ],
            order: [
                ['totalVentas', 'DESC'],
                ['nombre', 'ASC'],
            ],
            limit: 10,
        });
    }

    async findDestacados() {
        return this.videojuegoModel.findAll({
            where: {
                activo: true,
                destacado: true,
            },
            include: [
                {
                    model: Categoria,
                    attributes: ['id', 'nombre'],
                },
            ],
            order: [['createdAt', 'DESC']],
            limit: 10,
        });
    }

    async findOne(id: string) {
        const videojuego = await this.videojuegoModel.findOne({
            where: {
                id,
                activo: true,
            },
            include: [
                {
                    model: Categoria,
                    attributes: ['id', 'nombre'],
                },
            ],
        });

        if (!videojuego) {
            throw new NotFoundException('Videojuego no encontrado');
        }

        return videojuego;
    }


    async update(
        id: string,
        dto: UpdateVideojuegoDto,
        imagen?: Express.Multer.File,
    ) {
        try {
            const videojuego = await this.videojuegoModel.findByPk(id);

            if (!videojuego) {
                throw new NotFoundException('Videojuego no encontrado');
            }

            if (dto.categoriaId) {
                const categoria = await this.categoriaModel.findOne({
                    where: {
                        id: dto.categoriaId,
                        activo: true,
                    },
                });

                if (!categoria) {
                    throw new NotFoundException('Categoría no encontrada');
                }
            }

            const imagenAnterior = videojuego.imagenUrl;

            await videojuego.update({
                ...dto,
                ...(dto.nombre !== undefined
                    ? { nombre: dto.nombre.trim() }
                    : {}),
                ...(imagen
                    ? { imagenUrl: `/uploads/videojuegos/${imagen.filename}` }
                    : {}),
            });

            if (imagen && imagenAnterior?.startsWith('/uploads/videojuegos/')) {
                const rutaAnterior = join(
                    process.cwd(),
                    imagenAnterior.replace(/^\/uploads\//, 'uploads/'),
                );

                await unlink(rutaAnterior).catch(() => undefined);
            }

            return {
                message: 'Videojuego actualizado correctamente',
                videojuego,
            };
        } catch (error) {
            if (imagen) {
                const rutaNueva = join(
                    process.cwd(),
                    'uploads',
                    'videojuegos',
                    imagen.filename,
                );

                await unlink(rutaNueva).catch(() => undefined);
            }

            throw error;
        }
    }


    async remove(id: string) {
        const videojuego = await this.videojuegoModel.findByPk(id);

        if (!videojuego) {
            throw new NotFoundException('Videojuego no encontrado');
        }

        const imagenUrl = videojuego.imagenUrl;

        await videojuego.destroy();

        if (imagenUrl?.startsWith('/uploads/videojuegos/')) {
            const rutaImagen = join(
                process.cwd(),
                imagenUrl.replace(/^\/uploads\//, 'uploads/'),
            );

            await unlink(rutaImagen).catch((error) => {
                console.error('Error al eliminar la imagen:', error);
            });
        }

        return {
            message: 'Videojuego eliminado definitivamente',
            id,
        };
    }


}
