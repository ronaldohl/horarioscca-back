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
        console.log('Fallo conexion -detActividad');
    } else {
        console.log('Conexion Exitosa -detActividad');
    }
});

var app = express();

// ========================================================
// ================OBTENER DETALLES ACT ===============
//=========================================================

app.get('/:id', (req, res, next) => {

    mysqlConnection
        .query("select turno.id_turno, turno.dia, turno.hora_inicio, turno.hora_fin, empleado.id_empleado, empleado.nombre_emp, actividad.nombre_actv, actividad.clasificacion_actv, actividad.descripcion_actv, actividad.costo_actv, actividad.det_costo_actv, lugar.id_lugar, lugar.nombre_lugar from turno inner join horarioscca.actividad  inner join empleado inner join lugar\
        where turno.tipo='a' and turno.id_turno=? and turno.id_actividad=actividad.id_actividad and turno.id_empleado = empleado.id_empleado and turno.id_lugar=lugar.id_lugar;  ", [req.params.id, req.params.id], (err, rows, field) => {
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