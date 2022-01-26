import React, { useState } from "react";
import Customers from "./Customers";

import PageHeader from "../../components/PageHeader";
import PeopleOutlineTwoToneIcon from "@material-ui/icons/PeopleOutlineTwoTone";
import {
  Paper,
  makeStyles,
  Toolbar,
  InputAdornment,
} from "@material-ui/core";
//import * as employeeService from "../../services/employeeService";
import Controls from "../../components/controls/Controls";
import { Search } from "@material-ui/icons";
import Popup from "../../components/Popup";
import { useEffect } from "react";
import SaleTable from "./saleTable";
import Products from "./Products";
import Cotizacionpdf from "../../components/pdf/cotizacion";

const useStyles = makeStyles((theme) => ({
  pageContent: {
    margin: theme.spacing(5),
    padding: theme.spacing(3),
  },
  searchInput: {
    width: "80%",
  },
  newButton: {
    position: "absolute",
    right: "10px",
  },
}));

export default function Sales() {
  const [openPopup, setOpenPopup] = useState(false);
  const [openProducts, setOpenProducts] = useState(false);
  const [abrirCotizacion, setAbrirCotizacion] = useState(false);
  const [cliente, setCliente] = useState({
    nombre: "",
    idCliente: "",
  });
  const classes = useStyles();
  const [productosVenta, setProductosVenta] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    let tot = 0;
    productosVenta.map((item) => {
      console.log(item);
      tot = tot + parseFloat(item.cantidad) * item.precio;
      console.log(parseFloat(item.cantidad));
      console.log(tot);
    });

    setTotal(tot);
  }, [productosVenta]);

  return (
    <>
      <PageHeader
        title="Nota de Venta"
        subTitle="Generar nota de venta"
        icon={<PeopleOutlineTwoToneIcon fontSize="large" />}
      />
      <Paper className={classes.pageContent}>
        <Toolbar>
          <Controls.Input
            label="Cliente"
            className={classes.searchInput}
            disabled={true}
            value={
              cliente.nombre !== ""
                ? `RFC: ${cliente.idCliente}, ${cliente.nombre} `
                : null
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  {/* <Search /> */}
                </InputAdornment>
              ),
            }}
          />

          <Controls.Button
            style={{ height: "56px", width: "200px" }}
            text="Buscar"
            variant="outlined"
            startIcon={<Search />}
            className={classes.newButton}
            onClick={() => {
              {
                !openPopup ? setOpenPopup(true) : setOpenPopup(false);
              }
            }}
          />
        </Toolbar>
      </Paper>

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
          text="Generar Cotizacion"
          variant="outlined"
          className=""
          onClick={() => {
            setAbrirCotizacion(true);
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
          Subtotal <span>$ {(total / 1.16).toFixed(2)}</span>
        </p>
        <p>
          IVA <span>$ {(total - total / 1.16).toFixed(2)}</span>
        </p>
        <p>
          Total <span>$ {total.toFixed(2)}</span>
        </p>
      </Paper>

      <Popup
        title="Buscar Cliente"
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <Customers setOpenPopup={setOpenPopup} setCliente={setCliente} />
      </Popup>
      <Popup
        title="Buscar Cliente"
        openPopup={openProducts}
        setOpenPopup={setOpenProducts}
      >
        <Products
          setOpenProducts={setOpenProducts}
          setProductosVenta={setProductosVenta}
          productosVenta={productosVenta}
        />
      </Popup>

      <Popup
        openPopup={abrirCotizacion}
        setOpenPopup={setAbrirCotizacion}
        title="Cotizacion"
      >
        <Cotizacionpdf
          customer={cliente}
          productos={productosVenta}
          total={total}
        />
      </Popup>
    </>
  );
}
