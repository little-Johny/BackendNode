const { faker } = require('@faker-js/faker');

class UsersService {
  constructor() {
    this.users = [
      { id: 1, name: 'Johny', tel: '3143094657' },
      { id: 2, name: 'Tony', tel: '3105663226' },
      { id: 3, name: 'Goku', tel: '3206773338' },
    ];
    this.generate();
  }

  generate() {
    const limit = 5;

    //Generate fake users
    for (let i = 0; i < limit; i++) {
      this.users.push({
        id: this.users[this.users.length - 1].id + 1,
        name: faker.person.firstName(),
        phone: faker.phone.number(),
      });
    }
  }

  create(data) {
    // Verificar si hay usuarios existentes
    const lastUserId =
      this.users.length > 0 ? this.users[this.users.length - 1].id : 0;

    // Crear el nuevo usuario
    const newUser = {
      id: lastUserId + 1,
      ...data,
    };

    // Agregar el nuevo usuario al arreglo
    this.users.push(newUser);

    return newUser;
  }

  find() {
    return this.users;
  }

  findOne(id) {
    return this.users.find((item) => item.id === id);
  }

  update(id, changes) {
    const userIndex = this.users.findIndex((user) => user.id === Number(id));

    if (userIndex === -1) {
      throw new Error('User not found');
    }

    const updatedUser = {
      ...this.users[userIndex],
      ...changes,
    };

    this.users[userIndex] = updatedUser;
    return updatedUser;
  }

  delete(id) {
    const index = this.users.findIndex((user) => user.id === Number(id));

    if (index === -1) {
      throw new Error('User not found.');
    }

    this.users.splice(index, 1);

    return { message: true, id };
  }
}

module.exports = UsersService;
