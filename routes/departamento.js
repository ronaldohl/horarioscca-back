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
        console.log('Fallo conexion -Departamento');
    } else {
        console.log('Conexion Exitosa -Departamento');
    }
});

var app = express();


// ========================================================
// ================OBTENER TODOS LOS DEPARTAMENTOS ===============
//=========================================================
app.get('/', (req, res, next) => {
    mysqlConnection
        .query('SELECT * FROM departamento', (err, rows, field) => {
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

    mysqlConnection
        .query('SELECT * FROM departamento WHERE id_dpto = ?', [req.params.id], (err, rows, field) => {
            if (!err && rows != "") {
                // console.log(rows);
                res.status(200).json({
                    ok: true,
                    rows: rows
                });
            } else {
                res.status(500).json({
                    ok: false,
                    error: "No existe departamento con ese id "
                });
            }
        })
});


// ========================================================
// ================BORRAR DEPARTAMENTO POR ID ===============
//=========================================================

app.delete('/:id', (req, res, next) => {

    mysqlConnection.query('DELETE FROM departamento WHERE id_dpto = ?', [req.params.id], (err, rows) => {
        if (!err && rows != "") {
            // console.log(rows);
            res.status(200).json({
                ok: true,
                msj: "Se eliminó el departamento ",
                rows: rows
            });
        } else {
            res.status(500).json({
                ok: false,
                error: "No existe el dpto con ese id ",
                err: err
            });
        }
    })
});


// ========================================================
// ================AGREGAR DEPARTAMENTO ===============
//=========================================================
app.post('/', (req, res, next) => {

    var departameto = {
        id_dpto: Number,
        nombre: String,
        tipo: String,
        descripcion: String,
        id_lugar: Number,
        id_dep_sup: Number,
        id_emp_resp: Number
    }

    departameto.nombre = req.body.nombre;
    departameto.tipo = req.body.tipo;
    departameto.descripcion = req.body.descripcion;
    departameto.id_lugar = req.body.id_lugar;
    departameto.id_dep_sup = req.body.id_dep_sup;
    departameto.id_emp_resp = req.body.id_emp_resp;

    mysqlConnection
        .query("INSERT INTO horarioscca.departamento (nombre,tipo,descripcion,id_lugar,id_dep_sup,id_emp_resp ) \
         VALUES (?,?,?,?,?,?) ", [
                departameto.nombre,
                departameto.tipo,
                departameto.descripcion,
                departameto.id_lugar,
                departameto.id_dep_sup,
                departameto.id_emp_resp,
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
// ================ACTUALIZAR DEPARTAMENTO =======================
//=========================================================
app.put('/:id', (req, res, next) => {

    var departameto = {
        id_dpto: Number,
        nombre: String,
        tipo: String,
        descripcion: String,
        id_lugar: Number,
        id_dep_sup: Number,
        id_emp_resp: Number
    }

    departameto.nombre = req.body.nombre;
    departameto.tipo = req.body.tipo;
    departameto.descripcion = req.body.descripcion;
    departameto.id_lugar = req.body.id_lugar;
    departameto.id_dep_sup = req.body.id_dep_sup;
    departameto.id_emp_resp = req.body.id_emp_resp;

    mysqlConnection
        .query("UPDATE horarioscca.departamento \
         SET nombre=?, tipo=? ,descripcion=?, id_lugar=?, id_dep_sup=?, id_emp_resp=?\
            WHERE id_dpto = ? ", [
                departameto.nombre,
                departameto.tipo,
                departameto.descripcion,
                departameto.id_lugar,
                departameto.id_dep_sup,
                departameto.id_emp_resp,
                req.params.id
            ],
            (err, rows) => {
                if (!err) {
                    // console.log(rows);
                    res.status(200).json({
                        ok: true,
                        resp: {
                            mensaje: "Update Correcta de Empleado",
                            Body: req.body,
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

module.exports = app