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
// ================OBTENER TODOS LOS LUGARES ===============
//=========================================================
app.get('/', (req, res, next) => {
    mysqlConnection
        .query('SELECT * FROM lugar', (err, rows, field) => {
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
// ================OBTENER LUGAR POR ID ===============
//=========================================================

app.get('/:id', (req, res, next) => {

    mysqlConnection
        .query('SELECT * FROM lugar WHERE id_lugar = ?', [req.params.id], (err, rows, field) => {
            if (!err && rows != "") {
                // console.log(rows);
                res.status(200).json({
                    ok: true,
                    rows: rows
                });
            } else {
                res.status(500).json({
                    ok: false,
                    error: "No existe lugar con ese id "
                });
            }
        })
});


// ========================================================
// ================BORRAR LUGAR POR ID ===============
//=========================================================

app.delete('/:id', (req, res, next) => {

    mysqlConnection.query('DELETE FROM lugar WHERE id_lugar = ?', [req.params.id], (err, rows) => {
        if (!err && rows.affectedRows === 1) {
            // console.log(rows);
            res.status(200).json({
                ok: true,
                msj: "Se eliminó el lugar ",
                rows: rows
            });
        } else {
            res.status(500).json({
                ok: false,
                error: "No existe el lugar con ese id ",
                err: err
            });
        }
    })
});


// ========================================================
// ================AGREGAR LUGAR ===============
//=========================================================
app.post('/', (req, res, next) => {

    var lugar = {
        id_lugar: Number,
        nombre: String,
        descripcion: String,
        fecha_constr: Date,
        id_edificio: Number
    }
    lugar.nombre = req.body.nombre;
    lugar.descripcion = req.body.descripcion;
    lugar.fecha_constr = req.body.fecha_constr;
    lugar.id_edificio = req.body.id_edificio;


    mysqlConnection
        .query("INSERT INTO horarioscca.lugar \
        (nombre, descripcion, fecha_constr, id_edificio) \
         VALUES (?,?,?,?) ", [
                lugar.nombre,
                lugar.descripcion,
                lugar.fecha_constr,
                lugar.id_edificio,
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
// ================ACTUALIZAR LUGAR =======================
//=========================================================
app.put('/:id', (req, res, next) => {

    var lugar = {
        id_lugar: Number,
        nombre: String,
        descripcion: String,
        fecha_constr: Date,
        id_edificio: Number
    }
    lugar.nombre = req.body.nombre;
    lugar.descripcion = req.body.descripcion;
    lugar.fecha_constr = req.body.fecha_constr;
    lugar.id_edificio = req.body.id_edificio;

    mysqlConnection
        .query("UPDATE horarioscca.lugar \
         SET nombre=?, descripcion=?, fecha_constr=?, id_edificio=?\
            WHERE id_lugar = ? ", [
                lugar.nombre,
                lugar.descripcion,
                lugar.fecha_constr,
                lugar.id_edificio,
                req.params.id
            ],
            (err, rows) => {
                if (!err && rows.affectedRows === 1) {
                    // console.log(rows);
                    res.status(200).json({
                        ok: true,
                        resp: {
                            mensaje: "Update Correcta de Lugar",
                            Body: req.body,
                            rows: rows
                        }
                    });
                } else {
                    res.status(500).json({
                        ok: false,
                        msj: 'No se actualizo Lugar',
                        error: err,
                        body: req.body
                    });
                }
            })
});

module.exports = app