const Sequelize = require("sequelize");

const productModel = require("./models/products");
const customerModel = require("./models/customers");
const cotizacionModel = require("./models/cotizaciones");

const sequelize = new Sequelize("ferreteriaruiz", "root", "root", {
  host: "localhost",
  dialect: "mysql",
  define: {
    timestamps: false,
  },
});

const Product = productModel(sequelize, Sequelize);
const Customer = customerModel(sequelize, Sequelize);
const Cotizacion = cotizacionModel(sequelize, Sequelize);

sequelize
  .sync({ force: false })
  .then(() => console.log("Tablas Sincronizadas"));

module.exports = {
  Product,
  Customer,
  Cotizacion,
  sequelize
};
