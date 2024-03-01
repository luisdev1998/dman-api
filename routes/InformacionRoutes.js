import express from 'express';
import { getInformacion,patchInformacion,patchArchivos } from '../controllers/InformacionController.js';
import { uploadInformacion } from '../middleware/multer.js';
import checkAuth from '../middleware/checkAuth.js'

const router = express.Router();

router
.get('/', checkAuth, getInformacion);
router
.patch('/', checkAuth, patchInformacion)
.patch('/archivos',checkAuth, uploadInformacion.fields([
    { name: 'imagen_1_archivo', maxCount: 1 },
    { name: 'imagen_2_archivo', maxCount: 1 },
    { name: 'imagen_3_archivo', maxCount: 1 },
    { name: 'video_1_archivo', maxCount: 1 },
    { name: 'video_2_archivo', maxCount: 1 }
  ]), (req, res, next) => {
    if (req.fileValidationError) {
        return res.status(200).json(responseFormat(false,400,req.path,req.fileValidationError,[]));
    }
    if (req.multerError) {
        return res.status(200).json(responseFormat(false,400,req.path,req.multerError.message,[]));
    }
    next();
}, patchArchivos);

export default router;