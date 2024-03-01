import { AdminUsuario } from '../models/AdminUsuario.js';
import jwtGenerator from "../helpers/jwtGenerator.js";
import responseFormat from '../helpers/responseFormat.js';

const login = async (req, res) => {
    try {
        const { correo, clave } = req.body;
        if (!correo || !clave) {
            return res.status(200).json(
                responseFormat(
                    false,
                    401,
                    req.path,
                    'Correo y clave son obligatorios',
                    {}
                )
            );
        }

        //Buscamos el correo por 'correo'
        const buscarUsuario = await AdminUsuario.findOne({correo});
        if(!buscarUsuario){
            return res.status(200).json(
                responseFormat(
                    false,
                    404,
                    req.path,
                    'Usuario no encontrado',
                    {}
                )
            );
        }

        //Comparamos claves
        if(!await buscarUsuario.compararClave(clave)){
            return res.status(200).json(
                responseFormat(
                    false,
                    401,
                    req.path,
                    'Contraseña incorrecta',
                    {}
                )
            );
        }

        //Está activo?
        if(!await buscarUsuario.estado){
            return res.status(403).json(
                responseFormat(
                    false,
                    401,
                    req.path,
                    'Usuario desactivado',
                    {}
                )
            );
        }

        //Retornar
        const usuario = {
            id: buscarUsuario.id,
            correo: buscarUsuario.correo,
            token: jwtGenerator(buscarUsuario.id)
        }
        return res.status(200).json(
            responseFormat(
                true,
                200,
                req.path,
                'Éxito',
                usuario
            )
        );
    } catch (error) {
        return res.status(200).json(
            responseFormat(
                false,
                500,
                req.path,
                'Ocurrió un error en el servidor',
                {}
            )
        );
    }
}

const perfil = async (req, res) => {
    return res.status(200).json(
        responseFormat(
            true,
            200,
            req.path,
            'Éxito',
            req.Usuario
        )
    );
}

export {
    login,
    perfil
}