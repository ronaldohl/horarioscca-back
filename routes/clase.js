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
        console.log('Fallo conexion -clase');
    } else {
        console.log('Conexion Exitosa -clase');
    }
});

var app = express();


// ========================================================
// ================OBTENER TODAS LAS CLASES ===============
//=========================================================
app.get('/', (req, res, next) => {
    mysqlConnection.query('SELECT * FROM clase', (err, rows, field) => {
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
// ================OBTENER CLASE POR ID ===============
//=========================================================

app.get('/:id', (req, res, next) => {

    mysqlConnection.query('SELECT * FROM clase WHERE id_clase = ?', [req.params.id], (err, rows, field) => {
        if (!err && rows != "") {
            // console.log(rows);
            res.status(200).json({
                ok: true,
                rows: rows
            });
        } else {
            res.status(500).json({
                ok: false,
                error: "No existe clase con ese id "
            });
        }
    })
});


// ========================================================
// ================BORRAR CLASE POR ID ===============
//=========================================================

app.delete('/:id', (req, res, next) => {

    mysqlConnection.query('DELETE FROM clase WHERE id_clase = ?', [req.params.id], (err, rows) => {
        if (!err && rows != "") {
            // console.log(rows);
            res.status(200).json({
                ok: true,
                rows: "Se eliminó la clase " + rows
            });
        } else {
            res.status(500).json({
                ok: false,
                error: "No existe clase con ese id "
            });
        }
    })
});


// ========================================================
// ================AGREGAR CLASE ===============
//=========================================================
app.post('/', (req, res, next) => {

    var clase = {
        id_clase: Number,
        nombre: String,
        tipo: String,
        anotaciones: String
    }

    clase.nombre = req.body.nombre;
    clase.tipo = req.body.tipo;
    clase.anotaciones = req.body.anotaciones;

    mysqlConnection.query("INSERT INTO horarioscca.clase (nombre,tipo,anotaciones ) VALUES (?,?,?) ", [clase.nombre, clase.tipo, clase.anotaciones], (err, rows) => {
        if (!err) {
            // console.log(rows);
            res.status(200).json({
                ok: true,
                resp: {
                    mensaje: "Insercion Correcta",
                    rows
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
// ================ACTUALIZAR CLASE =======================
//=========================================================
app.put('/:id', (req, res, next) => {

    var clase = {
        id_clase: Number,
        nombre: String,
        tipo: String,
        anotaciones: String
    }

    clase.nombre = req.body.nombre;
    clase.tipo = req.body.tipo;
    clase.anotaciones = req.body.anotaciones;

    mysqlConnection.query("UPDATE horarioscca.clase SET nombre=?, tipo=? ,anotaciones=? WHERE id_clase = ? ", [clase.nombre, clase.tipo, clase.anotaciones, req.params.id], (err, rows) => {
        if (!err) {
            // console.log(rows);
            res.status(200).json({
                ok: true,
                resp: {
                    mensaje: "Update Correcta de clase",
                    Body: req.body,
                    rows
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