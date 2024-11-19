// capturador de errores
function logErrors(err, req, res, next) {
  console.log(`logErrors`);
  console.error(err);
  next(err);
}

//error con formato para el cliente
function errorHandler(err, req, res, next) {
  console.log(`errorHandler`);
  res.status(500).json({
    message: err.message,
    stack: err.stack,
  });
  next();
}

//manejo de errores tipo boom
function boomErrorHandler(err, req, res, next) {
  //validar si el error es creado por la libreria boom
  if (err.isBoom) {
    const { output } = err;
    //estatus code dinamico y json leidos desde el output de boom
    res.status(output.statusCode).json(output.payload);
  } else {
    //si no es un errore de tipo boom ira a ejecutar un middleware de errores normales
    next(err);
  }
}

module.exports = { logErrors, errorHandler, boomErrorHandler };
