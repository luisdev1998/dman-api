import express from 'express';
import { login,perfil,registrarUsuario } from '../controllers/AdminUsuarioController.js';
import checkAuth from '../middleware/checkAuth.js'

const router = express.Router();

router.post('/login', login);
router.get('/perfil', checkAuth, perfil);
router.post('/', checkAuth, registrarUsuario);

export default router;