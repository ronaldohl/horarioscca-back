var express = require('express');
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
        console.log('Fallo conexion -Empleado');
    } else {
        console.log('Conexion Exitosa -Empleado');
    }
});

var app = express();


// ========================================================
// ================OBTENER TODOS LOS EMPLEADOS ===============
//=========================================================
app.get('/', (req, res, next) => {
    mysqlConnection
        .query('SELECT * FROM empleado', (err, rows, field) => {
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
// ================OBTENER EMPLEADO POR ID ===============
//=========================================================

app.get('/:id', (req, res, next) => {

    mysqlConnection
        .query('SELECT * FROM empleado WHERE id_empleado = ?', [req.params.id], (err, rows, field) => {
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

    mysqlConnection.query('DELETE FROM empleado WHERE id_empleado = ?', [req.params.id], (err, rows) => {
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
// ================AGREGAR EMPLEADO ===============
//=========================================================
app.post('/', (req, res, next) => {

    var empleado = {
        id_empleado: Number,
        nombre: String,
        apellido1: String,
        apellido2: String,
        fecha_ingreso: Number,
        tipo: String,
        id_jefe: Number,
        id_dpto: Number,
        correo: String
    }

    empleado.id_empleado = req.body.id_empleado;
    empleado.nombre = req.body.nombre;
    empleado.apellido1 = req.body.apellido1;
    empleado.apellido2 = req.body.apellido2;
    empleado.fecha_ingreso = req.body.fecha_ingreso;
    empleado.tipo = req.body.tipo;
    empleado.id_jefe = req.body.id_jefe;
    empleado.id_dpto = req.body.id_dpto;
    empleado.correo = req.body.correo;

    mysqlConnection
        .query("INSERT INTO horarioscca.empleado \
        (nombre,apellido1,apellido2,fecha_ingreso,tipo,id_jefe,id_dpto,correo ) \
         VALUES (?,?,?,?,?,?,?,?) ", [
                empleado.nombre,
                empleado.apellido1,
                empleado.apellido2,
                empleado.fecha_ingreso,
                empleado.tipo,
                empleado.id_jefe,
                empleado.id_dpto,
                empleado.correo,
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
// ================ACTUALIZAR EMPLEADO =======================
//=========================================================
app.put('/:id', (req, res, next) => {

    var empleado = {
        id_empleado: Number,
        nombre: String,
        apellido1: String,
        apellido2: String,
        fecha_ingreso: Number,
        tipo: String,
        id_jefe: Number,
        id_dpto: Number,
        correo: String

    }

    empleado.id_empleado = req.body.id_empleado;
    empleado.nombre = req.body.nombre;
    empleado.apellido1 = req.body.apellido1;
    empleado.apellido2 = req.body.apellido2;
    empleado.fecha_ingreso = req.body.fecha_ingreso;
    empleado.tipo = req.body.tipo;
    empleado.id_jefe = req.body.id_jefe;
    empleado.id_dpto = req.body.id_dpto;
    empleado.correo = req.body.correo;

    mysqlConnection
        .query("UPDATE horarioscca.empleado \
         SET nombre=?, apellido1=?, apellido2=?, fecha_ingreso=?, tipo=?, id_jefe=?, id_dpto=?, correo=?\
            WHERE id_empleado = ? ", [
                empleado.id_empleado,
                empleado.nombre,
                empleado.apellido1,
                empleado.apellido2,
                empleado.fecha_ingreso,
                empleado.tipo,
                empleado.id_jefe,
                empleado.id_dpto,
                empleado.correo,
                req.params.id
            ],
            (err, rows) => {
                if (!err) {
                    // console.log(rows);
                    res.status(200).json({
                        ok: true,
                        resp: {
                            mensaje: "Update Correcta de Departamento",
                            Body: req.body,
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

module.exports = app