var express = require('express');
var mysql = require('mysql');

const CONFIG_BD = require('../config/config').CONFIG_BD;



//Conexion a bd
var mysqlConnection = mysql.createConnection(CONFIG_BD);

mysqlConnection.connect((err) => {
    if (err) {
        console.log('Fallo conexion -Departamento');
    } else {
        console.log('Conexion Exitosa -Departamento');
    }
});

var app = express();


// ========================================================
// ================OBTENER TODOS LOS DEPARTAMENTOS ===============
//=========================================================
app.get('/', (req, res, next) => {
    mysqlConnection
        .query('SELECT * FROM departamento order by tipo_dpto, nombre_dpto', (err, rows, field) => {
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
// ================OBTENER DEPARTAMENTO POR ID ===============
//=========================================================

app.get('/:id', (req, res, next) => {

    mysqlConnection
        .query('SELECT * FROM departamento WHERE id_dpto = ?', [req.params.id], (err, rows, field) => {
            if (!err && rows != "") {
                // console.log(rows);
                res.status(200).json({
                    ok: true,
                    rows: rows
                });
            } else {
                res.status(500).json({
                    ok: false,
                    error: "No existe departamento con ese id "
                });
            }
        })
});


// ========================================================
// ================BORRAR DEPARTAMENTO POR ID ===============
//=========================================================

app.delete('/:id', (req, res, next) => {

    mysqlConnection.query('call borrarDepartamento(?);', [req.params.id], (err, rows) => {
        if (!err && rows != "") {
            // console.log(rows);
            res.status(200).json({
                ok: true,
                msj: "Se eliminó el departamento ",
                rows: rows
            });
        } else {
            res.status(500).json({
                ok: false,
                error: "No existe el dpto con ese id ",
                err: err
            });
        }
    })
});


// ========================================================
// ================AGREGAR DEPARTAMENTO ===============
//=========================================================
app.post('/', (req, res, next) => {

    var departameto = {
        id_dpto: Number,
        nombre_dpto: String,
        tipo_dpto: String,
        descripcion_dpto: String,
        id_lugar: Number,
        id_dep_sup: Number,
        id_emp_resp: Number
    }

    departameto.nombre_dpto = req.body.nombre_dpto;
    departameto.tipo_dpto = req.body.tipo_dpto;
    departameto.descripcion_dpto = req.body.descripcion_dpto;
    departameto.id_lugar = req.body.id_lugar;
    departameto.id_dep_sup = req.body.id_dep_sup;
    departameto.id_emp_resp = req.body.id_emp_resp;

    mysqlConnection
        .query("INSERT INTO bd_horarioscca_angular.departamento (nombre_dpto,tipo_dpto,descripcion_dpto,id_lugar,id_dep_sup,id_emp_resp ) \
         VALUES (?,?,?,?,?,?) ", [
                departameto.nombre_dpto,
                departameto.tipo_dpto,
                departameto.descripcion_dpto,
                departameto.id_lugar,
                departameto.id_dep_sup,
                departameto.id_emp_resp,
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
// ================ACTUALIZAR DEPARTAMENTO =======================
//=========================================================
app.put('/:id', (req, res, next) => {

    var departameto = {
        id_dpto: Number,
        nombre_dpto: String,
        tipo_dpto: String,
        descripcion_dpto: String,
        id_lugar: Number,
        id_dep_sup: Number,
        id_emp_resp: Number
    }

    departameto.nombre_dpto = req.body.nombre_dpto;
    departameto.tipo_dpto = req.body.tipo_dpto;
    departameto.descripcion_dpto = req.body.descripcion_dpto;
    departameto.id_lugar = req.body.id_lugar;
    departameto.id_dep_sup = req.body.id_dep_sup;
    departameto.id_emp_resp = req.body.id_emp_resp;

    mysqlConnection
        .query("UPDATE bd_horarioscca_angular.departamento \
         SET nombre_dpto=?, tipo_dpto=? ,descripcion_dpto=?, id_lugar=?, id_dep_sup=?, id_emp_resp=?\
            WHERE id_dpto = ? ", [
                departameto.nombre_dpto,
                departameto.tipo_dpto,
                departameto.descripcion_dpto,
                departameto.id_lugar,
                departameto.id_dep_sup,
                departameto.id_emp_resp,
                req.params.id
            ],
            (err, rows) => {
                if (!err) {
                    // console.log(rows);
                    res.status(200).json({
                        ok: true,
                        mensaje: "Update Correcta de Empleado",
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