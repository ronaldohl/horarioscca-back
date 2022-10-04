var express = require('express');
var mysql = require('mysql');

const CONFIG_BD = require('../config/config').CONFIG_BD;



//Conexion a bd
var mysqlConnection = mysql.createConnection(CONFIG_BD);

mysqlConnection.connect((err) => {
    if (err) {
        console.log('Fallo conexion -verEmpleado');
    } else {
        console.log('Conexion Exitosa -verEmpleado');
    }
});

var app = express();

// ========================================================
// ================OBTENER VISTA VER EMPLEADO===============
//=========================================================

app.get('/:id', (req, res, next) => {

    mysqlConnection
        .query(" select emp1.id_empleado, emp1.nombre_emp, emp1.apellido1, emp1.apellido2, emp1.cargo, emp1.fecha_ingreso, emp1.tipo_emp, emp1.correo, jefe.nombre_emp, d.nombre_dpto\
                from empleado as emp1 inner join empleado as jefe on emp1.id_jefe=jefe.id_empleado inner join departamento as d on emp1.id_dpto=d.id_dpto\
                where emp1.id_empleado=?;   ", [req.params.id], (err, rows, field) => {
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