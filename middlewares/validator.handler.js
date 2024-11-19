// Importación de Boom
const boom = require('@hapi/boom');

// Middleware para gestionar validaciones
function validatorHandler(schema, property) {
  return (req, res, next) => {
    const data = req[property]; // Extrae los datos de la propiedad (body, params, query)
    const { error } = schema.validate(data, { abortEarly: false }); // Validación de datos
    if (error) {
      // Si hay error, genera un error tipo Boom con un 400 (Bad Request)
      next(boom.badRequest(error.details.map((err) => err.message).join(', ')));
    } else {
      // Si no hay error, continúa al siguiente middleware
      next();
    }
  };
}

module.exports = validatorHandler;
