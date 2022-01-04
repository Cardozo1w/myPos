module.exports = (sequelize, type) => {
  return sequelize.define("quote", {
    folio: {
      primaryKey: true,
      autoIncrement: true,
      type: type.INTEGER,
    },
    idCliente: type.STRING,
    fecha: type.DATE,
    total: type.FLOAT,
  });
};
