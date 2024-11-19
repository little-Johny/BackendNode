class CategoriesService {
  constructor() {
    this.categories = [
      {
        id: 1,
        name: 'cleaning',
      },
      {
        id: 2,
        name: 'vegetables',
      },
      {
        id: 3,
        name: 'meat',
      },
      {
        id: 4,
        name: 'snaks',
      },
      {
        id: 5,
        name: 'drinks',
      },
      {
        id: 6,
        name: 'electronics',
      },
      {
        id: 7,
        name: 'groceries',
      },
    ];
  }

  create(data) {
    const lastCategoryId = this.categories[this.categories.length - 1].id;
    const newCategory = {
      id: lastCategoryId + 1,
      ...data,
    };

    this.categories.push(newCategory);

    return newCategory;
  }

  find() {
    return this.categories;
  }

  findOne(id) {
    return this.categories.find((item) => item.id === id);
  }

  update(id, changes) {
    const index = this.categories.findIndex((item) => item.id === Number(id));

    if (index === -1) {
      throw new Error('Category not found.');
    }

    const category = this.categories[index];

    this.categories[index] = {
      ...category,
      ...changes,
    };

    return this.categories[index];
  }

  delete(id) {
    const index = this.categories.findIndex((item) => item.id === Number(id));

    if (index === -1) {
      throw new Error('Category not found.');
    }

    this.categories.splice(index, 1);

    return { message: true, id };
  }
}

module.exports = CategoriesService;
