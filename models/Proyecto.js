import Sequelize from 'sequelize';
import db from '../config/db.js';

export const Proyecto = db.define('PROYECTOS', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    titulo: { type: Sequelize.STRING, allowNull: false },
    estado_descripcion: { type: Sequelize.STRING, allowNull: false },
    estado: { type: Sequelize.INTEGER, allowNull: false },
    direccion: { type: Sequelize.STRING, allowNull: false },
    metrajes: { type: Sequelize.STRING, allowNull: false },
    descripcion: { type: Sequelize.STRING, allowNull: false },
    video_url: { type: Sequelize.STRING, allowNull: false },
    mapa_url: { type: Sequelize.STRING, allowNull: false },
    ruta: { type: Sequelize.STRING, allowNull: false },
    imagen_archivo: { type: Sequelize.STRING, allowNull: false },
    banner_archivo: { type: Sequelize.STRING, allowNull: false },
    referencia_archivo: { type: Sequelize.STRING, allowNull: false },
});

export const ProyectoConocenos = db.define('PROYECTOS_CONOCENOS', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    posicion: { type: Sequelize.INTEGER, allowNull: false },
    estado: { type: Sequelize.INTEGER, allowNull: false },
    descripcion: { type: Sequelize.STRING, allowNull: false },
    imagen_archivo: { type: Sequelize.STRING, allowNull: false },
});

export const ProyectoBeneficio = db.define('PROYECTOS_BENEFICIOS', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    posicion: { type: Sequelize.INTEGER, allowNull: false },
    estado: { type: Sequelize.INTEGER, allowNull: false },
    logo: { type: Sequelize.STRING, allowNull: false },
    descripcion: { type: Sequelize.STRING, allowNull: false },
});

// Relaciones
ProyectoConocenos.belongsTo(Proyecto, { foreignKey: 'id_proyectos' });
Proyecto.hasMany(ProyectoConocenos, { foreignKey: 'id_proyectos' });

ProyectoBeneficio.belongsTo(Proyecto, { foreignKey: 'id_proyectos' });
Proyecto.hasMany(ProyectoBeneficio, { foreignKey: 'id_proyectos' });
