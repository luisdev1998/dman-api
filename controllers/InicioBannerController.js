import { InicioBanner } from '../models/InicioBanner.js';
import responseFormat from '../helpers/responseFormat.js';
import Sequelize from 'sequelize';
import db from '../config/db.js';

const getInicioBanner = async (req, res) => {
    try {
        const inicioBanners = await InicioBanner.findAll(
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
        const banners = inicioBanners.map(banner => {
            return {
                ...banner.toJSON(),
                ruta: prefijoRuta + banner.ruta + banner.archivo
            };
        });
        return res.status(200).json(responseFormat(true,200,req.path,'Éxito',banners));
    } catch (error) {
        return res.status(200).json(responseFormat(false,500,req.path,'Error al obtener los banners',[]));
    }
}
const createInicioBanner = async (req, res) => {
    const t = await db.transaction();
    try {
        const { filename } = req.file;
        
        const ultimoBanner = await InicioBanner.findOne({
            order: [['posicion', 'DESC']],
            transaction: t
        });
        const nuevaPosicion = ultimoBanner ? ultimoBanner.posicion + 1 : 1;

        const nuevoBanner = await InicioBanner.create(
            {
                posicion: nuevaPosicion,
                ruta: "/uploads/banners/",
                archivo: `${filename}`,
                estado: 1
            },
            {
                transaction: t
            }
        );
        await t.commit();
        return res.status(200).json(responseFormat(true,200,req.path,'Banners creados con éxito',nuevoBanner));
    } catch (error) {
        await t.rollback();
        return res.status(200).json(responseFormat(false,500,req.path,'Error al crear banners',[]));
    }
}

const deleteInicioBanner = async (req, res) => {
    const t = await db.transaction();
    try {
        const { id } = req.params;
        const banner = await InicioBanner.findByPk(id);
        if (!banner) {
            return res.status(404).json(responseFormat(false,404,req.path,'Banner no encontrado',[]));
        }
        await banner.update({ estado: 3 }, { transaction: t });
        await t.commit();
        return res.status(200).json(responseFormat(true,200,req.path,'Banner eliminado correctamente',[]));
    } catch (error) {
        await t.rollback();
        return res.status(200).json(responseFormat(false,500,req.path,'Error al eliminar el banner',[]));
    }
};


const updateInicioBanner = async (req, res) => {
    const t = await db.transaction();
    try{
        const { id } = req.params;
        const banner = await InicioBanner.findByPk(id);
        if (!banner) {
            return res.status(200).json(responseFormat(false,404,req.path,'Banner no encontrado',[]));
        }
        if(banner.estado == 1){
            await banner.update({ estado: 2 }, { transaction: t });
        } else if (banner.estado == 2){
            await banner.update({ estado: 1 }, { transaction: t });
        }
        await t.commit();
        return res.status(200).json(responseFormat(true,200,req.path,'Banner actualizado',[]));
    }catch(error){
        await t.rollback();
        return res.status(200).json(responseFormat(false,500,req.path,'Error al actualizar el banner',[]));
    }
}

const updatePositionInicioBanner = async (req, res) => {
    const t = await db.transaction();
    try {
        const {dragid, dropid} = req.body;
        const dragBanner = await InicioBanner.findByPk(dragid);
        const dropBanner = await InicioBanner.findByPk(dropid);
        if (!dragBanner || !dropBanner) {
            return res.status(200).json(responseFormat(false,404,req.path,'Banner no encontrado',[]));
        }
        const posicionDrag = dragBanner.posicion
        const posicionDrop = dropBanner.posicion
        await dragBanner.update({ posicion: posicionDrop }, { transaction: t });
        await dropBanner.update({ posicion: posicionDrag }, { transaction: t });
        await t.commit();
        return res.status(200).json(responseFormat(true,200,req.path,'Banner actualizado',[]));
    } catch (error) {
        await t.rollback();
        return res.status(200).json(responseFormat(false,500,req.path,'Error al actualizar el banner',[]));
    }
}

export {
    getInicioBanner,
    createInicioBanner,
    deleteInicioBanner,
    updateInicioBanner,
    updatePositionInicioBanner
}