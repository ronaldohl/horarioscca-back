var express = require('express');
var mysql = require('mysql');

const CONFIG_BD = require('../config/config').CONFIG_BD;



//Conexion a bd
var mysqlConnection = mysql.createConnection(CONFIG_BD);

mysqlConnection.connect((err) => {
    if (err) {
        console.log('Fallo conexion -Actividad');
    } else {
        console.log('Conexion Exitosa -Actividad');
    }
});

var app = express();

// ========================================================
// ================OBTENER TODAS LAS ACTIVIDADES ===============
//=========================================================
app.get('/', (req, res, next) => {
    mysqlConnection.query('SELECT * FROM actividad order by id_clase, nombre_actv asc;', (err, rows, field) => {
        if (!err && rows != "") {
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
// ================OBTENER ACTIVIDAD POR ID ===============
//=========================================================

app.get('/:id', (req, res, next) => {

    mysqlConnection.query('SELECT * FROM actividad WHERE id_actividad = ?', [req.params.id], (err, rows, field) => {
        if (!err && rows) {
            // console.log(rows);
            res.status(200).json({
                ok: true,
                rows: rows
            });
        } else {
            res.status(500).json({
                ok: false,
                error: "No se puede obtener actividad con ese id ",
                err: err
            });
        }
    })
});


// ========================================================
// ================BORRAR ACTIVIDAD POR ID ===============
//=========================================================

app.delete('/:id', (req, res, next) => {

    mysqlConnection
        .query(' call borrarActividad(?); ', [req.params.id],
            (err, rows) => {
                if (!err && rows.affectedRows === 1) {
                    // console.log(rows);
                    res.status(200).json({
                        ok: true,
                        msj: "Se eliminó la actividad ",
                        rows: rows
                    });
                } else {
                    res.status(500).json({
                        ok: false,
                        error: "No se puede borrar actividad con ese id ",
                        err: err
                    });
                }
            })
});


// ========================================================
// ================AGREGAR ACTIVIDAD ===============
//=========================================================
app.post('/', (req, res, next) => {

    var actividad = {
        id_actividad: Number,
        nombre: String,
        clasificacion: String,
        descripcion: String,
        costo: Number,
        det_costo: String,
        id_clase: Number
    }

    actividad.nombre = req.body.nombre_actv;
    actividad.clasificacion = req.body.clasificacion_actv;
    actividad.descripcion = req.body.descripcion_actv;
    actividad.costo = req.body.costo_actv;
    actividad.det_costo = req.body.det_costo;
    actividad.id_clase = req.body.id_clase;

    mysqlConnection.query("INSERT INTO bd_horarioscca_angular.actividad (nombre_actv,clasificacion_actv,descripcion_actv,costo_actv,det_costo_actv, id_clase) \
        VALUES (?,?,?,?,?,?) ", [actividad.nombre, actividad.clasificacion, actividad.descripcion, actividad.costo, actividad.det_costo, actividad.id_clase],
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
                    mensaje: "No se pudo hacer la insercion",
                    error: err,
                    body: req.body
                });
            }
        })

});

// ========================================================
// ================ACTUALIZAR ACTIVIDAD =======================
//=========================================================
app.put('/:id', (req, res, next) => {
    var actividad = {
        id_actividad: Number,
        nombre: String,
        clasificacion: String,
        descripcion: String,
        costo: Number,
        det_costo: String,
        id_clase: Number
    }

    actividad.nombre = req.body.nombre_actv;
    actividad.clasificacion = req.body.clasificacion_actv;
    actividad.descripcion = req.body.descripcion_actv;
    actividad.costo = req.body.costo_actv;
    actividad.det_costo = req.body.det_costo_actv;
    actividad.id_clase = req.body.id_clase;


    mysqlConnection
        .query("UPDATE bd_horarioscca_angular.actividad \
        SET nombre_actv=?, clasificacion_actv=? ,descripcion_actv=?, costo_actv=?, det_costo_actv=?,id_clase=? \
        WHERE id_actividad = ? ", [actividad.nombre, actividad.clasificacion, actividad.descripcion, actividad.costo, actividad.det_costo, actividad.id_clase, req.params.id],
            (err, rows) => {
                if (!err) {
                    // console.log(rows);
                    res.status(200).json({
                        ok: true,

                        mensaje: "Update Correcta de Actividad",
                        Body: req.body,
                        rows

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