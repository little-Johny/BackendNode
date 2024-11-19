const { faker } = require('@faker-js/faker');
const ProductsService = require('./product.service');
const UsersService = require('./user.service');

class SalesService {
  constructor() {
    this.sales = [];
    this.productsService = new ProductsService();
    this.usersService = new UsersService();
    this.generate(); // Generar ventas de prueba al iniciar
  }

  // Método para calcular el total de una venta
  calculateTotal(saleId) {
    const sale = this.findOne(saleId); // Obtener la venta por ID
    if (!sale) {
      throw new Error('Sale not found');
    }
    const total = sale.saleProducts.reduce((sum, item) => {
      const product = this.productsService.findOne(item.productId); // Obtener detalles del producto
      if (!product) {
        throw new Error(`Product with ID ${item.productId} not found`);
      }
      return sum + product.price * item.quantity; // Calcular el total acumulado
    }, 0);
    return total;
  }

  // Método para generar ventas de prueba
  async generate(limit = 10) {
    const users = this.usersService.find(); // Obtener todos los usuarios
    const products = await this.productsService.find(); // Obtener todos los productos

    for (let i = 0; i < limit; i++) {
      // Seleccionar un cliente aleatorio
      const randomUser = faker.helpers.arrayElement(users);

      // Generar entre 1 y 3 productos por venta
      const saleProducts = [];
      const productCount = faker.number.int({ min: 1, max: 3 });

      for (let j = 0; j < productCount; j++) {
        const randomProduct = faker.helpers.arrayElement(products);

        // Evitar agregar el mismo producto dos veces en la misma venta
        if (!saleProducts.find((item) => item.productId === randomProduct.id)) {
          saleProducts.push({
            productId: randomProduct.id, // Aquí asumimos que productId es un string
            quantity: faker.number.int({ min: 1, max: 5 }), // Cantidad aleatoria
          });
        }
      }

      // Crear la venta
      const newSale = {
        id: this.sales.length + 1, // ID incremental
        clientId: randomUser.id, // ID del cliente
        saleProducts, // Productos de la venta
      };

      this.sales.push(newSale);
    }

    return this.sales;
  }

  // Método para crear una nueva venta
  create(data) {
    const userExists = this.usersService.findOne(data.clientId);
    if (!userExists) {
      throw new Error('Invalid client ID');
    }

    data.saleProducts.forEach((product) => {
      const productId = product.productId.toString(); // Asegúrate de que productId sea una cadena
      const productExists = this.productsService.findOne(productId); // Encuentra el producto con id como cadena
      if (!productExists) {
        throw new Error(`Invalid product ID: ${product.productId}`);
      }
    });

    const newSale = {
      id: this.sales.length + 1,
      ...data,
    };

    this.sales.push(newSale);
    return newSale;
  }

  // Método para buscar todas las ventas
  find() {
    return this.sales;
  }

  // Método para buscar una venta específica por ID
  findOne(id) {
    return this.sales.find((sale) => sale.id === id);
  }

  // Método para actualizar una venta
  update(id, changes) {
    const saleId = Number(id); // Convertir a número
    if (isNaN(saleId)) {
      throw new Error('Invalid ID format');
    }

    const index = this.sales.findIndex((item) => item.id === saleId);
    if (index === -1) {
      throw new Error('Sale not found');
    }

    const sale = this.sales[index];

    if (changes.clientId) {
      const userExists = this.usersService.findOne(changes.clientId);
      if (!userExists) {
        throw new Error('Invalid client ID');
      }
    }

    if (changes.saleProducts) {
      changes.saleProducts.forEach((product) => {
        const productExists = this.productsService.findOne(
          String(product.productId), // Asegurarse de que el productId sea tratado como string
        );
        if (!productExists) {
          throw new Error(`Invalid product ID: ${product.productId}`);
        }
      });
    }

    this.sales[index] = {
      ...sale,
      ...changes,
    };

    return this.sales[index];
  }

  // Método para eliminar una venta
  delete(id) {
    const saleId = Number(id); // Convertir a número
    if (isNaN(saleId)) {
      throw new Error('Invalid ID format');
    }

    const index = this.sales.findIndex((item) => item.id === saleId);
    if (index === -1) {
      throw new Error('Sale not found');
    }
    this.sales.splice(index, 1);
    return { message: true, id: saleId };
  }
}

module.exports = SalesService;
