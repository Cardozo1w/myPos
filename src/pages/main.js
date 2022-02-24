import React, { Fragment, useState } from "react";
import Header from "../components/Header";

import Customers from "../pages/Customers/Customers";
import Products from "../pages/Products/Products";
import Sales from "../pages/Ventas/Sales";
import Cotizaciones from "../pages/Cotizaciones/Sales";
import ListadoCotizaciones from "./ListadoCotizaciones/ListadoCotizaciones";
import ListadoVentas from "./ListadoVentas/ListadoVentas";
import Facturacion from "./Facturacion/Sales";

import SideMenu from "../components/SideMenu";
import { makeStyles, CssBaseline } from "@material-ui/core";
import Dashboard from "./dashboard";

const useStyles = makeStyles({
  appMain: {
    paddingLeft: "320px",
    width: "100%",
  },
});

const Main = () => {
  const classes = useStyles();
  const [active, setActive] = useState("dashboard");

  return (
    <Fragment>
      <SideMenu setActive={setActive} now={active}/>
      <div className={classes.appMain}>
        {/* <Header /> */}
        {active === "dashboard" && <Dashboard />}
        {active === "facturacion" && <Facturacion />}
        {active === "sales" && <Sales />}
        {active === "cotizaciones" && <Cotizaciones />}
        {active === "listadoventas" && <ListadoVentas />}
        {active === "listadocotizaciones" && <ListadoCotizaciones />}
        {active === "products" && <Products />}
        {active === "customers" && <Customers />}
      </div>
      <CssBaseline />
    </Fragment>
  );
};

export default Main;
