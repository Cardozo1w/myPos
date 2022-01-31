import React from "react";
import { withStyles } from "@material-ui/core";

const style = {
  sideMenu: {
    display: "flex",
    flexDirection: "column",
    position: "absolute",
    left: "0px",
    width: "320px",
    height: "140vh",
    backgroundColor: "#253053",
  },
};

const SideMenu = (props) => {
  const { classes, setActive } = props;
  return (
    <div className={classes.sideMenu}>
      <div className="mt">
        <MenuItem title="Nota de Venta" setActive={setActive} active="sales" />
        <MenuItem title="Cotizaciones" setActive={setActive} active="cotizaciones" />
        <MenuItem title="Listado Ventas" setActive={setActive} active="listadoventas" />
        <MenuItem title="Listado Cotizaciones" setActive={setActive} active="listadocotizaciones" />
        <MenuItem title="Clientes" setActive={setActive} active="customers" />
        <MenuItem title="Productos" setActive={setActive} active="products" />
      </div>
    </div>
  );
};

export default withStyles(style)(SideMenu);

const MenuItem = (props) => {
  const { title, setActive, active } = props;
  return (
    <div className="menu-item" onClick={() => setActive(active)}>
      {title}
    </div>
  );
};
