import { Proyecto,ProyectoConocenos,ProyectoBeneficio } from '../models/Proyecto.js';
import responseFormat from '../helpers/responseFormat.js';
import Sequelize from 'sequelize';
import db from '../config/db.js';

const getProyecto = async (req, res) => {
    try {
        const proyectos = await Proyecto.findAll(
            {
                order:[
                    ['posicion','ASC']
                ],
                where: {
                    estado: {
                        [Sequelize.Op.ne]: 3
                    }
                }
            }
        );
        const prefijoRuta = process.env.API_URL;
        const listaProyectos = proyectos.map(proyecto => {
            return {
                ...proyecto.toJSON(),
                imagen_archivo: prefijoRuta + proyecto.ruta + proyecto.imagen_archivo,
                banner_archivo: prefijoRuta + proyecto.ruta + proyecto.banner_archivo,
                referencia_archivo: prefijoRuta + proyecto.ruta + proyecto.referencia_archivo
            };
        });
        return res.status(200).json(responseFormat(true,200,req.path,'Éxito',listaProyectos));
    } catch (error) {
        console.log(error)
        return res.status(200).json(responseFormat(false,500,req.path,'Error al obtener los proyectos',[]));
    }
};

const createProyecto = async (req, res) => {
    const t = await db.transaction();
    try {
        const {titulo, estado_descripcion, direccion, metrajes, descripcion, video_url, mapa_url} = req.body;
        let proyecto = {titulo, estado:1, direccion, metrajes, estado_descripcion, descripcion, video_url, mapa_url, ruta:"/uploads/proyectos/"}
        
        if (req.files.imagen_archivo && req.files.imagen_archivo.length > 0) {
            proyecto.imagen_archivo = req.files.imagen_archivo[0].filename;
        }

        if (req.files.banner_archivo && req.files.banner_archivo.length > 0) {
            proyecto.banner_archivo = req.files.banner_archivo[0].filename;
        }

        if (req.files.referencia_archivo && req.files.referencia_archivo.length > 0) {
            proyecto.referencia_archivo = req.files.referencia_archivo[0].filename;
        }

        const ultimoProyecto = await Proyecto.findOne({
            order: [['posicion', 'DESC']],
            transaction: t
        });
        const nuevaPosicion = ultimoProyecto ? ultimoProyecto.posicion + 1 : 1;
        proyecto.posicion = nuevaPosicion;

        const nuevoProyecto = await Proyecto.create(proyecto, { transaction: t });

        await t.commit();
        return res.status(200).json(responseFormat(true,200,req.path,'Proyecto creado con éxito',nuevoProyecto));
    } catch (error) {
        console.log(error);
        await t.rollback();
        return res.status(200).json(responseFormat(false,500,req.path,'Error al crear el proyecto',[]));
    }
};

const deleteProyecto = async (req, res) => {
    const t = await db.transaction();
    try {
        const { id } = req.params;
        const proyecto = await Proyecto.findByPk(id);
        if (!proyecto) {
            return res.status(404).json(responseFormat(false,404,req.path,'Proyecto no encontrado',[]));
        }
        await proyecto.update({ estado: 3 }, { where: { id: proyecto.id } }, { transaction: t });
        await t.commit();
        return res.status(200).json(responseFormat(true,200,req.path,'Proyecto eliminado correctamente',[]));
    } catch (error) {
        await t.rollback();
        return res.status(200).json(responseFormat(false,500,req.path,'Error al eliminar el Proyecto',[]));
    }
};

const estadoProyecto = async (req, res) => {
    const t = await db.transaction();
    try{
        const { id } = req.params;
        const proyecto = await Proyecto.findByPk(id);
        if (!proyecto) {
            return res.status(200).json(responseFormat(false,404,req.path,'Proyecto no encontrado',[]));
        }
        if(proyecto.estado == 1){
            await proyecto.update({ estado: 2 }, { transaction: t });
        } else if (proyecto.estado == 2){
            await proyecto.update({ estado: 1 }, { transaction: t });
        }
        await t.commit();
        return res.status(200).json(responseFormat(true,200,req.path,'Estado de proyecto actualizado',[]));
    }catch(error){
        await t.rollback();
        return res.status(200).json(responseFormat(false,500,req.path,'Error al actualizar el Proyecto',[]));
    }
};

const updateProyecto = async (req, res) => {
    const t = await db.transaction();
    try {
        const { id } = req.params;
        const proyecto = await Proyecto.findByPk(id);
        if (!proyecto) {
            return res.status(200).json(responseFormat(false,404,req.path,'Proyecto no encontrado',[]));
        }

        const { titulo,estado_descripcion,direccion,metrajes,descripcion,video_url,mapa_url } = req.body
        const proyectoActualizado = { titulo,estado_descripcion,direccion,metrajes,descripcion,video_url,mapa_url };

        if (req.files.imagen_archivo && req.files.imagen_archivo.length > 0) {
            proyectoActualizado.imagen_archivo = req.files.imagen_archivo[0].filename;
        }

        if (req.files.banner_archivo && req.files.banner_archivo.length > 0) {
            proyectoActualizado.banner_archivo = req.files.banner_archivo[0].filename;
        }

        if (req.files.referencia_archivo && req.files.referencia_archivo.length > 0) {
            proyectoActualizado.referencia_archivo = req.files.referencia_archivo[0].filename;
        }

        await proyecto.update(proyectoActualizado, { transaction: t });
        await t.commit();
        return res.status(200).json(responseFormat(true,200,req.path,'Proyecto actualizado',[]));
    } catch (error) {
        console.log(error)
        await t.rollback();
        return res.status(200).json(responseFormat(false,500,req.path,'Error al actualizar el Proyecto',[]));
    }
}

const getProyectoById = async (req, res) => {
    const { id } = req.params;
    const prefijoRuta = process.env.API_URL;
    try {
        let proyectoDetalle = await Proyecto.findByPk(id, {
            include: [
                {
                    model: ProyectoConocenos,
                    where: {
                        estado: {
                            [Sequelize.Op.ne]: 3
                        }
                    },
                    required: false
                },
                {
                    model: ProyectoBeneficio,
                    where: {
                        estado: {
                            [Sequelize.Op.ne]: 3
                        }
                    },
                    required: false
                }
            ],
            order: [
                [ProyectoConocenos, 'posicion', 'ASC'],
                [ProyectoBeneficio, 'posicion', 'ASC']
            ]
        });

        if (!proyectoDetalle) {
            return res.status(200).json(responseFormat(false, 404, req.path, 'Proyecto no encontrado', {}));
        }

        proyectoDetalle = proyectoDetalle.toJSON();

        proyectoDetalle.imagen_archivo = prefijoRuta + proyectoDetalle.ruta + proyectoDetalle.imagen_archivo;
        proyectoDetalle.banner_archivo = prefijoRuta + proyectoDetalle.ruta + proyectoDetalle.banner_archivo;
        proyectoDetalle.referencia_archivo = prefijoRuta + proyectoDetalle.ruta + proyectoDetalle.referencia_archivo;

        if (proyectoDetalle.PROYECTOS_CONOCENOs) {
            const conocenosModificados = proyectoDetalle.PROYECTOS_CONOCENOs.map(conocenos => ({
                ...conocenos,
                imagen_archivo: prefijoRuta + proyectoDetalle.ruta + conocenos.imagen_archivo
            }));
            proyectoDetalle.PROYECTOS_CONOCENOs = conocenosModificados;
        }

        return res.status(200).json(responseFormat(true, 200, req.path, 'Éxito', proyectoDetalle));
    } catch (error) {
        console.log(error);
        return res.status(200).json(responseFormat(false, 500, req.path, 'Error al obtener el detalle del proyecto', {}));
    }
};

const createBeneficio = async (req, res) => {
    const { id } = req.params;
    const { logo, descripcion } = req.body;
    const t = await db.transaction();
    try {
        const proyecto = await Proyecto.findByPk(id);
        if (!proyecto) {
            return res.status(404).json(responseFormat(false,404,req.path,'Proyecto no encontrado',[]));
        }
        const ultimoBeneficio = await ProyectoBeneficio.findOne(
            {
                order: [['posicion', 'DESC']],
                where: {
                    id_proyectos:id
                }
            }
        );
        const nuevaPosicion = ultimoBeneficio ? ultimoBeneficio.posicion + 1 : 1;
        const nuevoProyecto = await ProyectoBeneficio.create(
            { 
                id_proyectos:id,
                posicion: nuevaPosicion,
                estado: 1,
                logo,
                descripcion
             },
            { transaction: t }
        );
        await t.commit();
        return res.status(200).json(responseFormat(true,200,req.path,'Éxito',nuevoProyecto));
    } catch (error) {
        console.log(error);
        await t.rollback();
        return res.status(200).json(responseFormat(false,500,req.path,'Error al crear el beneficio',[]));
    }
};

const createConocenos = async (req, res) => {
    const { id } = req.params;
    const { descripcion } = req.body;
    const t = await db.transaction();
    try {
        const proyecto = await Proyecto.findByPk(id);
        if (!proyecto) {
            return res.status(404).json(responseFormat(false,404,req.path,'Proyecto no encontrado',[]));
        }
        const ultimoConocenos = await ProyectoConocenos.findOne(
            {
                order: [['posicion', 'DESC']],
                where: {
                    id_proyectos:id
                }
            }
        );
        const nuevaPosicion = ultimoConocenos ? ultimoConocenos.posicion + 1 : 1;

        let conocenos = {id_proyectos: id, posicion:nuevaPosicion, estado:1, descripcion};
        if (req.files.imagen_archivo && req.files.imagen_archivo.length > 0) {
            conocenos.imagen_archivo = req.files.imagen_archivo[0].filename;
        }
        
        const nuevoConocenos = await ProyectoConocenos.create(conocenos, { transaction: t });
        await t.commit();
        return res.status(200).json(responseFormat(true,200,req.path,'Éxito',nuevoConocenos));
    } catch (error) {
        console.log(error);
        await t.rollback();
        return res.status(200).json(responseFormat(false,500,req.path,'Error al crear el archivo',[]));
    }
}

const estadoBeneficio = async (req, res) => {
    const t = await db.transaction();
    try{
        const { id } = req.params;
        const beneficio = await ProyectoBeneficio.findByPk(id);
        if (!beneficio) {
            return res.status(200).json(responseFormat(false,404,req.path,'Beneficio no encontrado',[]));
        }
        if(beneficio.estado == 1){
            await beneficio.update({ estado: 2 }, { transaction: t });
        } else if (beneficio.estado == 2){
            await beneficio.update({ estado: 1 }, { transaction: t });
        }
        await t.commit();
        return res.status(200).json(responseFormat(true,200,req.path,'Beneficio actualizado',[]));
    }catch(error){
        await t.rollback();
        return res.status(200).json(responseFormat(false,500,req.path,'Error al actualizar el Beneficio',[]));
    }
}

const deleteBeneficio = async (req, res) => {
    const t = await db.transaction();
    try {
        const { id } = req.params;
        const beneficio = await ProyectoBeneficio.findByPk(id);
        if (!beneficio) {
            return res.status(404).json(responseFormat(false,404,req.path,'Beneficio no encontrado',[]));
        }
        await beneficio.update({ estado: 3 }, { transaction: t });
        await t.commit();
        return res.status(200).json(responseFormat(true,200,req.path,'Beneficio eliminado correctamente',[]));
    } catch (error) {
        await t.rollback();
        return res.status(200).json(responseFormat(false,500,req.path,'Error al eliminar el Beneficio',[]));
    }
};

const estadoConocenos = async (req, res) => {
    const t = await db.transaction();
    try{
        const { id } = req.params;
        const conocenos = await ProyectoConocenos.findByPk(id);
        if (!conocenos) {
            return res.status(200).json(responseFormat(false,404,req.path,'No encontrado',[]));
        }
        if(conocenos.estado == 1){
            await conocenos.update({ estado: 2 }, { transaction: t });
        } else if (conocenos.estado == 2){
            await conocenos.update({ estado: 1 }, { transaction: t });
        }
        await t.commit();
        return res.status(200).json(responseFormat(true,200,req.path,'Actualizado',[]));
    }catch(error){
        await t.rollback();
        return res.status(200).json(responseFormat(false,500,req.path,'Error al actualizar',[]));
    }
}

const deleteConocenos = async (req, res) => {
    const t = await db.transaction();
    try {
        const { id } = req.params;
        const conocenos = await ProyectoConocenos.findByPk(id);
        if (!conocenos) {
            return res.status(404).json(responseFormat(false,404,req.path,'No encontrado',[]));
        }
        await conocenos.update({ estado: 3 }, { transaction: t });
        await t.commit();
        return res.status(200).json(responseFormat(true,200,req.path,'Eliminado correctamente',[]));
    } catch (error) {
        await t.rollback();
        return res.status(200).json(responseFormat(false,500,req.path,'Error al eliminar',[]));
    }
};

const updatePositionConocenos = async (req, res) => {
    const t = await db.transaction();
    try {
        const {dragid, dropid} = req.body;
        const dragBanner = await ProyectoConocenos.findByPk(dragid);
        const dropBanner = await ProyectoConocenos.findByPk(dropid);
        if (!dragBanner || !dropBanner) {
            return res.status(200).json(responseFormat(false,404,req.path,'Archivo no encontrado',[]));
        }
        const posicionDrag = dragBanner.posicion
        const posicionDrop = dropBanner.posicion
        await dragBanner.update({ posicion: posicionDrop }, { transaction: t });
        await dropBanner.update({ posicion: posicionDrag }, { transaction: t });
        await t.commit();
        return res.status(200).json(responseFormat(true,200,req.path,'Archivo actualizado',[]));
    } catch (error) {
        await t.rollback();
        return res.status(200).json(responseFormat(false,500,req.path,'Error al actualizar el Archivo',[]));
    }
}

const updatePositionProyecto = async (req, res) => {
    const t = await db.transaction();
    try {
        const {dragid, dropid} = req.body;
        const dragBanner = await Proyecto.findByPk(dragid);
        const dropBanner = await Proyecto.findByPk(dropid);
        if (!dragBanner || !dropBanner) {
            return res.status(200).json(responseFormat(false,404,req.path,'Proyecto no encontrado',[]));
        }
        const posicionDrag = dragBanner.posicion
        const posicionDrop = dropBanner.posicion
        await dragBanner.update({ posicion: posicionDrop }, { transaction: t });
        await dropBanner.update({ posicion: posicionDrag }, { transaction: t });
        await t.commit();
        return res.status(200).json(responseFormat(true,200,req.path,'Proyecto actualizado',[]));
    } catch (error) {
        await t.rollback();
        return res.status(200).json(responseFormat(false,500,req.path,'Error al actualizar el Proyecto',[]));
    }
}


export {
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
    updatePositionConocenos,
    updatePositionProyecto
}