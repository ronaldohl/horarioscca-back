// Requires
var mysql = require('mysql');
var express = require('express');
var bodyParser = require('body-parser');


//Inicializar variables
var app = express();

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});


//Body Parser

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
    // parse application/json
app.use(bodyParser.json())

//Importar rutas
var appRoutes = require('./routes/app');
var claseRoutes = require('./routes/clase');
var actividadRoutes = require('./routes/actividad');
var avisoRoutes = require('./routes/aviso');
var departamentoRoutes = require('./routes/departamento');
var empleadoRoutes = require('./routes/empleado');
var extensionRoutes = require('./routes/extension');
var lugarRoutes = require('./routes/lugar');
var servicioRoutes = require('./routes/servicio');
var subservicioRoutes = require('./routes/subservicio');
var turnoRoutes = require('./routes/turno');
var loginRoutes = require('./routes/login');
var usuarioRoutes = require('./routes/usuario');
var detActividadRoutes = require('./routes/detActividad');
var horarioRoutes = require('./routes/horario');
var verEmpleadoRoutes = require('./routes/verEmpleado');
var detClaseRoutes = require('./routes/detClase');

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
app.use('/clase', claseRoutes);
app.use('/actividad', actividadRoutes);
app.use('/aviso', avisoRoutes);
app.use('/departamento', departamentoRoutes);
app.use('/empleado', empleadoRoutes);
app.use('/extension', extensionRoutes);
app.use('/lugar', lugarRoutes);
app.use('/servicio', servicioRoutes);
app.use('/subservicio', subservicioRoutes);
app.use('/turno', turnoRoutes);
app.use('/login', loginRoutes);
app.use('/usuario', usuarioRoutes);
app.use('/detActividad', detActividadRoutes);
app.use('/horario', horarioRoutes);
app.use('/verEmpleado', verEmpleadoRoutes);
app.use('/detClase', detClaseRoutes);



//Esta tiene que ser la última ruta
//si la pongo crash -- :(
//  app.use('/', appRoutes);

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

//Era para ver si podia exportar la conexion y no estar haciendola en cada route
// module.exports = mysqlConnection