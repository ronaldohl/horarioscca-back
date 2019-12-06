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
        .query('SELECT * FROM empleado order by nombre_emp;', (err, rows, field) => {
            if (!err) {
                // console.log(rows);
                res.status(200).json({

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

    mysqlConnection.query('call borrarEmpleado(?);', [req.params.id], (err, rows) => {
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
        nombre_emp: String,
        apellido1: String,
        apellido2: String,
        fecha_ingreso: Number,
        tipo_emp: String,
        id_jefe: Number,
        id_dpto: Number,
        correo: String,
        cargo: String
    }


    empleado.nombre_emp = req.body.nombre_emp;
    empleado.apellido1 = req.body.apellido1;
    empleado.apellido2 = req.body.apellido2;
    empleado.fecha_ingreso = req.body.fecha_ingreso;
    empleado.tipo_emp = req.body.tipo_emp;
    empleado.id_jefe = req.body.id_jefe;
    empleado.id_dpto = req.body.id_dpto;
    empleado.correo = req.body.correo;
    empleado.cargo = req.body.cargo;

    mysqlConnection
        .query("INSERT INTO horarioscca.empleado \
        (nombre_emp,apellido1,apellido2,fecha_ingreso,tipo_emp,id_jefe,id_dpto,correo,cargo ) \
         VALUES (?,?,?,?,?,?,?,?,?) ", [
                empleado.nombre_emp,
                empleado.apellido1,
                empleado.apellido2,
                empleado.fecha_ingreso,
                empleado.tipo_emp,
                empleado.id_jefe,
                empleado.id_dpto,
                empleado.correo,
                empleado.cargo,
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
        correo: String,
        cargo: String

    }

    empleado.id_empleado = req.body.id_empleado;
    empleado.nombre = req.body.nombre_emp;
    empleado.apellido1 = req.body.apellido1;
    empleado.apellido2 = req.body.apellido2;
    empleado.fecha_ingreso = req.body.fecha_ingreso;
    empleado.tipo = req.body.tipo_emp;
    empleado.id_jefe = req.body.id_jefe;
    empleado.id_dpto = req.body.id_dpto;
    empleado.correo = req.body.correo;
    empleado.cargo = req.body.cargo;

    mysqlConnection
        .query("UPDATE horarioscca.empleado \
         SET nombre_emp=?, apellido1=?, apellido2=?, fecha_ingreso=?, tipo_emp=?, id_jefe=?, id_dpto=?, correo=?, cargo=?\
            WHERE id_empleado = ? ", [

                empleado.nombre,
                empleado.apellido1,
                empleado.apellido2,
                empleado.fecha_ingreso,
                empleado.tipo,
                empleado.id_jefe,
                empleado.id_dpto,
                empleado.correo,
                empleado.cargo,
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