import express from 'express';
import { login,perfil } from '../controllers/AdminUsuarioController.js';
import checkAuth from '../middleware/checkAuth.js'

const router = express.Router();

router.post('/login', login);
router.get('/perfil', checkAuth, perfil);

export default router;