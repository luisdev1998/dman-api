import multer from 'multer';
import fs from 'fs';
import path from 'path';


const storageInformacion = multer.diskStorage({
    destination: function(req, file, callback) {
        const uploadPath = path.resolve('./uploads/informacion');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        callback(null, uploadPath);
    },
    filename: function(req, file, callback) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        callback(null, uniqueSuffix + '-' + file.originalname.replace(/\s+/g, ''));
    }
});
const storageBanner = multer.diskStorage({
    destination: function(req, file, callback) {
        const uploadPath = path.resolve('./uploads/banners');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        callback(null, uploadPath);
    },
    filename: function(req, file, callback) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        callback(null, uniqueSuffix + '-' + file.originalname.replace(/\s+/g, ''));
    }
});
const storageTestimonio = multer.diskStorage({
    destination: function(req, file, callback) {
        const uploadPath = path.resolve('./uploads/testimonios');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        callback(null, uploadPath);
    },
    filename: function(req, file, callback) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        callback(null, uniqueSuffix + '-' + file.originalname.replace(/\s+/g, ''));
    }
});
const storageProyecto = multer.diskStorage({
    destination: function(req, file, callback) {
        const uploadPath = path.resolve('./uploads/proyectos');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        callback(null, uploadPath);
    },
    filename: function(req, file, callback) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        callback(null, uniqueSuffix + '-' + file.originalname.replace(/\s+/g, ''));
    }
});

const filterInformacion = (req, file, callback) => {
    if (file.size >= 50 * 1024 * 1024) {
        req.fileValidationError = "Solo se permite archivos con menos de 50 MB";
        return callback(null, false, req.fileValidationError);
    }
    callback(null, true);
};
const filter = (req, file, callback) => {
    if (file.size >= 5 * 1024 * 1024) {
        req.fileValidationError = "Solo se permite archivos con menos de 5 MB";
        return callback(null, false, req.fileValidationError);
    }
    callback(null, true);
};

const uploadInformacion = multer({ storage: storageInformacion, fileFilter: filterInformacion });
const uploadBanner = multer({ storage: storageBanner, fileFilter: filter });
const uploadTestimonio = multer({ storage: storageTestimonio, fileFilter: filter });
const uploadProyecto = multer({ storage: storageProyecto, fileFilter: filter });

export {uploadInformacion,uploadBanner,uploadTestimonio,uploadProyecto};