// Importación de Joi
const Joi = require('joi');

// Definición de tipos individuales
const id = Joi.string().uuid(); // ID como UUID
const name = Joi.string().min(3).max(20); // Nombre alfanumérico entre 3 y 20 caracteres
const price = Joi.number().integer().min(10); // Precio mínimo 10
const image = Joi.string().uri(); // Imagen como URL válida
const category = Joi.string().min(3).max(30); // Categoría de 3 a 30 caracteres
const isBlock = Joi.boolean(); // Bloqueo como booleano

// Esquema para creación de productos
const createProductSchema = Joi.object({
  name: name.required(), // Nombre obligatorio
  price: price.required(), // Precio obligatorio
  image: image.required(), // URL de imagen obligatorio
  category: category.required(), // Categoría obligatoria
  isBlock: isBlock, // Bloqueo obligatorio
});

// Esquema para actualización de productos
const updateProductSchema = Joi.object({
  name: name, // Nombre opcional
  price: price, // Precio opcional
  image: image, // URL opcional
  category: category, // Categoría opcional
  isBlock: isBlock, // Bloqueo opcional
});

// Esquema para consultar un producto por su ID
const getProductSchema = Joi.object({
  id: id.required(), // ID obligatorio
});

// Exportación de esquemas
module.exports = {
  createProductSchema,
  updateProductSchema,
  getProductSchema,
};
