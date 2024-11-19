const express = require('express');
const CategoriesService = require('../services/categories.service');

//creacion de router
const router = express.Router();
const service = new CategoriesService();

// Ruta para obtener todas las categorías
router.get('/', (req, res) => {
  const categories = service.find();
  res.status(200).json(categories);
});

//obtener categoria por id
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const category = service.findOne(Number(id));
  res.status(200).json(category);
});

//Creacion de categorias
router.post('/', (req, res) => {
  const body = req.body;
  const newCategory = service.create(body);
  res.status(201).json({
    message: 'category created',
    data: newCategory,
  });
});

//Actalizacion de categorias
router.patch('/:id', (req, res) => {
  const { id } = req.params;
  const body = req.body;
  const updateCategory = service.update(id, body);
  res.status(200).json({
    message: `updated(PATCH) category ${id}`,
    data: updateCategory,
    id,
  });
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const deleteCategory = service.delete(id);

  res.status(200).json({
    message: `deleted category ${id}`,
    deleteCategory,
  });
});

module.exports = router;
