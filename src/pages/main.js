import React, { Fragment, useState } from "react";
import Header from "../components/Header";
import PageHeader from "../components/PageHeader";

import Customers from "../pages/Customers/Customers";
import Products from "../pages/Products/Products";
import Sales from "../pages/Sales/Sales";
import Cotizaciones from "../pages/Cotizaciones/Sales";
import ListadoCotizaciones from "./ListadoCotizaciones/ListadoCotizaciones";

import SideMenu from "../components/SideMenu";
import {
  makeStyles,
  CssBaseline,
  createMuiTheme,
  ThemeProvider,
} from "@material-ui/core";

const useStyles = makeStyles({
  appMain: {
    paddingLeft: "320px",
    width: "100%",
  },
});

const Main = () => {
  const classes = useStyles();
  const [active, setActive] = useState("cotizaciones");

  return (
    <Fragment>
      <SideMenu setActive={setActive} />
      <div className={classes.appMain}>
        <Header />
        {active === "sales" && <Sales />}
        {active === "cotizaciones" && <Cotizaciones />}
        {active === "listadocotizaciones" && <ListadoCotizaciones />}
        {active === "products" && <Products />}
        {active === "customers" && <Customers />}
      </div>
      <CssBaseline />
    </Fragment>
  );
};

export default Main;
