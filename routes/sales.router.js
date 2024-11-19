const express = require('express');
const SalesService = require('../services/sale.service');

// Creación de router
const router = express.Router();
const service = new SalesService();

// Obtener todas las ventas
router.get('/', (req, res) => {
  const sales = service.find();
  res.status(200).json(sales);
});

// Obtener una venta específica con detalles
router.get('/:id', (req, res) => {
  const { id } = req.params;

  try {
    const saleId = parseInt(id, 10);
    if (isNaN(saleId)) {
      return res.status(400).json({ message: 'Invalid sale ID' });
    }

    // Buscar la venta específica
    const sale = service.findOne(saleId);
    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }

    // Calcular el total de la venta
    const totalAmount = service.calculateTotal(sale.id);

    // Obtener detalles del cliente
    const client = service.usersService.findOne(sale.clientId);
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    // Crear detalle de productos en la venta
    const saleDetails = sale.saleProducts.map((item) => {
      const product = service.productsService.findOne(item.productId);
      if (!product) {
        return {
          name: 'Unknown Product',
          price: 0,
          quantity: item.quantity,
          total: 0,
        };
      }
      return {
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        total: product.price * item.quantity,
      };
    });

    // Responder con los datos completos de la venta
    res.status(200).json({
      saleId: sale.id,
      client,
      products: saleDetails,
      totalAmount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Crear una nueva venta
router.post('/', (req, res) => {
  const { clientId, saleProducts } = req.body;

  if (!clientId || !Array.isArray(saleProducts)) {
    return res.status(400).json({ message: 'Invalid request body' });
  }

  try {
    const newSale = service.create({ clientId, saleProducts });
    res.status(201).json(newSale);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Actualizar una venta
router.patch('/:id', (req, res) => {
  const { id } = req.params;
  const changes = req.body;

  try {
    const saleId = parseInt(id, 10);
    if (isNaN(saleId)) {
      return res.status(400).json({ message: 'Invalid sale ID' });
    }

    const updatedSale = service.update(saleId, changes);
    res.status(200).json(updatedSale);
  } catch (error) {
    if (error.message === 'Sale not found') {
      res.status(404).json({ message: error.message });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
});

// Eliminar una venta
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  try {
    const saleId = parseInt(id, 10);
    if (isNaN(saleId)) {
      return res.status(400).json({ message: 'Invalid sale ID' });
    }

    const result = service.delete(saleId);
    res.status(200).json(result);
  } catch (error) {
    if (error.message === 'Sale not found') {
      res.status(404).json({ message: error.message });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
});

module.exports = router;
