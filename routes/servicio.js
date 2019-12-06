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
        console.log('Fallo conexion -Servicio');
    } else {
        console.log('Conexion Exitosa -Servicio');
    }
});

var app = express();


// ========================================================
// ================OBTENER TODOS LOS SERVICIOS ===============
//=========================================================
app.get('/', (req, res, next) => {
    mysqlConnection
        .query('SELECT * FROM servicio order by categoria_serv, nombre_serv;', (err, rows, field) => {
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
// ================OBTENER SERVICIO POR ID ===============
//=========================================================

app.get('/:id', (req, res, next) => {

    mysqlConnection
        .query('SELECT * FROM servicio WHERE id_servicio = ?', [req.params.id], (err, rows, field) => {
            if (!err && rows != "") {
                // console.log(rows);
                res.status(200).json({
                    ok: true,
                    rows: rows
                });
            } else {
                res.status(500).json({
                    ok: false,
                    error: "No existe servicio con ese id "
                });
            }
        })
});


// ========================================================
// ================BORRAR SERVICIO POR ID ===============
//=========================================================

app.delete('/:id', (req, res, next) => {

    mysqlConnection.query('call BorrarServicio(?);', [req.params.id], (err, rows) => {
        if (!err) {
            // console.log(rows);
            res.status(200).json({
                ok: true,
                msj: "Se eliminó el servicio ",
                rows: rows
            });
        } else {
            res.status(500).json({
                ok: false,
                error: "No existe el servicio con ese id ",
                err: err
            });
        }
    })
});


// ========================================================
// ================AGREGAR SERVICIO ===============
//=========================================================
app.post('/', (req, res, next) => {

    var servicio = {
        id_servicio: Number,
        nombre: String,
        categoria: String,
        descripcion: String,
        id_lugar: Number
    }

    servicio.nombre = req.body.nombre_serv;
    servicio.categoria = req.body.categoria_serv;
    servicio.descripcion = req.body.descripcion_serv;
    servicio.id_lugar = req.body.id_lugar;

    mysqlConnection
        .query("INSERT INTO horarioscca.servicio \
        (nombre_serv,categoria_serv, descripcion_serv, id_lugar) \
         VALUES (?,?,?,?) ", [
                servicio.nombre,
                servicio.categoria,
                servicio.descripcion,
                servicio.id_lugar,
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
// ================ACTUALIZAR SERVICIO =======================
//=========================================================
app.put('/:id', (req, res, next) => {
    var servicio = {
        id_servicio: Number,
        nombre: String,
        categoria: String,
        descripcion: String,
        id_lugar: Number
    }

    servicio.nombre = req.body.nombre_serv;
    servicio.categoria = req.body.categoria_serv;
    servicio.descripcion = req.body.descripcion_serv;
    servicio.id_lugar = req.body.id_lugar;

    mysqlConnection
        .query("UPDATE horarioscca.servicio \
         SET nombre_serv=?, categoria_serv=?, descripcion_serv=?, id_lugar=?\
            WHERE id_servicio = ? ", [
                servicio.nombre,
                servicio.categoria,
                servicio.descripcion,
                servicio.id_lugar,
                req.params.id
            ],
            (err, rows) => {
                if (!err && rows.affectedRows === 1) {
                    // console.log(rows);
                    res.status(200).json({
                        ok: true,

                        mensaje: "Update Correcta de Servicio",
                        Body: req.body,
                        rows: rows

                    });
                } else {
                    res.status(500).json({
                        ok: false,
                        msj: 'No se actualizo Servicio',
                        error: err,
                        body: req.body
                    });
                }
            })
});

module.exports = app