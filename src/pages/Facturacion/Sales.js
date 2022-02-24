import React, { useState, useEffect, useContext } from "react";
import Customers from "./Customers";
import PageHeader from "../../components/PageHeader";
import { Paper, makeStyles, Toolbar, InputAdornment } from "@material-ui/core";
import Controls from "../../components/controls/Controls";
import { Search } from "@material-ui/icons";
import Popup from "../../components/Popup";
import axios from "axios";
import SaleTable from "./saleTable";
import Products from "./Products";
import { DataContext } from "../../context/DataContext";
import DescriptionIcon from '@material-ui/icons/Description';

const useStyles = makeStyles((theme) => ({
  pageContent: {
    margin: 10,
    padding: 20,
  },
  searchInput: {
    width: "70%",
  },
  select: {
    width: "30%",
    marginLeft: 20,
  },
  newButton: {
    position: "absolute",
    right: "10px",
  },
}));

export default function Facturacion() {
  const { generarToken, crearFactura } = useContext(DataContext);

  const [openPopup, setOpenPopup] = useState(false);
  const [openProducts, setOpenProducts] = useState(false);
  const [folio, setFolio] = useState(null);
  const [abrirCotizacion, setAbrirCotizacion] = useState(false);
  const [productosVenta, setProductosVenta] = useState([]);
  const [cliente, setCliente] = useState({
    nombre: "",
    idCliente: "",
  });
  const [total, setTotal] = useState(0);

  const classes = useStyles();

  useEffect(() => {
    let tot = 0;
    productosVenta.map((item) => {
      tot = tot + parseFloat(item.cantidad) * item.precio;
    });

    setTotal(tot);
  }, [productosVenta]);

  let today = new Date();
  const dd = today.getDate();
  const mm = today.getMonth() + 1; //January is 0!
  const yyyy = today.getFullYear();

  today = mm + "/" + dd + "/" + yyyy;

  const generarCotizacion = async () => {
    //TO-DO
    //Generar Token
    const token = await generarToken();
    crearFactura(cliente);

    //Generar CFDI
  };

  return (
    <>
      <PageHeader
        title="Facturacion"
        subTitle="Generar Factura"
        icon={<DescriptionIcon fontSize="large" />}
      />
      <Paper className={classes.pageContent}>
        <Toolbar style={{ marginBottom: 30 }}>
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
        {/* </Paper>

      <Paper className={classes.pageContent}> */}
        <Toolbar>
          <Controls.Input
            label="Uso CFDI"
            value="G03"
            variant="outlined"
            onClick={() => console.log("Buscando...")}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  {/* <Search /> */}
                </InputAdornment>
              ),
            }}
          />
          <div style={{ marginLeft: 20 }}>
            <Controls.Select
              name="metodoPago"
              value="PUE"
              //onChange={handleInputChange}
              options={[
                { id: "PUE", title: "PUE" },
                { id: "2", title: "PPD" },
              ]}
            />
          </div>
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
          disabled={productosVenta.length === 0}
          onClick={() => {
            generarCotizacion();
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
        {/* <p>
          Subtotal <span>$ {(total / 1.16).toFixed(2)}</span>
        </p>
        <p>
          IVA <span>$ {(total - total / 1.16).toFixed(2)}</span>
        </p> */}
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
        title="Buscar Producto"
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
      ></Popup>
    </>
  );
}
