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
import { FacturaContext } from "../../context/FacturaContext";
import DescriptionIcon from "@material-ui/icons/Description";
import CircularProgress from "@material-ui/core/CircularProgress";
import FormaPagoComponent from "./catalogosSAT/formaPago";
import UsoCFDI from "./catalogosSAT/usoCfdi";

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
  const { generarToken, crearFactura, loading, setLoading } =
    useContext(DataContext);

  const { productosFactura, setProductosFactura } = useContext(FacturaContext);
  const [abrirUsoCFDI, setAbrirUsoCFDI] = useState(false);
  const [abrirFormaPago, setAbrirFormaPago] = useState(false);
  const [openPopup, setOpenPopup] = useState(false);
  const [openProducts, setOpenProducts] = useState(false);
  const [abrirCotizacion, setAbrirCotizacion] = useState(false);
  const [productosVenta, setProductosVenta] = useState([]);
  const [cliente, setCliente] = useState({
    nombre: "",
    idCliente: "",
  });
  const [total, setTotal] = useState(0);
  const [metodoPago, setMetodoPago] = useState("PUE");
  const [formaPago, setFormaPago] = useState({
    id: "01",
    descripcion: "Efectivo",
  });
  const [usoCFDI, setUsoCFDI] = useState({
    id: "G03",
    descripcion: "Gastos en general",
  });

  const classes = useStyles();

  useEffect(() => {
    const llenarArray = () => {
      setProductosVenta(productosFactura);
      setProductosFactura([])
    };

    llenarArray();
  }, []);

  useEffect(() => {
    let tot = 0;
    productosVenta.map((item) => {
      tot = tot + parseFloat(item.cantidad) * item.precio;
    });

    setTotal(tot);

    console.log(productosVenta);
  }, [productosVenta]);

  let today = new Date();
  const dd = today.getDate();
  const mm = today.getMonth() + 1; //January is 0!
  const yyyy = today.getFullYear();

  today = mm + "/" + dd + "/" + yyyy;

  const metodoChange = (e) => {
    setMetodoPago(e.target.value);
  };

  const generarCotizacion = async () => {
    //TO-DO
    setLoading(true);
    const reiniciarFactura = () => {
      window.location.reload();
    };
    //Generar Token
    const token = await generarToken();
    crearFactura(
      cliente,
      productosVenta,
      total,
      token,
      usoCFDI,
      formaPago,
      metodoPago,
      reiniciarFactura
    );

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
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "50%",
            }}
          >
            <Controls.Input
              label="Uso CFDI"
              value={usoCFDI.id}
              variant="outlined"
              onClick={() => setAbrirUsoCFDI(true)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    {/* <Search /> */}
                  </InputAdornment>
                ),
              }}
            />
            <Controls.Input
              label="Forma de pago"
              value={formaPago.id}
              variant="outlined"
              onClick={() => setAbrirFormaPago(true)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    {/* <Search /> */}
                  </InputAdornment>
                ),
              }}
            />

            <Controls.Select
              name="metodoPago"
              //onChange={handleInputChange}
              value={metodoPago}
              options={[
                { id: "PUE", title: "PUE" },
                { id: "PPD", title: "PPD" },
              ]}
              onChange={(e) => metodoChange(e)}
            />
          </div>
        </Toolbar>
      </Paper>

      <Paper className={classes.pageContent}>
        <div style={{ display: "flex" }}>
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
          {loading ? (
            <div
              className="btn-loading"
              style={{
                height: "56px",
                width: "200px",
                color: "#333996",
                border: "1px solid rgba(51, 57, 150, 0.5)",
              }}
            >
              <CircularProgress /> Cargando...
            </div>
          ) : (
            <Controls.Button
              style={{ height: "56px", width: "200px" }}
              text="Generar Factura"
              variant="outlined"
              className=""
              disabled={productosVenta.length === 0}
              onClick={() => {
                generarCotizacion();
              }}
            />
          )}
        </div>

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

      <Popup
        openPopup={abrirUsoCFDI}
        setOpenPopup={setAbrirUsoCFDI}
        title="Uso CFDI"
      >
        <UsoCFDI setUsoCFDI={setUsoCFDI} setAbrirUsoCFDI={setAbrirUsoCFDI} />
      </Popup>
      <Popup
        openPopup={abrirFormaPago}
        setOpenPopup={setAbrirFormaPago}
        title="Forma de Pago"
      >
        <FormaPagoComponent
          setFormaPago={setFormaPago}
          setAbrirFormaPago={setAbrirFormaPago}
        />
      </Popup>
    </>
  );
}
