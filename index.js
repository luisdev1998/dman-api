import express from "express";
import "dotenv/config.js";
import cors from "cors"
import path from 'path';
import { fileURLToPath } from 'url';
import db from "./config/db.js"
import InformacionRoutes from "./routes/InformacionRoutes.js";
import InicioBannerRoutes from "./routes/InicioBannerRoutes.js";
import InicioTestimonioRoutes from "./routes/InicioTestimonioRoutes.js";
import AdminUsuarioRoutes from "./routes/AdminUsuarioRoutes.js";
import ProyectoRoutes from "./routes/ProyectoRoutes.js";
import WebRoutes from "./routes/WebRoutes.js";

//App
const app = express();
app.use(express.json());

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

//Database
db.authenticate()
    .then( () => console.log("base de datos conectado"))
    .catch( error => console.log(error) );

//Cors
const dominiosPermitidos = ["http://127.0.0.1:5173","http://localhost:5173"];
const corsOptions = {
    origin: function(origin, callback) {
        console.log("Origen de la solicitud:", origin); 
        if (!origin || dominiosPermitidos.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error("No permitido por CORS"));
        }
    }
};
//if (process.env.API_NODE_ENV === 'development') {
    app.use(cors());
//} else {
//    app.use(cors(corsOptions));
//}

//Routes
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/informacion', InformacionRoutes);
app.use('/api/adminusuario', AdminUsuarioRoutes);
app.use('/api/iniciobanner', InicioBannerRoutes);
app.use('/api/iniciotestimonio', InicioTestimonioRoutes);
app.use('/api/proyecto', ProyectoRoutes);
app.use('/api/web', WebRoutes);

//Ports
const PORT = process.env.API_PORT || 4000;
app.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`)
});