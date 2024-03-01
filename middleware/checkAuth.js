import jwt from 'jsonwebtoken';
import { AdminUsuario } from '../models/AdminUsuario.js';
import responseFormat from '../helpers/responseFormat.js';

const checkAuth = async (req, res, next) => {
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.API_JWT_SECRET);
            req.Usuario = await AdminUsuario.findOne({
                where: {id: decoded.id},
                attributes: { exclude: ['clave'] }
            });
            next();
        } catch (error) {
            res.status(200).json(
                responseFormat(
                    false,
                    401,
                    req.path,
                    'Token no valido o expirado, reinicie la página',
                    {}
                )
            );
        }
    }
    if(!token){
        res.status(200).json(
            responseFormat(
                false,
                401,
                req.path,
                'Token inexistente',
                {}
            )
        );
    }
}

export default checkAuth;