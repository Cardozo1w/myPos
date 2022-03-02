import React, { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import EqualizerIcon from "@material-ui/icons/Equalizer";
import { Paper, makeStyles, Toolbar, InputAdornment } from "@material-ui/core";
import axios from "axios";

const Dashboard = () => {
  const [ventaDia, setVentaDia] = useState(0);
  const [ventaMes, setVentaMes] = useState(0);
  const [ventaAnio, setVentaAnio] = useState(0);

  useEffect(() => {
    const obtenerData = async () => {
      const { data } = await axios.post("http://localhost:4000/api/totales");
      let ventaDelDia = 0;
      let ventaDelMes = 0;
      let ventaDelAnio = 0;

      if (data.ventaDia["SUM(total)"] !== null) {
       // setVentaDia(data.ventaDia["SUM(total)"]);
        ventaDelDia += data.ventaDia["SUM(total)"]
      }
      if (data.ventaMes["SUM(total)"] !== null) {
       // setVentaMes(data.ventaMes["SUM(total)"]);
       ventaDelMes += data.ventaMes["SUM(total)"]
      }
      if (data.ventaAnio["SUM(total)"] !== null) {
        //setVentaAnio(data.ventaAnio["SUM(total)"]);
        ventaDelAnio += data.ventaAnio["SUM(total)"]
      }
       if (data.ventaDiaFactura["SUM(total)"] !== null) {
       // setVentaDia(data.ventaDia["SUM(total)"]);
        ventaDelDia += data.ventaDiaFactura["SUM(total)"]
      }
      if (data.ventaMesFactura["SUM(total)"] !== null) {
       // setVentaMes(data.ventaMes["SUM(total)"]);
       ventaDelMes += data.ventaMesFactura["SUM(total)"]
      }
      if (data.ventaAnioFactura["SUM(total)"] !== null) {
        //setVentaAnio(data.ventaAnio["SUM(total)"]);
        ventaDelAnio += data.ventaAnioFactura["SUM(total)"]
      }

      setVentaDia(ventaDelDia)
      setVentaMes(ventaDelMes)
      setVentaAnio(ventaDelAnio)
    };

    obtenerData();
  }, []);

  const useStyles = makeStyles((theme) => ({
    pageContent: {
      margin: 10,
      padding: 20,
    },
  }));

  const classes = useStyles();

  return (
    <>
      <PageHeader
        title="Dashboard"
        subTitle="Resumen del sistema"
        icon={<EqualizerIcon fontSize="large" />}
      />

      <div className="contenedor-dash">
        <div className="card-dash">
          <h2>Ventas del dia</h2>
          <p>
            $ <span>{ventaDia.toFixed(2)}</span>
          </p>
        </div>
        <div className="card-dash">
          <h2>Ventas del mes</h2>
          <p>
            $ <span>{ventaMes.toFixed(2)}</span>
          </p>
        </div>
        <div className="card-dash">
          <h2>Ventas del año</h2>
          <p>
            $ <span>{ventaAnio.toFixed(2)}</span>
          </p>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
