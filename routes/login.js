//===========NO SIRVE , MANDA ERROR AL HACER PETICION =========
var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var mysql = require('mysql');
//Conexion a bd
var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'toor',
    database: 'horarioscca'
});

mysqlConnection.connect((err) => {
    if (err) {
        console.log('Fallo conexion -Login');
    } else {
        console.log('Conexion Exitosa -Login');
    }
});

var app = express();

// var Usuario = require('../models/usuario');
var SEED = require('../config/config').SEED;

app.post('/', (req, res) => {
    var body = req.body;


    mysqlConnection.query("SELECT * FROM usuario WHERE nombre_usr=? ", [body.nombre_usr],
        (err, usuarioDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar usuario',
                    errors: err
                });
            }
            if (!usuarioDB) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Credenciales incorrectas - nombre',
                    errors: err
                });
            }


            if (!bcrypt.compareSync(body.contra.toString(), usuarioDB[0].contra)) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Credenciales incorrectas - password',
                    errors: err
                });
            }
            // =======================================
            // =========Crear un Token ===============
            // =======================================
            var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 }); //4 horas
            usuarioDB.contra = ":)";

            res.status(200).json({
                ok: true,
                menssaje: 'Login POST correcto',
                id: usuarioDB.id_usuario,
                token: token,
                usuario: usuarioDB
            });
        }
    );

});



module.exports = app;