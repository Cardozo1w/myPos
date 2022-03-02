import React from "react";
import { withStyles } from "@material-ui/core";
import EqualizerIcon from "@material-ui/icons/Equalizer";
import DescriptionIcon from "@material-ui/icons/Description";
import ShoppingCartOutlinedIcon from "@material-ui/icons/ShoppingCartOutlined";
import ReceiptOutlinedIcon from "@material-ui/icons/ReceiptOutlined";
import FormatListBulletedOutlinedIcon from "@material-ui/icons/FormatListBulletedOutlined";
import PeopleOutlineTwoToneIcon from "@material-ui/icons/PeopleOutlineTwoTone";
import AssignmentOutlinedIcon from "@material-ui/icons/AssignmentOutlined";

const style = {
  sideMenu: {
    display: "flex",
    flexDirection: "column",
    position: "absolute",
    left: "0px",
    width: "320px",
    height: "140vh",
    backgroundColor: "#253053",
    position: 'fixed'
  },
};

const SideMenu = (props) => {
  const { classes, now, setActive } = props;
  return (
    <div className={classes.sideMenu}>
      <div style={{ color: "#fff", marginTop: 30, textAlign: "center" }}>
        <h1 style={{ margin: "5px", fontStyle: "italic" }}>
          ASIT<span style={{ fontSize: 15, fontStyle: "normal" }}>&reg;</span>
        </h1>
        <p style={{ margin: 0 }}>by Oscar Cardoso</p>
      </div>
      <div className="mt">
        <MenuItem
          title="Dashboard"
          setActive={setActive}
          active="dashboard"
          icon={<EqualizerIcon />}
        />
        <MenuItem
          title="Facturacion"
          setActive={setActive}
          active="facturacion"
          icon={<DescriptionIcon />}
        />
        <MenuItem
          title="Nota de Venta"
          setActive={setActive}
          active="sales"
          icon={<ShoppingCartOutlinedIcon />}
        />
        <MenuItem
          title="Cotizaciones"
          setActive={setActive}
          active="cotizaciones"
          icon={<ReceiptOutlinedIcon />}
        />
        <MenuItem
          title="Listado Facturas"
          setActive={setActive}
          active="listadofacturas"
          icon={<FormatListBulletedOutlinedIcon />}
        />
        <MenuItem
          title="Listado Ventas"
          setActive={setActive}
          active="listadoventas"
          icon={<FormatListBulletedOutlinedIcon />}
        />
        <MenuItem
          title="List. Cotizaciones"
          setActive={setActive}
          active="listadocotizaciones"
          icon={<FormatListBulletedOutlinedIcon />}
        />
        <MenuItem
          title="Clientes"
          setActive={setActive}
          active="customers"
          icon={<PeopleOutlineTwoToneIcon />}
        />
        <MenuItem
          title="Productos"
          setActive={setActive}
          active="products"
          icon={<AssignmentOutlinedIcon />}
        />
      </div>
    </div>
  );
};

export default withStyles(style)(SideMenu);

const MenuItem = (props) => {
  const onClick = (e) => {
    setActive(active);
    const menu = document.querySelectorAll(".menu-item");
    for (let i = 0; i < menu.length; i++) {
      menu[i].classList.remove("background");
      menu[i].style.backgroundColor = "";
    }
    //e.target.classList.add("background");
    e.target.style.backgroundColor = "rgba(255, 255, 255, 0.178)";
  };
  const { title, icon, setActive, active } = props;
  return (
    <div className="menu-item background" onClick={(e) => onClick(e)}>
      {icon}
      {title}
    </div>
  );
};
