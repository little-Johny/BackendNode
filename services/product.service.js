const { faker } = require('@faker-js/faker');
// Importación de Boom
const boom = require('@hapi/boom');

// Uso de servicio de categorías
const CategoriesService = require('./categories.service');

class productsService {
  constructor() {
    this.products = [
      {
        id: 'ssd257ddee-46ea-4722-adb6-a9c93bd6777fh1', // ID fijo
        name: 'Laptop',
        price: 999,
        image: 'https://example.com/laptop.jpg',
        categoryId: 6,
        category: 'electronics',
        isBlock: false,
      },
      {
        id: '88a69a51-debd-4317-bcd2-9e3a652faf85', // ID fijo
        name: 'Café Orgánico',
        price: 15,
        image: 'https://example.com/coffee.jpg',
        categoryId: 7,
        category: 'groceries',
        isBlock: false,
      },
      {
        id: 'd8aa60a1-b608-4142-8abe-07f5bbec59f6', // ID fijo
        name: 'Smartphone',
        price: 499,
        image: 'https://example.com/smartphone.jpg',
        categoryId: 6,
        category: 'electronics',
        isBlock: false,
      },
    ];
    this.categoriesService = new CategoriesService();
    this.generate();
  }

  // Método para generar productos y agregarlos al array inicial
  async generate() {
    const limit = 20;
    const categories = this.categoriesService.find();
    for (let i = 0; i < limit; i++) {
      const category = faker.helpers.arrayElement(categories);
      this.products.push({
        id: faker.string.uuid(),
        name: faker.commerce.productName(),
        price: parseInt(faker.commerce.price(), 10),
        image: faker.image.url(),
        categoryId: category.id,
        category: category.name,
        isBlock: faker.datatype.boolean(),
      });
    }
  }

  // Crear un producto nuevo
  async create(data) {
    // Validar que la categoría exista
    const category = this.categoriesService
      .find()
      .find((item) => item.name.toLowerCase() === data.category.toLowerCase());

    if (!category) {
      throw boom.badRequest('Invalid category');
    }

    // Crear el producto con datos válidos
    const newProduct = {
      id: faker.string.uuid(),
      ...data,
      categoryId: category.id,
      category: category.name,
      isBlock: faker.datatype.boolean(),
    };

    this.products.push(newProduct);
    return newProduct;
  }

  // Obtener todos los productos
  async find() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.products);
      }, 3000);
    });
  }

  // Buscar un producto por su ID
  async findOne(id) {
    const product = this.products.find((item) => item.id === id);
    if (!product) {
      throw boom.notFound('Product not found');
    }

    if (product.isBlock) {
      throw boom.conflict('Product is blocked');
    }

    return product;
  }

  // Buscar productos por categoría
  async findByCategory(categoryId) {
    const filteredProducts = this.products.filter(
      (item) => item.categoryId === categoryId,
    );

    if (filteredProducts.length === 0) {
      throw boom.notFound('No products found for the given category');
    }

    return filteredProducts;
  }

  // Actualizar un producto existente
  async update(id, changes) {
    const index = this.products.findIndex((item) => item.id === id);
    if (index === -1) {
      throw boom.notFound('Product not found');
    }

    const product = this.products[index];

    // Validar la categoría si se proporciona un cambio
    if (changes.category) {
      const category = this.categoriesService
        .find()
        .find(
          (item) => item.name.toLowerCase() === changes.category.toLowerCase(),
        );

      if (!category) {
        throw boom.badRequest('Category not found');
      }

      changes.categoryId = category.id;
      changes.category = category.name;
    }

    this.products[index] = {
      ...product,
      ...changes,
    };

    return this.products[index];
  }

  // Eliminar un producto por ID
  async delete(id) {
    const index = this.products.findIndex((item) => item.id === id);

    if (index === -1) {
      throw boom.notFound('Product not found');
    }

    this.products.splice(index, 1);
    return { message: true, id };
  }
}

module.exports = productsService;
