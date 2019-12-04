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
        console.log('Fallo conexion -horario');
    } else {
        console.log('Conexion Exitosa -horario');
    }
});

var app = express();

// ========================================================
// ================OBTENER HORARIO ACT ===============
//=========================================================

app.get('/:tipo/:id', (req, res, next) => {
    var tipo = req.params.tipo;
    var id_pet;
    var tabla;
    if (tipo == 'a') {
        id_pet = 'id_actividad';
        tabla = 'actividad';
    } else if (tipo == 'e') {
        id_pet = 'id_empleado';
        tabla = 'empleado';
    } else if (tipo == 'd') {
        id_pet = 'id_dpto';
        tabla = 'departamento';
    } else if (tipo == 'l') {
        id_pet = 'id_lugar';
        tabla = 'lugar';
    } else if (tipo == 's') {
        id_pet = 'id_servicio';
        tabla = 'servicio';
    }


    mysqlConnection
        .query(`select turno.id_turno, turno.dia, turno.hora_inicio, turno.hora_fin, turno.tipo \
        from turno inner join horarioscca.${tabla} on ${tabla}.${id_pet}=turno.${id_pet} \
        where turno.tipo='${tipo}' and turno.${id_pet}=?\
        order by turno.dia ASC;  `, [req.params.id], (err, rows, field) => {
            if (!err && rows != "") {
                // console.log(rows);
                res.status(200).json({
                    ok: true,
                    rows: rows
                });
            } else {
                res.status(500).json({
                    ok: false,
                    error: err,
                    obj: {
                        tipo: tipo,
                        id_pet: id_pet
                    }

                });
            }
        })
});
module.exports = app;