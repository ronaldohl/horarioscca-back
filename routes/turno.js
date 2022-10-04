var express = require('express');
var mysql = require('mysql');

const CONFIG_BD = require('../config/config').CONFIG_BD;



//Conexion a bd
var mysqlConnection = mysql.createConnection(CONFIG_BD);

mysqlConnection.connect((err) => {
    if (err) {
        console.log('Fallo conexion -turno');
    } else {
        console.log('Conexion Exitosa -turno');
    }
});

var app = express();


// ========================================================
// ================OBTENER TODOS LOS turnos ===============
//=========================================================
app.get('/', (req, res, next) => {
    mysqlConnection
        .query('SELECT * FROM turno', (err, rows, field) => {
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
// ================OBTENER turno POR ID ===============
//=========================================================

app.get('/:id', (req, res, next) => {

    mysqlConnection
        .query('SELECT * FROM turno WHERE id_turno = ?', [req.params.id], (err, rows, field) => {
            if (!err && rows != "") {
                // console.log(rows);
                res.status(200).json({
                    ok: true,
                    rows: rows
                });
            } else {
                res.status(500).json({
                    ok: false,
                    error: "No existe turno con ese id "
                });
            }
        })
});


// ========================================================
// ================BORRAR turno POR ID ===============
//=========================================================

app.delete('/:id', (req, res, next) => {

    mysqlConnection.query('DELETE FROM turno WHERE id_turno = ?', [req.params.id], (err, rows) => {
        if (!err && rows.affectedRows === 1) {
            // console.log(rows);
            res.status(200).json({
                ok: true,
                msj: "Se eliminó el turno ",
                rows: rows
            });
        } else {
            res.status(500).json({
                ok: false,
                error: "No existe el turno con ese id ",
                err: err
            });
        }
    })
});


// ========================================================
// ================AGREGAR turno ===============
//=========================================================
app.post('/', (req, res, next) => {

    var turno = {
        id_turno: Number,
        tipo: String,
        dia: String,
        hora_inicio: Date,
        hora_fin: Date,
        id_lugar: Number,
        id_actividad: Number,
        id_servicio: Number,
        id_dpto: Number,
        id_empleado: Number

    }

    turno.tipo = req.body.tipo;
    turno.dia = req.body.dia;
    turno.hora_inicio = req.body.hora_inicio;
    turno.hora_fin = req.body.hora_fin;
    turno.id_lugar = req.body.id_lugar;
    turno.id_actividad = req.body.id_actividad;
    turno.id_servicio = req.body.id_servicio;
    turno.id_dpto = req.body.id_dpto;
    turno.id_empleado = req.body.id_empleado;

    mysqlConnection
        .query("INSERT INTO bd_horarioscca_angular.turno \
        (tipo,dia,hora_inicio, hora_fin, id_lugar, id_actividad, id_servicio, id_dpto, id_empleado) \
         VALUES (?,?,?,?,?,?,?,?,?) ", [
                turno.tipo,
                turno.dia,
                turno.hora_inicio,
                turno.hora_fin,
                turno.id_lugar,
                turno.id_actividad,
                turno.id_servicio,
                turno.id_dpto,
                turno.id_empleado,
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
// ================ACTUALIZAR turno =======================
//=========================================================
app.put('/:id', (req, res, next) => {

    var turno = {
        id_turno: Number,
        tipo: String,
        dia: String,
        hora_inicio: Date,
        hora_fin: Date,
        id_lugar: Number,
        id_actividad: Number,
        id_servicio: Number,
        id_dpto: Number,
        id_empleado: Number

    }
    turno.tipo = req.body.tipo;
    turno.dia = req.body.dia;
    turno.hora_inicio = req.body.hora_inicio;
    turno.hora_fin = req.body.hora_fin;
    turno.id_lugar = req.body.id_lugar;
    turno.id_actividad = req.body.id_actividad;
    turno.id_servicio = req.body.id_servicio;
    turno.id_dpto = req.body.id_dpto;
    turno.id_empleado = req.body.id_empleado;

    mysqlConnection
        .query("UPDATE bd_horarioscca_angular.turno \
         SET tipo=?,dia=?,hora_inicio=?, hora_fin=?, id_lugar=?, id_actividad=?, id_servicio=?, id_dpto=?, id_empleado=?\
            WHERE id_turno = ? ", [
                turno.tipo,
                turno.dia,
                turno.hora_inicio,
                turno.hora_fin,
                turno.id_lugar,
                turno.id_actividad,
                turno.id_servicio,
                turno.id_dpto,
                turno.id_empleado,
                req.params.id
            ],
            (err, rows) => {
                if (!err && rows.affectedRows === 1) {
                    // console.log(rows);
                    res.status(200).json({
                        ok: true,

                        mensaje: "Update Correcta de turno",
                        Body: req.body,
                        rows: rows

                    });
                } else {
                    res.status(500).json({
                        ok: false,
                        msj: 'No se actualizo turno',
                        error: err,
                        body: req.body
                    });
                }
            })
});

module.exports = app