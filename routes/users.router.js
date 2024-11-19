const express = require('express');
const UsersService = require('../services/user.service');

//creacion de router
const router = express.Router();
const service = new UsersService();

// Ruta para obtener todas losd usuarios
router.get('/', (req, res) => {
  const users = service.find();
  res.status(200).json(users);
});

//obtener usuario por id
// Obtener usuario por id
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const user = service.findOne(Number(id)); // Convierte el ID a número

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.status(200).json({
    message: `found user`,
    user,
  });
});

//query params usuarios
router.get('/limit', (req, res) => {
  //recogemos query params
  const { limit, offset } = req.query;

  //validacion de recepcion de parametros
  if (limit && offset) {
    res.status(200).json({
      limit,
      offset,
    });
  } else {
    res.status(404).json({ message: 'Not have params' });
  }
});

//Creacion de usuarios
router.post('/', (req, res) => {
  const body = req.body;
  const newUser = service.create(body);
  res.status(201).json({
    message: 'user created',
    data: newUser,
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
  const deleteUser = service.delete(id);

  res.status(200).json({
    message: `deleted user ${id}`,
    deleteUser,
  });
});

module.exports = router;
