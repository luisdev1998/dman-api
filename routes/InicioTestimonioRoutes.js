import express from 'express';
import checkAuth from '../middleware/checkAuth.js';
import {uploadTestimonio} from '../middleware/multer.js';
import responseFormat from '../helpers/responseFormat.js';
import { getInicioTestimonio, createInicioTestimonio, deleteInicioTestimonio, updateInicioTestimonio, updatePositionInicioTestimonio } from '../controllers/InicioTestimonioController.js';

const router = express.Router();

router.route('/')
.get(checkAuth, getInicioTestimonio)
.post(checkAuth, uploadTestimonio.array('archivo'), (req, res, next) => {
    if (req.fileValidationError) {
        return res.status(200).json(responseFormat(false,400,req.path,req.fileValidationError,[]));
    }
    if (req.multerError) {
        return res.status(200).json(responseFormat(false,400,req.path,req.multerError.message,[]));
    }
    next();
}, createInicioTestimonio);
router.route('/position').
post(checkAuth, updatePositionInicioTestimonio);
router.route('/:id')
.delete(checkAuth, deleteInicioTestimonio)
.patch(checkAuth, updateInicioTestimonio);

export default router;