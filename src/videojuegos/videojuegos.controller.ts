import { Body, Controller, DefaultValuePipe, Delete, Get, HttpStatus, Param, ParseFilePipeBuilder, ParseIntPipe, ParseUUIDPipe, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { VideojuegosService } from './videojuegos.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { videojuegosStorage } from './config/multer.config';
import { CreateVideojuegoDto } from './dto/create-videojuego.dto';
import { UpdateVideojuegoDto } from './dto/update-videojuego.dto';

@ApiTags('Videojuegos')
@Controller('videojuegos')
export class VideojuegosController {
    constructor(
        private readonly videojuegosService: VideojuegosService,
    ) { }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @ApiBearerAuth()
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            required: ['nombre', 'precio', 'categoriaId'],
            properties: {
                nombre: { type: 'string', example: 'Minecraft' },
                descripcion: {
                    type: 'string',
                    example: 'Videojuego de construcción y aventura',
                },
                precio: {
                    type: 'number',
                    example: 499.99,
                },
                categoriaId: {
                    type: 'string',
                    format: 'uuid',
                },
                plataforma: {
                    type: 'string',
                    example: 'PC',
                },
                totalJugadores: {
                    type: 'integer',
                    example: 250000,
                },
                totalVentas: {
                    type: 'integer',
                    example: 10000,
                },
                destacado: {
                    type: 'boolean',
                    example: true,
                },
                imagen: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @UseInterceptors(
        FileInterceptor('imagen', {
            storage: videojuegosStorage,
            limits: {
                fileSize: 5 * 1024 * 1024,
            },
        }),
    )
    create(
        @Body() dto: CreateVideojuegoDto,
        @UploadedFile(
            new ParseFilePipeBuilder()
                .addFileTypeValidator({
                    fileType: /image\/(jpeg|png|webp)/,
                })
                .build({
                    fileIsRequired: false,
                    errorHttpStatusCode: HttpStatus.BAD_REQUEST,
                }),
        )
        imagen?: Express.Multer.File,
    ) {
        return this.videojuegosService.create(dto, imagen);
    }



    @Get()
    findAll(
        @Query(
            'pagina',
            new DefaultValuePipe(1),
            ParseIntPipe,
        )
        pagina: number,

        @Query(
            'limite',
            new DefaultValuePipe(12),
            ParseIntPipe,
        )
        limite: number,

        @Query('categoriaId') categoriaId?: string,
    ) {
        return this.videojuegosService.findAll(
            pagina,
            limite,
            categoriaId,
        );
    }

    @Get('mas-jugados')
    findMasJugados() {
        return this.videojuegosService.findMasJugados();
    }

    @Get('mas-vendidos')
    findMasVendidos() {
        return this.videojuegosService.findMasVendidos();
    }

    @Get('destacados')
    findDestacados() {
        return this.videojuegosService.findDestacados();
    }

    // Esta ruta debe ir después de las rutas anteriores.
    @Get(':id')
    findOne(
        @Param('id', new ParseUUIDPipe({ version: '4' }))
        id: string,
    ) {
        return this.videojuegosService.findOne(id);
    }


    @Put(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @ApiBearerAuth()
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                nombre: { type: 'string' },
                descripcion: { type: 'string' },
                precio: { type: 'number' },
                categoriaId: { type: 'string', format: 'uuid' },
                plataforma: { type: 'string' },
                totalJugadores: { type: 'integer' },
                totalVentas: { type: 'integer' },
                destacado: { type: 'boolean' },
                imagen: { type: 'string', format: 'binary' },
            },
        },
    })
    @UseInterceptors(
        FileInterceptor('imagen', {
            storage: videojuegosStorage,
            limits: {
                fileSize: 5 * 1024 * 1024,
            },
        }),
    )
    update(
        @Param('id', new ParseUUIDPipe({ version: '4' }))
        id: string,
        @Body() dto: UpdateVideojuegoDto,
        @UploadedFile(
            new ParseFilePipeBuilder()
                .addFileTypeValidator({
                    fileType: /image\/(jpeg|png|webp)/,
                })
                .build({
                    fileIsRequired: false,
                    errorHttpStatusCode: HttpStatus.BAD_REQUEST,
                }),
        )
        imagen?: Express.Multer.File,
    ) {
        return this.videojuegosService.update(id, dto, imagen);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @ApiBearerAuth()
    remove(
        @Param('id', new ParseUUIDPipe({ version: '4' }))
        id: string,
    ) {
        return this.videojuegosService.remove(id);
    }


}