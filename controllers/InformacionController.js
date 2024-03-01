import { Informacion } from '../models/Informacion.js'
import responseFormat from '../helpers/responseFormat.js';
import db from '../config/db.js';

const getInformacion = async (req, res) => {
    try {
        const listaInformacion = await Informacion.findOne();
        return res.status(200).json(responseFormat(true,200,req.path,'Éxito',listaInformacion));
    } catch(error){
        console.log(error)
        return res.status(200).json(responseFormat(false,500,req.path,'Error al obtener la información',[]))
    }
}

const patchInformacion = async (req, res) => {
    const t = await db.transaction();
    try {
        const {numero, email, ubicacion, ubicacionUrl, facebook, youtube, instagram, tiktok, whatsapp} = req.body;
        const informacionParaActualizar = {};
        if(numero !== undefined) informacionParaActualizar.numero = numero;
        if(email !== undefined) informacionParaActualizar.email = email;
        if(ubicacion !== undefined) informacionParaActualizar.ubicacion = ubicacion;
        if(ubicacionUrl !== undefined) informacionParaActualizar.ubicacion_url = ubicacionUrl; // Asegúrate de usar el nombre correcto del campo
        if(facebook !== undefined) informacionParaActualizar.facebook = facebook;
        if(youtube !== undefined) informacionParaActualizar.youtube = youtube;
        if(instagram !== undefined) informacionParaActualizar.instagram = instagram;
        if(tiktok !== undefined) informacionParaActualizar.tiktok = tiktok;
        if(whatsapp !== undefined) informacionParaActualizar.whatsapp = whatsapp;

        // Actualizar el registro con ID 1
        await Informacion.update(informacionParaActualizar, { 
            where: { ID: 1 }, // Asegúrate de que el nombre del campo ID sea correcto
            transaction: t 
        });
        await t.commit();
        return res.status(200).json(responseFormat(true,200,req.path,'Éxito',{}));
    } catch(error){
        console.log(error)
        await t.rollback();
        return res.status(200).json(responseFormat(false,500,req.path,'Error al actualizar la información',[]))
    }
}

const patchArchivos = async (req, res) => {
    const t = await db.transaction();
    try {
        const informacion = {}
        if (req.files.imagen_1_archivo && req.files.imagen_1_archivo.length > 0) {
            informacion.imagen_1_archivo = req.files.imagen_1_archivo[0].filename;
        }

        if (req.files.imagen_2_archivo && req.files.imagen_2_archivo.length > 0) {
            informacion.imagen_2_archivo = req.files.imagen_2_archivo[0].filename;
        }

        if (req.files.imagen_3_archivo && req.files.imagen_3_archivo.length > 0) {
            informacion.imagen_3_archivo = req.files.imagen_3_archivo[0].filename;
        }

        if (req.files.video_1_archivo && req.files.video_1_archivo.length > 0) {
            informacion.video_1_archivo = req.files.video_1_archivo[0].filename;
        }

        if (req.files.video_2_archivo && req.files.video_2_archivo.length > 0) {
            informacion.video_2_archivo = req.files.video_2_archivo[0].filename;
        }

        // Actualizar el registro con ID 1
        await Informacion.update(informacion, { 
            where: { ID: 1 }, // Asegúrate de que el nombre del campo ID sea correcto
            transaction: t 
        });
        await t.commit();
        return res.status(200).json(responseFormat(true,200,req.path,'Éxito',{}));
    } catch(error){
        console.log(error)
        await t.rollback();
        return res.status(200).json(responseFormat(false,500,req.path,'Error al guardar archivos',{}))
    }
}

export {getInformacion,patchInformacion, patchArchivos}