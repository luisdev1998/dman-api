import express from 'express';
import checkAuth from '../middleware/checkAuth.js';
import {uploadBanner} from '../middleware/multer.js';
import responseFormat from '../helpers/responseFormat.js';
import { getInicioBanner, createInicioBanner, deleteInicioBanner, updateInicioBanner, updatePositionInicioBanner } from '../controllers/InicioBannerController.js';
import imageSize from '../middleware/imageSize.js';

const router = express.Router();

router.route('/')
.get(checkAuth, getInicioBanner)
.post(checkAuth, uploadBanner.single('archivo'), imageSize, (req, res, next) => {
    if (req.fileValidationError) {
        return res.status(200).json(responseFormat(false,400,req.path,req.fileValidationError,[]));
    }
    if (req.multerError) {
        return res.status(200).json(responseFormat(false,400,req.path,req.multerError.message,[]));
    }
    next();
}, createInicioBanner);
router.route('/position').
post(checkAuth, updatePositionInicioBanner);
router.route('/:id')
.delete(checkAuth, deleteInicioBanner)
.patch(checkAuth, updateInicioBanner);

export default router;