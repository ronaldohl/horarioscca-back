var express = require('express');
var mysql = require('mysql');
const CONFIG_BD = require('../config/config').CONFIG_BD;



//Conexion a bd
var mysqlConnection = mysql.createConnection(CONFIG_BD);

mysqlConnection.connect((err) => {
    if (err) {
        console.log('Fallo conexion -Extension');
    } else {
        console.log('Conexion Exitosa -Extension');
    }
});

var app = express();


// ========================================================
// ================OBTENER TODAS LAS EXTENSIONES===============
//=========================================================
app.get('/', (req, res, next) => {
    mysqlConnection
        .query('SELECT * FROM extension order by numero;', (err, rows, field) => {
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
// ================OBTENER EXTENSION POR ID ===============
//=========================================================

app.get('/:id', (req, res, next) => {

    mysqlConnection
        .query('SELECT * FROM extension WHERE id_extension = ?', [req.params.id], (err, rows, field) => {
            if (!err && rows != "") {
                // console.log(rows);
                res.status(200).json({
                    ok: true,
                    rows: rows
                });
            } else {
                res.status(500).json({
                    ok: false,
                    error: "No existe extension con ese id "
                });
            }
        })
});


// ========================================================
// ================BORRAR EXTENSION POR ID ===============
//=========================================================

app.delete('/:id', (req, res, next) => {

    mysqlConnection.query('DELETE FROM extension WHERE id_extension = ?', [req.params.id], (err, rows) => {
        //Aqui hay un problema si mando un id que no existe en la bd aun asi me regresa se elimino la ext 
        if (!err && rows.affectedRows === 1) {
            // console.log(rows);
            res.status(200).json({
                ok: true,
                msj: "Se eliminó la extension ",
                rows: rows
            });
        } else {
            res.status(500).json({
                ok: false,
                error: "No existe la extension  con ese id ",
                err: err
            });
        }
    })
});


// ========================================================
// ================AGREGAR EXTENSION ===============
//=========================================================
app.post('/', (req, res, next) => {

    var extension = {
        id_extension: Number,
        numero: Number,
        nombre: String,
        tipo: String,
        anotacion: String
    }

    extension.numero = req.body.numero;
    extension.nombre = req.body.nombre;
    extension.tipo = req.body.tipo;
    extension.anotacion = req.body.anotacion;

    mysqlConnection
        .query("INSERT INTO bd_horarioscca_angular.extension \
        (numero, nombre, tipo, anotacion) \
         VALUES (?,?,?,?) ", [
                extension.numero,
                extension.nombre,
                extension.tipo,
                extension.anotacion,
            ],
            (err, rows) => {
                if (!err) {
                    // console.log(rows);
                    res.status(200).json({
                        ok: true,

                        mensaje: "Insercion Correcta",
                        rows: rows

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
// ================ACTUALIZAR EXTENSION =======================
//=========================================================
app.put('/:id', (req, res, next) => {

    var extension = {
        id_extension: Number,
        numero: Number,
        nombre: String,
        tipo: String,
        anotacion: String
    }

    extension.numero = req.body.numero;
    extension.nombre = req.body.nombre;
    extension.tipo = req.body.tipo;
    extension.anotacion = req.body.anotacion;

    mysqlConnection
        .query("UPDATE bd_horarioscca_angular.extension \
         SET numero=?, nombre=?, tipo=?, anotacion=?\
            WHERE id_extension = ? ", [
                extension.numero,
                extension.nombre,
                extension.tipo,
                extension.anotacion,
                req.params.id
            ],
            (err, rows) => {
                if (!err) {
                    // console.log(rows);
                    res.status(200).json({
                        ok: true,

                        mensaje: "Update Correcta de Extension",
                        Body: req.body,
                        rows: rows

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

module.exports = app