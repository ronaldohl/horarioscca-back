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
        console.log('Fallo conexion -subservicio');
    } else {
        console.log('Conexion Exitosa -subservicio');
    }
});

var app = express();


// ========================================================
// ================OBTENER TODOS LOS subservicioS ===============
//=========================================================
app.get('/', (req, res, next) => {
    mysqlConnection
        .query('SELECT * FROM subservicio', (err, rows, field) => {
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
// ================OBTENER subservicio POR ID ===============
//=========================================================

app.get('/:id', (req, res, next) => {

    mysqlConnection
        .query('SELECT * FROM subservicio WHERE id_subservicio = ?', [req.params.id], (err, rows, field) => {
            if (!err && rows != "") {
                // console.log(rows);
                res.status(200).json({
                    ok: true,
                    rows: rows
                });
            } else {
                res.status(500).json({
                    ok: false,
                    error: "No existe subservicio con ese id "
                });
            }
        })
});


// ========================================================
// ================BORRAR subservicio POR ID ===============
//=========================================================

app.delete('/:id', (req, res, next) => {

    mysqlConnection.query('DELETE FROM subservicio WHERE id_subservicio = ?', [req.params.id], (err, rows) => {
        if (!err && rows.affectedRows === 1) {
            // console.log(rows);
            res.status(200).json({
                ok: true,
                msj: "Se eliminó el subservicio ",
                rows: rows
            });
        } else {
            res.status(500).json({
                ok: false,
                error: "No existe el subservicio con ese id ",
                err: err
            });
        }
    })
});


// ========================================================
// ================AGREGAR subservicio ===============
//=========================================================
app.post('/', (req, res, next) => {

    var subservicio = {
        id_subservicio: Number,
        nombre: String,
        recomendaciones: String,
        descripcion: String,
        costo: Number,
        det_costo: String,
        duracion: Number,
        id_servicio: Number
    }
    subservicio.nombre = req.body.nombre_subs;
    subservicio.recomendaciones = req.body.recomendaciones_subs;
    subservicio.descripcion = req.body.descripcion_subs;
    subservicio.costo = req.body.costo_subs;
    subservicio.det_costo = req.body.det_costo_subs;
    subservicio.duracion = req.body.duracion;
    subservicio.id_servicio = req.body.id_servicio;

    mysqlConnection
        .query("INSERT INTO horarioscca.subservicio \
        (nombre_subs,recomendaciones_subs, descripcion_subs, costo_subs, det_costo_subs, duracion, id_servicio) \
         VALUES (?,?,?,?,?,?,?) ", [
                subservicio.nombre,
                subservicio.recomendaciones,
                subservicio.descripcion,
                subservicio.costo,
                subservicio.det_costo,
                subservicio.duracion,
                subservicio.id_servicio,
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
// ================ACTUALIZAR subservicio =======================
//=========================================================
app.put('/:id', (req, res, next) => {

    var subservicio = {
        id_subservicio: Number,
        nombre: String,
        recomendaciones: String,
        descripcion: String,
        costo: Number,
        det_costo: String,
        duracion: Number,
        id_servicio: Number
    }
    subservicio.nombre = req.body.nombre_subs;
    subservicio.recomendaciones = req.body.recomendaciones_subs;
    subservicio.descripcion = req.body.descripcion_subs;
    subservicio.costo = req.body.costo_subs;
    subservicio.det_costo = req.body.det_costo_subs;
    subservicio.duracion = req.body.duracion;
    subservicio.id_servicio = req.body.id_servicio;

    mysqlConnection
        .query("UPDATE horarioscca.subservicio \
         SET nombre_subs=?, recomendaciones_subs=?, descripcion_subs=?, costo_subs=?, det_costo_subs=?, duracion=?, id_servicio=?\
            WHERE id_subservicio = ? ", [
                subservicio.nombre,
                subservicio.recomendaciones,
                subservicio.descripcion,
                subservicio.costo,
                subservicio.det_costo,
                subservicio.duracion,
                subservicio.id_servicio,
                req.params.id
            ],
            (err, rows) => {
                if (!err && rows.affectedRows === 1) {
                    // console.log(rows);
                    res.status(200).json({
                        ok: true,

                        mensaje: "Update Correcta de subsubservicio",
                        Body: req.body,
                        rows: rows

                    });
                } else {
                    res.status(500).json({
                        ok: false,
                        msj: 'No se actualizo subsubservicio',
                        error: err,
                        body: req.body
                    });
                }
            })
});


app.get('/deservicio/:id', (req, res, next) => {

    mysqlConnection
        .query('SELECT * FROM subservicio WHERE id_servicio = ?', [req.params.id], (err, rows, field) => {
            if (!err && rows != "") {
                // console.log(rows);
                res.status(200).json({
                    ok: true,
                    rows: rows
                });
            } else {
                res.status(500).json({
                    ok: false,
                    error: "No existe subservicio con ese id "
                });
            }
        })
});
module.exports = app