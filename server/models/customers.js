module.exports = (sequelize, type) => {
  return sequelize.define("customer", {
    idCliente: {
      type: type.STRING,
      primaryKey: true,
    },
    nombre: type.STRING,
    correo: type.STRING,
    calle: type.STRING,
    nuext: type.STRING,
    colonia: type.STRING,
    codigoPostal: type.INTEGER,
    localidad: type.STRING,
    municipio: type.STRING,
    estado: type.STRING,
    pais: type.STRING,
  });
};
