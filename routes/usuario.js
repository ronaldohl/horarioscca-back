var express = require('express');
var mysql = require('mysql');
var bcrypt = require('bcryptjs');

var Usuario = require('../models/usuario')
    //Conexion a bd
var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'toor',
    database: 'horarioscca'
});

mysqlConnection.connect((err) => {
    if (err) {
        console.log('Fallo conexion -Usuario');
    } else {
        console.log('Conexion Exitosa -Usuario');
    }
});

var app = express();


// ========================================================
// ================OBTENER TODOS LOS USUARIOS ===============
//=========================================================
app.get('/', (req, res, next) => {
    mysqlConnection
        .query('SELECT * FROM usuario', (err, rows, field) => {
            if (!err) {

                // console.log(rows);
                res.status(200).json({
                    ok: true,
                    rows: rows
                });
            } else {
                res.status(500).json({
                    ok: false,
                    error: err
                });
            }
        })
});

// ========================================================
// ================OBTENER USUARIO POR ID ===============
//=========================================================

app.get('/:id', (req, res, next) => {

    mysqlConnection
        .query('SELECT * FROM usuario WHERE id_usuario = ?', [req.params.id], (err, rows, field) => {
            if (!err && rows != "") {
                // console.log(rows);
                res.status(200).json({
                    ok: true,
                    rows: rows
                });
            } else {
                res.status(500).json({
                    ok: false,
                    error: "No existe empleado con ese id "
                });
            }
        })
});


// ========================================================
// ================BORRAR EMPLEADO POR ID ===============
//=========================================================

app.delete('/:id', (req, res, next) => {

    mysqlConnection.query('DELETE FROM uduario WHERE id_usuario = ?', [req.params.id], (err, rows) => {
        if (!err && rows != "") {
            // console.log(rows);
            res.status(200).json({
                ok: true,
                msj: "Se eliminó el empleado ",
                rows: rows
            });
        } else {
            res.status(500).json({
                ok: false,
                error: "No existe el empleado con ese id ",
                err: err
            });
        }
    })
});


// ========================================================
// ================AGREGAR USUARIO ===============
//=========================================================
app.post('/', (req, res, next) => {

    var body = req.body;
    var usuario = {
        nombre: body.nombre_usr,
        contra: bcrypt.hashSync(body.contra, 10),


    }
    mysqlConnection
        .query("INSERT INTO horarioscca.usuario \
        (nombre_usr,contra) \
         VALUES (?,?) ", [
                usuario.nombre,
                usuario.contra,

            ],
            (err, rows) => {
                if (!err) {
                    // console.log(rows);
                    res.status(200).json({
                        ok: true,
                        resp: {
                            mensaje: "Insercion Correcta",
                            rows: rows
                        }
                    });
                } else {
                    res.status(500).json({
                        ok: false,
                        error: err,
                        body: req.body
                    });
                }
            })

});

// ========================================================
// ================ACTUALIZAR USUARIO =======================
//=========================================================
app.put('/:id', (req, res, next) => {

    var body = req.body;
    var usuario = {
        nombre: body.nombre_usr,
        contra: bcrypt.hashSync(body.contra, 10),

    }
    mysqlConnection
        .query("UPDATE horarioscca.usuario \
         SET nombre_usr=?,contra=?\
            WHERE id_usuario = ? ", [
                usuario.nombre_usr,
                usuario.contra,
                req.params.id
            ],
            (err, rows) => {
                if (!err) {
                    // console.log(rows);
                    res.status(200).json({
                        ok: true,
                        resp: {
                            mensaje: "Update Correcta de Empleado",
                            // Body: req.body,
                            rows: rows
                        }
                    });
                } else {
                    res.status(500).json({
                        ok: false,
                        error: err,
                        // body: req.body
                    });
                }
            })
});

module.exports = app