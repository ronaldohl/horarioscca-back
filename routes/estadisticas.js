var express = require('express');
var mysql = require('mysql');

const CONFIG_BD = require('../config/config').CONFIG_BD;



//Conexion a bd
var mysqlConnection = mysql.createConnection(CONFIG_BD);
mysqlConnection.connect((err) => {
    if (err) {
        console.log('Fallo conexion -detActividad');
    } else {
        console.log('Conexion Exitosa -detActividad');
    }
});

var app = express();

// ========================================================
// ================OBTENER DETALLES ACT ===============
//=========================================================

app.get('/clasesFitness', (req, res, next) => {

    mysqlConnection
        .query("select id_actividad ,count(*) from actividad where actividad.id_clase=9;  ", (err, rows, field) => {
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
app.get('/disciplinas', (req, res, next) => {

    mysqlConnection
        .query("select id_clase ,count(*) from clase where id_clase!=9;  ", (err, rows, field) => {
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
app.get('/empleados/administrativos', (req, res, next) => {

    mysqlConnection
        .query("select id_empleado ,count(*) from empleado where tipo_emp='a'; ", (err, rows, field) => {
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
app.get('/empleados/instructores', (req, res, next) => {

    mysqlConnection
        .query("select id_empleado ,count(*) from empleado where tipo_emp='i'; ", (err, rows, field) => {
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
app.get('/empleados/servicio', (req, res, next) => {

    mysqlConnection
        .query("select id_empleado ,count(*) from empleado where tipo_emp='s'; ", (err, rows, field) => {
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
module.exports = app;