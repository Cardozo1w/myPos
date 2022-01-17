import React, { useState, useEffect } from "react";
import Customers from "./Customers";
import { PDFViewer } from "@react-pdf/renderer";
import PageHeader from "../../components/PageHeader";
import PeopleOutlineTwoToneIcon from "@material-ui/icons/PeopleOutlineTwoTone";
import receipt from "receipt";
import { Paper, makeStyles, Toolbar, InputAdornment } from "@material-ui/core";
import Controls from "../../components/controls/Controls";
import { Search } from "@material-ui/icons";
import Popup from "../../components/Popup";
import axios from "axios";
import SaleTable from "./saleTable";
import Products from "./Products";
import Cotizacionpdf from "../../components/pdf/cotizacion";

const useStyles = makeStyles((theme) => ({
  pageContent: {
    margin: theme.spacing(5),
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


  // useEffect(() => {
  //   receipt.config.currency = "$";
  //   receipt.config.width = 40;
  //   receipt.config.ruler = "-";

  //   const output = receipt.create([
  //     {
  //       type: "text",
  //       value: [
  //         "MY AWESOME STORE",
  //         "123 STORE ST",
  //         "store@store.com",
  //         "www.store.com",
  //       ],
  //       align: "center",
  //     },
  //     { type: "empty" },
  //     {
  //       type: "properties",
  //       lines: [
  //         { name: "Order Number", value: "XXXXXXXXXXXX" },
  //         { name: "Date", value: "XX/XX/XXXX XX:XX" },
  //       ],
  //     },
  //     {
  //       type: "table",
  //       lines: [
  //         { item: "Product 1", qty: 1, cost: 1000 },
  //         {
  //           item: "Product 2 with a really long name",
  //           qty: 1,
  //           cost: 17500,
  //           discount: { type: "absolute", value: 1000 },
  //         },
  //         { item: "Another product wth quite a name", qty: 2, cost: 900 },
  //         {
  //           item: "Product 4",
  //           qty: 1,
  //           cost: 80,
  //           discount: { type: "percentage", value: 0.15 },
  //         },
  //         { item: "This length is ridiculously lengthy", qty: 14, cost: 8516 },
  //         { item: "Product 6", qty: 3, cost: 500 },
  //         {
  //           item: "Product 7",
  //           qty: 3,
  //           cost: 500
  //         },
  //       ],
  //     },
  //     { type: "empty" },
  //     {
  //       type: "text",
  //       value: "Some extra information to add to the footer of this docket.",
  //       align: "center",
  //     },
  //     { type: "empty" },
  //     {
  //       type: "properties",
  //       lines: [
  //         { name: "GST (10.00%)", value: "AUD XX.XX" },
  //         { name: "Total amount (excl. GST)", value: "AUD XX.XX" },
  //         { name: "Total amount (incl. GST)", value: "AUD XX.XX" },
  //       ],
  //     },
  //     { type: "empty" },
  //     {
  //       type: "properties",
  //       lines: [
  //         { name: "Amount Received", value: "AUD XX.XX" },
  //         { name: "Amount Returned", value: "AUD XX.XX" },
  //       ],
  //     },
  //     { type: "empty" },
  //     {
  //       type: "text",
  //       value:
  //         "Final bits of text at the very base of a docket. This text wraps around as well!",
  //       align: "center",
  //       padding: 5,
  //     },
  //   ]);

  //   console.log(output);
  // }, []);

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
    const { data } = await axios.post(
      "http://localhost:4000/api/cotizacion/insertar",
      {
        idCliente: cliente.idCliente,
        fecha: today,
        total: total,

        productos: productosVenta,
      }
    );

    setFolio(data.folio);
    setAbrirCotizacion(true);
  };

  return (
    <>
      <PageHeader
        title="Cotizaciones"
        subTitle="Generar Cotizacion"
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
      >
        {cliente ? (
          <>
            <PDFViewer style={{ width: "800px", height: "90vh" }}>
              <Cotizacionpdf
                customer={cliente}
                productos={productosVenta}
                total={total}
                folio={folio}
                setFolio={setFolio}
                setProductosVenta={setProductosVenta}
                setCliente={setCliente}
                setTotal={setTotal}
              />
            </PDFViewer>
          </>
        ) : null}
      </Popup>
    </>
  );
}
