const express = require('express');
const asyncErrors = require('express-async-errors');
const routerApi = require('./routes');
const cors = require('cors');
//Importacion de middlewares para errores
const {
  errorHandler,
  logErrors,
  boomErrorHandler,
} = require('./middlewares/error.handler');

const app = express();
const port = 3000;

//middleware de express
app.use(express.json());

//implementacion de cors

// definicion de a quienes dar permiso
const whiteList = [
  'http://localhost:8080',
  'https://myapp.com',
  'http://192.168.20.30:5500',
];

const options = {
  origin: (origin, callback) => {
    whiteList.includes(origin)
      ? callback(null, true)
      : callback(new Error(`Origin ${origin} Not allowed`));
  },
};
app.use(cors(options));

// Definir ruta
app.get('/', (request, response) => {
  response.send('Hello, my first server in Express');
});

app.get('/new_endpoint', (request, response) => {
  response.send('Hello, i am new endpoint');
});

routerApi(app);

//implementacion de middlewares
app.use(logErrors);
app.use(boomErrorHandler);
app.use(errorHandler);

// Escuchar el puerto
app.listen(port, () => {
  console.log('Listening on port ' + port);
});
