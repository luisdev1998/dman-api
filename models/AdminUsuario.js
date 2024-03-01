import Sequelize from 'sequelize';
import db from '../config/db.js';
import bcrypt from 'bcrypt';

export const AdminUsuario = db.define('ADMIN_USUARIO', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    correo: { type: Sequelize.STRING },
    clave: { type: Sequelize.TEXT },
    estado: { type: Sequelize.BOOLEAN }
});

// Método para comprar clave
AdminUsuario.prototype.compararClave = async function(claveEntrada) {
    return await bcrypt.compare(claveEntrada, this.clave);
};