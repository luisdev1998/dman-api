import sharp from 'sharp';
import fs from 'fs';
import responseFormat from '../helpers/responseFormat.js';

const imageSize = async (req, res, next) => {
  if (!req.file) {
    return res.status(200).json(responseFormat(false,400,req.path,'No se encontró el archivo de imagen.',{}));
  }

  try {
    const { width, height } = await sharp(req.file.path).metadata();

    if (width > 1920 || height > 1080) {
      // Si la imagen es demasiado grande, elimínala y envía un error
      await fs.promises.unlink(req.file.path);
      return res.status(200).json(responseFormat(false,200,req.path,'La imagen supera las dimensiones máximas de 1920x1080 píxeles.',{}));
    }

    next(); // Continúa si la imagen cumple los requisitos
  } catch (error) {
    console.error('Error al procesar la imagen:', error);
    return res.status(200).json(responseFormat(false,500,req.path,'Error al procesar la imagen.',{}));
  }
};

export default imageSize