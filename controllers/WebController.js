import { Informacion } from '../models/Informacion.js'
import { InicioBanner } from "../models/InicioBanner.js";
import { InicioTestimonio } from "../models/InicioTestimonio.js";
import { Proyecto, ProyectoBeneficio, ProyectoConocenos } from "../models/Proyecto.js";
import enviarEmail from '../config/mail.js';
import Sequelize from 'sequelize';
import db from '../config/db.js';
import responseFormat from "../helpers/responseFormat.js";

const getListaInformacion = async (req, res) => {
    try {
        const prefijoRuta = process.env.API_URL;
        const listaInformacion = await Informacion.findOne();
        listaInformacion.imagen_1_archivo = prefijoRuta + listaInformacion.ruta + listaInformacion.imagen_1_archivo;
        listaInformacion.imagen_2_archivo = prefijoRuta + listaInformacion.ruta + listaInformacion.imagen_2_archivo;
        listaInformacion.imagen_3_archivo = prefijoRuta + listaInformacion.ruta + listaInformacion.imagen_3_archivo;
        listaInformacion.video_1_archivo = prefijoRuta + listaInformacion.ruta + listaInformacion.video_1_archivo;
        listaInformacion.video_2_archivo = prefijoRuta + listaInformacion.ruta + listaInformacion.video_2_archivo;

        const proyectos = await Proyecto.findAll(
            {
                where: {
                    estado: 1
                }
            }
        );
        const listaProyectos = proyectos.map(proyecto => {
            return {
                ...proyecto.toJSON(),
                imagen_archivo: prefijoRuta + proyecto.ruta + proyecto.imagen_archivo,
                banner_archivo: prefijoRuta + proyecto.ruta + proyecto.banner_archivo,
                referencia_archivo: prefijoRuta + proyecto.ruta + proyecto.referencia_archivo
            };
        });
        const inicioBanners = await InicioBanner.findAll(
            {
                order:[
                    ['posicion','ASC']
                ],
                where: {
                    estado: 1
                }
            }
        );
        const listaBanners = inicioBanners.map(banner => {
            return {
                ...banner.toJSON(),
                ruta: prefijoRuta + banner.ruta + banner.archivo
            };
        });
        const inicioTestimonios = await InicioTestimonio.findAll(
            {
                order:[
                    ['posicion','ASC']
                ],
                where: {
                    estado: 1
                }
            }
        );
        const listaTestimonios = inicioTestimonios.map(testimonio => {
            return {
                ...testimonio.toJSON(),
                ruta: prefijoRuta + testimonio.ruta + testimonio.archivo
            };
        });
        return res.status(200).json(responseFormat(true,200,req.path,'Éxito',{listaInformacion,listaBanners,listaProyectos,listaTestimonios}));
    } catch (error) {
        console.log(error)
        return res.status(200).json(responseFormat(false,500,req.path,'Error al obtener la información',[]));
    }
};

const getProyectoInformacion = async (req, res) => {
    const { id } = req.params;
    const prefijoRuta = process.env.API_URL;
    try {
        let proyectoDetalle = await Proyecto.findByPk(id, {
            where: {
                estado: 1
            },
            include: [
                {
                    model: ProyectoConocenos,
                    where: {
                        estado: 1
                    },
                    required: false
                },
                {
                    model: ProyectoBeneficio,
                    where: {
                        estado: 1
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
}

const postEnviarEmail = async (req, res) => {
    try {
        const { id } = req.params;
        const {email,telefono,nombre,apellido,dni} = req.body;
        const proyectoDetalle = await Proyecto.findByPk(id);
        const listaInformacion = await Informacion.findOne();
        await enviarEmail(req.body,proyectoDetalle,listaInformacion.email_remitente,listaInformacion.clave_email_remitente,listaInformacion.email_receptor);
        return res.status(200).json(responseFormat(true, 200, req.path, 'Solicitud enviada, en breve le enviaremos la información requerida', {}));
    } catch (error) {
        console.log(error);
        return res.status(200).json(responseFormat(false, 500, req.path, 'Error al enviar la solicitud', {}));
    }
}

export { getListaInformacion, getProyectoInformacion, postEnviarEmail }