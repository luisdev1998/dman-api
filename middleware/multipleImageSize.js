import sharp from 'sharp';
import responseFormat from '../helpers/responseFormat.js';
import fs from 'fs/promises';

const multipleImageSize = async (req, res, next) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(200).json(responseFormat(false,400,req.path,'No se encontraron archivos de imagen.',{}));
    }

    let validationErrors = [];

    try {
        for (const [fieldName, files] of Object.entries(req.files)) {
            // Procesa solo campos de imagen, ignorando los videos u otros tipos de archivos
            if (fieldName.startsWith('imagen_')) {
                // Itera sobre cada archivo dentro del campo actual
                await Promise.all(files.map(async (file) => {
                    const metadata = await sharp(file.path).metadata();

                    if (metadata.width > 1920 || metadata.height > 1080) {
                        // Si la imagen es demasiado grande, la elimina
                        await fs.unlink(file.path);
                        validationErrors.push(`${file.originalname} supera las dimensiones máximas de 1920x1080 píxeles.`);
                    }
                }));
            }
        }

        // Verifica si se recolectaron errores de validación
        if (validationErrors.length > 0) {
            req.fileValidationError = validationErrors.join('. ');
            return res.status(200).json(responseFormat(false,400,req.path,req.fileValidationError,{}));
        }

        next();
    } catch (error) {
        console.error('Error al procesar las imágenes:', error);
        return res.status(200).json(responseFormat(false,500,req.path,'Error al procesar las imágenes.',{}));
    }
};

export default multipleImageSize
