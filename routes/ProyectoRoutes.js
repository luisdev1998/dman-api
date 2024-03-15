import express from 'express';
import checkAuth from '../middleware/checkAuth.js';
import { uploadProyecto } from '../middleware/multer.js';
import responseFormat from '../helpers/responseFormat.js';
import { 
    getProyecto, 
    createProyecto, 
    deleteProyecto, 
    estadoProyecto,
    updateProyecto,
    getProyectoById,
    createBeneficio,
    createConocenos,
    estadoBeneficio,
    deleteBeneficio,
    estadoConocenos,
    deleteConocenos,
    updatePositionConocenos
  } from '../controllers/ProyectosController.js';


const router = express.Router();

router.route('/')
.get(checkAuth, getProyecto)
.post(checkAuth, uploadProyecto.fields([
    { name: 'imagen_archivo', maxCount: 1 },
    { name: 'banner_archivo', maxCount: 1 },
    { name: 'referencia_archivo', maxCount: 1 }
  ]), (req, res, next) => {
    if (req.fileValidationError) {
        return res.status(200).json(responseFormat(false,400,req.path,req.fileValidationError,[]));
    }
    if (req.multerError) {
        return res.status(200).json(responseFormat(false,400,req.path,req.multerError.message,[]));
    }
    next();
}, createProyecto);
router.route('/:id')
.get(checkAuth, getProyectoById)
.delete(checkAuth, deleteProyecto)
.patch(checkAuth, estadoProyecto)

router.route('/actualizar/:id')
.patch(checkAuth, uploadProyecto.fields([
    { name: 'imagen_archivo', maxCount: 1 },
    { name: 'banner_archivo', maxCount: 1 },
    { name: 'referencia_archivo', maxCount: 1 }
  ]), (req, res, next) => {
    if (req.fileValidationError) {
        return res.status(200).json(responseFormat(false,400,req.path,req.fileValidationError,[]));
    }
    if (req.multerError) {
        return res.status(200).json(responseFormat(false,400,req.path,req.multerError.message,[]));
    }
    next();
}, updateProyecto);

router.route('/:id/beneficio')
.post(checkAuth, createBeneficio)
router.route('/:id/conocenos')
.post(checkAuth,uploadProyecto.fields([
    { name:'imagen_archivo',maxCount:1}
]), createConocenos)
.patch(checkAuth, updatePositionConocenos)


router.route('/:idProyecto/beneficio/:id')
.patch(checkAuth, estadoBeneficio)
.delete(checkAuth, deleteBeneficio)
router.route('/:idProyecto/conocenos/:id')
.patch(checkAuth, estadoConocenos)
.delete(checkAuth, deleteConocenos)

export default router;