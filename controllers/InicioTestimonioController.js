import { InicioTestimonio } from '../models/InicioTestimonio.js';
import responseFormat from '../helpers/responseFormat.js';
import Sequelize from 'sequelize';
import db from '../config/db.js';

const getInicioTestimonio = async (req, res) => {
    try {
        const inicioTestimonios = await InicioTestimonio.findAll(
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
        const testimonios = inicioTestimonios.map(testimonio => {
            return {
                ...testimonio.toJSON(),
                ruta: prefijoRuta + testimonio.ruta + testimonio.archivo
            };
        });
        return res.status(200).json(responseFormat(true,200,req.path,'Éxito',testimonios));
    } catch (error) {
        return res.status(200).json(responseFormat(false,500,req.path,'Error al obtener los testimonios',[]));
    }
}
const createInicioTestimonio = async (req, res) => {
    const t = await db.transaction();
    try {
        const { filename } = req.files[0];
        
        const ultimoTestimonio = await InicioTestimonio.findOne({
            order: [['posicion', 'DESC']],
            transaction: t
        });
        const nuevaPosicion = ultimoTestimonio ? ultimoTestimonio.posicion + 1 : 1;

        const nuevoTestimonio = await InicioTestimonio.create(
            {
                posicion: nuevaPosicion,
                ruta: "/uploads/testimonios/",
                archivo: `${filename}`,
                estado: 1
            },
            {
                transaction: t
            }
        );
        await t.commit();
        return res.status(200).json(responseFormat(true,200,req.path,'Testimonmio creados con éxito',nuevoTestimonio));
    } catch (error) {
        await t.rollback();
        return res.status(200).json(responseFormat(false,500,req.path,'Error al crear testimonio',[]));
    }
}

const deleteInicioTestimonio = async (req, res) => {
    const t = await db.transaction();
    try {
        const { id } = req.params;
        const testimonio = await InicioTestimonio.findByPk(id);
        if (!testimonio) {
            return res.status(404).json(responseFormat(false,404,req.path,'Testimonio no encontrado',[]));
        }
        await testimonio.update({ estado: 3 }, { transaction: t });
        await t.commit();
        return res.status(200).json(responseFormat(true,200,req.path,'Testimonio eliminado correctamente',[]));
    } catch (error) {
        await t.rollback();
        return res.status(500).json(responseFormat(false,500,req.path,'Error al eliminar el testimonio',[]));
    }
};


const updateInicioTestimonio = async (req, res) => {
    const t = await db.transaction();
    try{
        const { id } = req.params;
        const testimonio = await InicioTestimonio.findByPk(id);
        if (!testimonio) {
            return res.status(200).json(responseFormat(false,404,req.path,'Testimonio no encontrado',[]));
        }
        if(testimonio.estado == 1){
            await testimonio.update({ estado: 2 }, { transaction: t });
        } else if (testimonio.estado == 2){
            await testimonio.update({ estado: 1 }, { transaction: t });
        }
        await t.commit();
        return res.status(200).json(responseFormat(true,200,req.path,'Testimonio actualizado',[]));
    }catch(error){
        console.log(error)
        await t.rollback();
        return res.status(200).json(responseFormat(false,500,req.path,'Error al actualizar el testimonio',[]));
    }
}

const updatePositionInicioTestimonio = async (req, res) => {
    const t = await db.transaction();
    try {
        const {dragid, dropid} = req.body;
        const dragTestimonio = await InicioTestimonio.findByPk(dragid);
        const dropTestimonio = await InicioTestimonio.findByPk(dropid);
        if (!dragTestimonio || !dropTestimonio) {
            return res.status(200).json(responseFormat(false,404,req.path,'Testimonio no encontrado',[]));
        }
        const posicionDrag = dragTestimonio.posicion
        const posicionDrop = dropTestimonio.posicion
        await dragTestimonio.update({ posicion: posicionDrop }, { transaction: t });
        await dropTestimonio.update({ posicion: posicionDrag }, { transaction: t });
        await t.commit();
        return res.status(200).json(responseFormat(true,200,req.path,'Testimonio actualizado',[]));
    } catch (error) {
        await t.rollback();
        return res.status(200).json(responseFormat(false,500,req.path,'Error al actualizar el testimonio',[]));
    }
}

export {
    getInicioTestimonio,
    createInicioTestimonio,
    deleteInicioTestimonio,
    updateInicioTestimonio,
    updatePositionInicioTestimonio
}