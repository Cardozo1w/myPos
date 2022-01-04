module.exports = (sequelize, type) => {
    return sequelize.define('product', {
        idProducto: {
            type: type.INTEGER,
            primaryKey: true,
        },
        descripcion: type.STRING,
        precio: type.FLOAT,
        unidad: type.STRING,
        claveUnidad: type.STRING,
        claveSat: type.STRING,
        
    })
}