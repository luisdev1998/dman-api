import Sequelize from 'sequelize';
import db from '../config/db.js';

export const InicioTestimonio = db.define('INICIO_TESTIMONIO', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    posicion : { type: Sequelize.INTEGER },
    ruta: { type: Sequelize.TEXT },
    archivo: { type: Sequelize.STRING },
    estado: { type: Sequelize.INTEGER }
});