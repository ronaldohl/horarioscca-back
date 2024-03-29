var express = require('express');
var mysql = require('mysql');

const CONFIG_BD = require('../config/config').CONFIG_BD;



//Conexion a bd
var mysqlConnection = mysql.createConnection(CONFIG_BD);

mysqlConnection.connect((err) => {
    if (err) {
        console.log('Fallo conexion -aviso');
    } else {
        console.log('Conexion Exitosa -aviso');
    }
});

var app = express();


// ========================================================
// ================OBTENER TODAS LOS AVISOS ===============
//=========================================================
app.get('/', (req, res, next) => {
    mysqlConnection.query('SELECT * FROM aviso order by tipo_avi;', (err, rows, field) => {
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
// ================OBTENER AVISO POR ID ===============
//=========================================================

app.get('/:id', (req, res, next) => {

    mysqlConnection.query('SELECT * FROM aviso WHERE id_aviso = ?', [req.params.id], (err, rows, field) => {
        if (!err && rows != "") {
            // console.log(rows);
            res.status(200).json({
                ok: true,
                rows: rows
            });
        } else {
            res.status(500).json({
                ok: false,
                error: "No existe aviso con ese id "
            });
        }
    })
});


// ========================================================
// ================BORRAR AVISO POR ID ===============
//=========================================================

app.delete('/:id', (req, res, next) => {

    mysqlConnection.query('DELETE FROM aviso WHERE id_aviso = ?', [req.params.id], (err, rows) => {
        if (!err && rows != "") {
            // console.log(rows);
            res.status(200).json({
                ok: true,
                msj: "Se eliminó la el aviso ",
                rows: rows
            });
        } else {
            res.status(500).json({
                ok: false,
                error: "No existe aviso con ese id ",
                err: err
            });
        }
    })
});


// ========================================================
// ================AGREGAR AVISO ===============
//=========================================================
app.post('/', (req, res, next) => {

    var aviso = {
        id_aviso: Number,
        nombre: String,
        tipo: String,
        descripcion: String
    }

    aviso.nombre = req.body.nombre_avi;
    aviso.tipo = req.body.tipo_avi;
    aviso.descripcion = req.body.descripcion_avi;


    mysqlConnection
        .query("INSERT INTO bd_horarioscca_angular.aviso (nombre_avi,tipo_avi,descripcion_avi ) \
         VALUES (?,?,?) ", [aviso.nombre, aviso.tipo, aviso.descripcion],
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
// ================ACTUALIZAR AVISO =======================
//=========================================================
app.put('/:id', (req, res, next) => {

    var aviso = {
        id_aviso: Number,
        nombre: String,
        tipo: String,
        descripcion: String
    }

    aviso.nombre = req.body.nombre_avi;
    aviso.tipo = req.body.tipo_avi;
    aviso.descripcion = req.body.descripcion_avi;

    mysqlConnection
        .query("UPDATE bd_horarioscca_angular.aviso SET nombre_avi=?, tipo_avi=? ,descripcion_avi=?\
            WHERE id_aviso = ? ", [aviso.nombre, aviso.tipo, aviso.descripcion, req.params.id],
            (err, rows) => {
                if (!err) {
                    // console.log(rows);
                    res.status(200).json({
                        ok: true,

                        mensaje: "Update Correcta de clase",
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