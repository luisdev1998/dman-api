import Sequelize from 'sequelize';
import db from '../config/db.js';

export const Informacion = db.define('INFORMACION', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    numero: { type: Sequelize.STRING },
    email: { type: Sequelize.STRING },
    ubicacion: { type: Sequelize.STRING },
    ruta: { type: Sequelize.STRING },
    imagen_1_archivo: { type: Sequelize.STRING },
    imagen_2_archivo: { type: Sequelize.STRING },
    imagen_3_archivo: { type: Sequelize.STRING },
    video_1_archivo: { type: Sequelize.STRING },
    video_2_archivo: { type: Sequelize.STRING },
    ubicacion_url: { type: Sequelize.STRING },
    facebook: { type: Sequelize.STRING },
    youtube: { type: Sequelize.STRING },
    instagram: { type: Sequelize.STRING },
    tiktok: { type: Sequelize.STRING },
    whatsapp: { type: Sequelize.STRING },
    email_remitente: { type: Sequelize.STRING },
    clave_email_remitente: { type: Sequelize.STRING },
    email_receptor: { type: Sequelize.STRING }
},
{
    tableName: 'INFORMACION',
    freezeTableName: true
}
);