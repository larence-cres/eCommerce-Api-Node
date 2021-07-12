import { Controller, Get, Param, Post, Res, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import path = require('path');
import { v4 as uuidv4 } from 'uuid';

@Controller('')
export class UploadController {

    @Post('upload')
    @UseInterceptors(FilesInterceptor('images', 10, {
        storage:
            diskStorage({
                destination: './uploads',
                filename: (req, file, cb) => {
                    const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
                    const extension: string = path.parse(file.originalname).ext;

                    return cb(null, `${filename}${extension}`)
                }
            })
    }))
    async uploadFile(
        @UploadedFiles() images: Array<Express.Multer.File>
    ) {
        const imagePaths = Array<string>();

        await Promise.all(images.map(async (image) => {
            const imagePath = `http://localhost:3000/api/image/${image.filename}`;
            imagePaths.push(imagePath);
        }));
        return await { images: imagePaths };
    }

    @Get('image/:imageId')
    async serveImage(@Param('imageId') imageId, @Res() res): Promise<any> {
        res.sendFile(imageId, { root: 'uploads' });
    }

}