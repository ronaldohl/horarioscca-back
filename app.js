// Requires
var mysql = require('mysql');
var express = require('express');
var bodyParser = require('body-parser');


//Inicializar variables
var app = express();

//Body Parser
// app.use(bodyParser.urlencoded({ extended: false }));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
    // parse application/json
app.use(bodyParser.json())

//Importar rutas
var appRoutes = require('./routes/app');
var claseRoutes = require('./routes/clase');



//Conexion a bd
var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'toor',
    database: 'horarioscca'
});

mysqlConnection.connect((err) => {
    if (err) {
        console.log('Fallo conexion');
    } else {
        console.log('Conexion Exitosa');
    }
});


//Rutas para realizar petición
// app.use('/clase', claseRoutes);

//Esta tiene que ser la última ruta
//  app.use('/', appRoutes);
app.use('/clase', claseRoutes)


//Escuchar peticiones
app.listen(3000, () => {
        console.log('Express run port:3000');

    })
    /* SI SIRVE PETICION 
    app.get('/clase', (req, res, next) => {

        mysqlConnection.query('SELECT * FROM clase', (err, rows, field) => {
            if (!err) {
                console.log(rows);
                res.status(200).json({
                    ok: true,
                    rows: rows,
                    field: field
                });
            } else {
                console.log("no se pudo obtener datos de clase");
            }

        })

    });
    */


// module.exports = mysqlConnection