const User = require('./user');

class Client extends User {
  constructor(data) {
    super(data);
    this.address = data.address;
  }

  async save() {
    // save user data
    const user = await super.save();

    // save client data
    const [rows] = await db.execute(
      'insert into client (address, UID) values (?, ?);',
      [this.address, user.id]
    );
    this.id = rows.insertId;
    return this;
  }

  static async findById(id) {
    // return client by id
    const [client] = await db.execute(`SELECT * FROM client WHERE UID = ${id}`);
    const [user] = await User.findById(id);
    return { ...client, ...user };
  }
}

module.exports = Client;
