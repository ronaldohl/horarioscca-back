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
// ================OBTENER ACTIVIDADES DE UNA CLASE ===============
//=========================================================

app.get('/:id', (req, res, next) => {

    mysqlConnection
        .query("select actividad.id_actividad, actividad.nombre_actv, actividad.clasificacion_actv, actividad.descripcion_actv, clase.nombre_clase \
        from actividad inner join clase  on actividad.id_clase= clase.id_clase \
        where clase.id_clase=? order by nombre_actv; ", [req.params.id], (err, rows, field) => {
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