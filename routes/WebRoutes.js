import express from 'express';
import { getListaInformacion, getProyectoInformacion,postEnviarEmail } from '../controllers/WebController.js';

const router = express.Router();

router.route('/')
.get(getListaInformacion)
router.route('/proyecto/:id')
.get(getProyectoInformacion)
router.route('/email/:id')
.post(postEnviarEmail)

export default router;