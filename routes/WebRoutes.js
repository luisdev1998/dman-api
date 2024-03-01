import express from 'express';
import { getListaInformacion, getProyectoInformacion } from '../controllers/WebController.js';

const router = express.Router();

router.route('/')
.get(getListaInformacion)
router.route('/proyecto/:id')
.get(getProyectoInformacion)

export default router;