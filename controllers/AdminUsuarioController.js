import { AdminUsuario } from '../models/AdminUsuario.js';
import jwtGenerator from "../helpers/jwtGenerator.js";
import responseFormat from '../helpers/responseFormat.js';
import bcrypt from 'bcrypt';

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
    return res.status(200).json(responseFormat(true,200,req.path,'Éxito',req.Usuario));
}

const registrarUsuario = async (req, res) => {
    try {
        // Obtienes los datos del usuario desde el body de la petición
        const { correo, clave } = req.body;

        // Verificar si el correo ya está registrado
        const existeUsuario = await AdminUsuario.findOne({ where: { correo } });
        if (existeUsuario) {
            return res.status(200).json(responseFormat(true,400,req.path,'El correo ya está registrado',[]));
        }

        // Encriptar la clave
        const claveEncriptada = await bcrypt.hash(clave, 10);

        // Crear el usuario con la clave encriptada
        const nuevoUsuario = await AdminUsuario.create({
            correo,
            clave: claveEncriptada,
            estado: true // o false, dependiendo de la lógica de tu aplicación
        });

        // Respuesta de éxito
            return res.status(200).json(responseFormat(true,201,req.path,'Usuario registrado',nuevoUsuario));
    } catch (error) {
        // En caso de un error en el proceso, enviar una respuesta de error
        console.log(error)
            return res.status(200).json(responseFormat(true,500,req.path,'Error al registrar el usuario',[]));
    }
};

export {
    login,
    perfil,
    registrarUsuario
}