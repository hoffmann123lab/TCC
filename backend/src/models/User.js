const ADMIN_EMAILS = [
  'rafaelhoffmann@gmail.com',
  'samuelcunha@gmail.com'
];

let users = [
  {
    id: 1,
    name: 'Rafael Hoffmann',
    email: 'rafaelhoffmann@gmail.com',
    password: 'Hoff123',
    role: 'admin'
  },
  {
    id: 2,
    name: 'Samuel Cunha',
    email: 'samuelcunha@gmail.com',
    password: 'Cunha123',
    role: 'admin'
  }
];

let nextId = 3;

class User {
  static findAll() {
    return users.map(({ password, ...user }) => user);
  }

  static findById(id) {
    const user = users.find((u) => u.id === Number(id));
    if (!user) return null;
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  static create({ name, email, password }) {
    const userExists = users.find((u) => u.email === email);
    if (userExists) throw new Error('E-mail já cadastrado.');

    const role = ADMIN_EMAILS.includes(email.toLowerCase()) ? 'admin' : 'user';

    const newUser = { id: nextId++, name, email, password, role };
    users.push(newUser);

    const { password: _, ...createdUser } = newUser;
    return createdUser;
  }

  static login({ email, password }) {
    const user = users.find((u) => u.email === email && u.password === password);
    if (!user) throw new Error('E-mail ou senha incorretos.');

    const { password: _, ...authenticatedUser } = user;
    return authenticatedUser;
  }

  static update(id, { name, email }) {
    const userIndex = users.findIndex((u) => u.id === Number(id));
    if (userIndex === -1) throw new Error('Usuário não encontrado.');

    if (name) users[userIndex].name = name;
    if (email) users[userIndex].email = email;

    const { password: _, ...updatedUser } = users[userIndex];
    return updatedUser;
  }

  static delete(id) {
    const userIndex = users.findIndex((u) => u.id === Number(id));
    if (userIndex === -1) throw new Error('Usuário não encontrado.');

    users.splice(userIndex, 1);
    return true;
  }
}

module.exports = User;