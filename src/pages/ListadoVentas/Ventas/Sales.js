import React, { useState, useEffect } from "react";
import { Paper, makeStyles  } from "@material-ui/core";

import SaleTable from "./saleTable";


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

export default function Sales({productosVenta}) {

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


  return (
    <>
      <Paper>
        <div className="overflow2">
          <SaleTable
            productosVenta={productosVenta}
          />
        </div>
      </Paper>

      <Paper
        className={classes.pageContent}
        style={{ width: "40%", float: "right", marginTop: 20 }}
      >
        <p>
          Total <span>$ {total.toFixed(2)}</span>
        </p>
      </Paper>
    </>
  );
}
