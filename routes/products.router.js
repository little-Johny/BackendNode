const express = require('express');
const ProductService = require('../services/product.service');
const validatorHandler = require('../middlewares/validator.handler');
const {
  createProductSchema,
  updateProductSchema,
  getProductSchema,
} = require('../schemas/product.schema');

//creacion de router
const router = express.Router();

//instancia de servicio de productos
const service = new ProductService();

//obetener todos los productos
router.get('/', async (request, response) => {
  try {
    const products = await service.find();
    response.status(200).json(products);
  } catch (error) {
    res.status(404).json({ message: erro.message });
  }
});

//obtener producto con filtro( los endpoints especificos deben ir antes de los dinamicos)
router.get('/filter', (req, res) => {
  res.status(200).send('I am a filter');
});

//obtener producto por id
router.get(
  '/:id',
  validatorHandler(getProductSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const product = await service.findOne(id);
      res.json(product);
    } catch (error) {
      next(error);
    }
  },
);

//obtener productos por categoria
router.get('/category/:categoryId', async (req, res) => {
  const { categoryId } = req.params;

  try {
    const id = parseInt(categoryId, 10);
    const products = await service.findByCategory(id);
    res.status(200).json(products);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

//Creacion de productos
router.post(
  '/',
  validatorHandler(createProductSchema, 'body'),
  async (req, res) => {
    try {
      const body = req.body;
      const newProduct = await service.create(body);
      res.status(201).json({
        message: 'product created',
        data: newProduct,
      });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },
);

//Actalizacion de productos
router.patch(
  '/:id',
  validatorHandler(getProductSchema, 'params'),
  validatorHandler(updateProductSchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const updateProduct = await service.update(id, body);
      res.status(200).json({
        message: `updated(PATCH) product ${id}`,
        data: updateProduct,
        id,
      });
    } catch (error) {
      next(error);
    }
  },
);

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const body = req.body;

  res.status(200).json({
    message: `updated(PUT) product ${id}`,
    data: body,
    id,
  });
});

//Eliminacion de productos
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleteProduct = await service.delete(id);

    res.status(200).json({
      message: `deleted product ${id}`,
      deleteProduct,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

module.exports = router;
