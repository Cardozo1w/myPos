import React, { useState, useEffect } from "react";
import PageHeader from "../../components/PageHeader";
import ShoppingCartOutlinedIcon from "@material-ui/icons/ShoppingCartOutlined";
import { Paper, makeStyles } from "@material-ui/core";
import Controls from "../../components/controls/Controls";
import { Search } from "@material-ui/icons";
import Popup from "../../components/Popup";
import axios from "axios";
import SaleTable from "./saleTable";
import Products from "./Products";
const ipcRenderer = window.ipcRenderer;

const useStyles = makeStyles((theme) => ({
  pageContent: {
    margin: 20,
    padding: theme.spacing(3),
  },
  searchInput: {
    width: "70%",
  },
  newButton: {
    position: "absolute",
    right: "10px",
  },
}));

export default function Sales() {
  const [openProducts, setOpenProducts] = useState(false);

  const [productosVenta, setProductosVenta] = useState([]);

  const [total, setTotal] = useState(0);

  const classes = useStyles();

  useEffect(() => {
    let tot = 0;
    productosVenta.map((item) => {
      tot = tot + parseFloat(item.cantidad) * item.precio;
    });

    setTotal(tot);
  }, [productosVenta]);

  const meses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  // Creamos array con los días de la semana
  const dias_semana = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];
  // Creamos el objeto fecha instanciándolo con la clase Date
  const fecha = new Date();

  const dd = fecha.getDate();
  const mm = fecha.getMonth() + 1; //January is 0!
  const yyyy = fecha.getFullYear();

  const today = mm + "/" + dd + "/" + yyyy;

  // Construimos el formato de salida
  const hoy =
    dias_semana[fecha.getDay()] +
    ", " +
    fecha.getDate() +
    " de " +
    meses[fecha.getMonth()] +
    " de " +
    fecha.getUTCFullYear();

  const printData = (args) => {
    console.log("Intentando imprimir...");
    ipcRenderer.send("print", JSON.stringify(args));
  };

  const generarVenta = async () => {
    try {
      const ventaNueva = await axios.post(
        "http://localhost:4000/api/venta/insertar",
        {
          fecha: today,
          total: total,
          productos: productosVenta,
        }
      );
      let productosNota = [];
      let arrayRandom = [];
      productosVenta.map((item) => {
        arrayRandom = [];
        arrayRandom.push(`(${item.idProducto}) ${item.descripcion}`);
        arrayRandom.push(parseFloat(item.cantidad).toFixed(2));
        arrayRandom.push(parseFloat(item.precio).toFixed(2));
        arrayRandom.push(
          (parseFloat(item.cantidad) * parseFloat(item.precio)).toFixed(2)
        );
        productosNota.push(arrayRandom);
        arrayRandom = [];
      });

      //printData({ folio: ventaNueva.data.folio, productosNota, hoy, total });
      setProductosVenta([]);
      productosNota = [];
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <PageHeader
        title="Nota de Venta"
        subTitle="Generar Nota de Venta"
        icon={<ShoppingCartOutlinedIcon fontSize="large" />}
      />

      <Paper className={classes.pageContent}>
        <Controls.Button
          style={{ height: "56px", width: "200px" }}
          text="Agregar Producto"
          variant="outlined"
          startIcon={<Search />}
          className=""
          onClick={() => {
            setOpenProducts(true);
          }}
        />
        <Controls.Button
          style={{ height: "56px", width: "200px" }}
          text="Generar Venta"
          variant="outlined"
          className=""
          disabled={productosVenta.length === 0}
          onClick={() => {
            generarVenta();
          }}
        />
        <div className="overflow">
          <SaleTable
            productosVenta={productosVenta}
            setProductosVenta={setProductosVenta}
          />
        </div>
      </Paper>

      <Paper
        className={classes.pageContent}
        style={{ width: "40%", float: "right", marginTop: 0 }}
      >
        <p>
          Total <span>$ {total.toFixed(2)}</span>
        </p>
      </Paper>

      <Popup
        title="Buscar Producto"
        openPopup={openProducts}
        op
        setOpenPopup={setOpenProducts}
      >
        <Products
          setOpenProducts={setOpenProducts}
          setProductosVenta={setProductosVenta}
          productosVenta={productosVenta}
        />
      </Popup>
    </>
  );
}
