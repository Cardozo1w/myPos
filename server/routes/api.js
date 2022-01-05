const router = require("express").Router();
const { Product, Customer, Cotizacion, sequelize } = require("../db");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

//OBTIENE TODOS LOS REGISTROS CON PAGINACION
router.get("/", async (req, res) => {
  try {
    const products = await Product.findAll({
      limit: 50,
      offset: 0,
      order: [["idProducto", "DESC"]],
    });
    res.json(products);
  } catch (error) {
    res.json(error);
  }
});

//BUSCA REGISTROS
router.post("/like/", async (req, res) => {
  target = req.body.target;
  try {
    const products = await Product.findAll({
      limit: 50,
      offset: 0,
      order: [["idProducto", "DESC"]],
      where: {
        descripcion: {
          [Op.like]: `%${target}%`,
        },
      },
    });
    res.json(products);
  } catch (error) {
    res.json(error);
  }
});

//CREA UN NUEVO REGISTRO
router.post("/", async (req, res) => {
  try {
    const products = await Product.create(req.body);

    res.json(products);
  } catch (error) {
    res.json(error);
  }
});

//MODIFICA UN REGISTRO EXISTENTE
router.put("/:idProducto", async (req, res) => {
  try {
    await Product.update(req.body, {
      where: {
        idProducto: req.params.idProducto,
      },
    });
    res.json({ succes: `Registro ${req.params.id} modificado exitosamente` });
  } catch (error) {
    res.json({ error: "Error al actualizar el producto" });
  }
});

//ELIMINA UN PRODUCTO
router.delete("/:idProducto", async (req, res) => {
  try {
    await Product.destroy({
      where: {
        idProducto: req.params.idProducto,
      },
    });

    res.json({ success: "Exito al eliminar el registro" });
  } catch (error) {
    res.json(error);
  }
});

//OBTIENE TODOS LOS CLIENTES CON PAGINACION
router.get("/clientes", async (req, res) => {
  try {
    const clientes = await Customer.findAll({
      limit: 50,
      offset: 0,
    });
    res.json(clientes);
  } catch (error) {
    res.json(error);
  }
});

//BUSCA CLIENTE
router.post("/like/clientes", async (req, res) => {
  target = req.body.target;
  try {
    const clientes = await Customer.findAll({
      limit: 50,
      offset: 0,
      where: {
        nombre: {
          [Op.like]: `%${target}%`,
        },
      },
    });
    res.json(clientes);
  } catch (error) {
    res.json(error);
  }
});

//CREA UN NUEVO CLIENTE
router.post("/nuevocliente", async (req, res) => {
  try {
    const clientes = await Customer.create(req.body);

    res.json(clientes);
  } catch (error) {
    res.json(error);
  }
});

//MODIFICA UN CLIENTE EXISTENTE
router.put("/clientes/:idCliente", async (req, res) => {
  try {
    const cliente = await Customer.update(req.body, {
      where: {
        idCliente: req.params.idCliente,
      },
    });
    res.json({mensaje: `Registro ${req.params.idCliente} modificado exitosmente`});
  } catch (error) {
    res.json({ error: "Error al actualizar el cliente" });
  }
});

//ELIMINA UN PRODUCTO
router.delete("/clientes/:idCliente", async (req, res) => {
  try {
    await Customer.destroy({
      where: {
        idCliente: req.params.idCliente,
      },
    });

    res.json({ success: "Exito al eliminar el cliente" });
  } catch (error) {
    res.json(error);
  }
});

//OBTIENE EL ULTIMO FOLIO DE LA COTIZACION
router.get("/cotizacion/ultimofolio", async (req, res) => {
  try {
    const folio = await Cotizacion.findAll({
      limit: 1,
      order: [["folio", "DESC"]],
    });

    res.json(folio);
  } catch (error) {
    console.log(error);
  }
});

//OBTIENE TODAS LAS COTIZACIONES
router.get("/cotizacion", async (req, res) => {
  try {
    const cotizacion = await Cotizacion.findAll();
    res.json(cotizacion);
  } catch (error) {
    console.log(error);
  }
});

//INSERTA UNA NUEVA COTIZACION
router.post("/cotizacion/insertar", async (req, res) => {
  const { productos } = req.body;

  try {
    const cotizacion = await Cotizacion.create(req.body);
    const folio = cotizacion.folio;

    productos.map(async (producto) => {
      await sequelize.query(
        `insert into detalleCotizacion(folioCotizacion, idProducto, cantidad, precio ) values (${folio}, ${producto.idProducto}, ${producto.cantidad}, ${producto.precio})`
      );
    });

    res.json({ mensaje: "Cotizacion generada exitosamente", folio });
  } catch (error) {
    console.log(error);
  }
});

//OBTIENE UNA COTIZACION POR FOLIO
router.get('/cotizacion/:folio', async (req, res) => {
   const cliente = await sequelize.query(
        `select * from quotes INNER JOIN Customers on quotes.idCliente = Customers.idCliente where quotes.folio = ${req.params.folio}`
      );

      const productos = await sequelize.query(
        `SELECT * from detalleCotizacion INNER JOIN products on detalleCotizacion.idProducto =  products.idProducto where detalleCotizacion.folioCotizacion = ${req.params.folio};
`
      );

      res.json({cliente, productos});

})

module.exports = router;
