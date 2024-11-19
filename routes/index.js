const express = require('express');

const productsRouter = require('./products.router.js');
const usersRouter = require('./users.router.js');
const categoriesRouter = require('./categories.router.js');
const salesRouter = require('./sales.router.js');

function routerApi(app) {
  //Crear ruta maestra para versiones de la API
  const router = express.Router();
  app.use('/api/v1', router);

  router.use('/products', productsRouter);
  router.use('/users', usersRouter);
  router.use('/categories', categoriesRouter);
  router.use('/sales', salesRouter);
}

module.exports = routerApi;
