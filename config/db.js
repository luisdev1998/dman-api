import Sequelize from "sequelize";

const db = new Sequelize(process.env.API_DB_DATABASE,process.env.API_DB_USUARIO,process.env.API_DB_CLAVE,{
    host: process.env.API_DB_HOST,
    port: process.env.API_DB_PORT,
    dialect: 'mssql',
    define: {
        timestamps: false
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    operatorAliases: false
});

export default db;