import React, { useState } from "react";
import { makeStyles } from "@material-ui/core";
import { useEffect } from "react";
import { Document, Page, Text, View } from "@react-pdf/renderer";

const CotizacionPdf = ({ customer, productos, total, folio }) => {
  // console.log(customer);
  // const [productosVenta, setProductosVenta] = useState([]);
  // const [cliente, setCliente] = useState({
  //   idCliente: "",
  //   nombre: "",
  //   correo: "",
  //   estado: "",
  //   municipio: "",
  //   colonia: "",
  //   calle: "",
  //   codigopostal: "",
  // });

  // const classes = useStyles();

  // Creamos array con los meses del año
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
    <Document title={`cotizacion no. ${folio}`}>
      <Page size="LETTER">
        <View
          style={{
            textAlign: "center",
            padding: "20px 0",
            backgroundColor: "#0070C0",
            color: "#ffff",
          }}
        >
          <Text>Cotizacion</Text>
        </View>

        <View style={{ padding: "10px 50px" }}>
          <Text
            style={{
              textAlign: "center",
              fontWeight: 700,
              fontSize: "25px",
              padding: "7px 0",
              fontStyle: "italic"
            }}
          >
            FERRETERIA RUIZ
          </Text>
          <View
            style={{
              fontSize: "12px",
              textAlign: "center",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-around",
              marginTop: "10px",
            }}
          >
            <Text>5 de Mayo Sur No.79</Text>
            <Text>Col. Centro C.P 95640</Text>
          </View>
          <View
            style={{
              fontSize: "12px",
              textAlign: "center",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-around",
              marginTop: "5px",
              marginBottom: "20px",
            }}
          >
            <Text>RFC RULV-690623-SM4</Text>
            <Text>Telefono 874-11-92</Text>
          </View>

          <View
            style={{
              marginBottom: "20px",
              fontSize: "12px",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text>{hoy}</Text>
            <Text>Folio C{folio}</Text>
          </View>

          {customer.idCliente !== "" ? (
            <>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  fontSize: "9px",
                  justifyContent: "space-between",
                  marginBottom: "20px",
                }}
              >
                <View style={{}}>
                  <Text>Datos del cliente</Text>
                  <Text>
                    RFC: <span>{customer.idCliente}</span>
                  </Text>
                  <Text>
                    Nombre: <span>{customer.nombre}</span>
                  </Text>
                  <Text>
                    Correo electronico: <span>{customer.correo}</span>
                  </Text>
                </View>

                <View style={{}}>
                  <Text>Direccion</Text>
                  <Text>
                    Estado: <span>{customer.estado}</span>
                  </Text>
                  <Text>
                    Municipio: <span>{customer.municipio}</span>
                  </Text>
                  <Text>
                    Colonia: <span>{customer.colonia}</span>
                  </Text>

                  <Text>
                    Calle: <span>{customer.calle}</span>
                  </Text>
                  <Text>
                    Codigo Postal: <span>{customer.codigopostal}</span>
                  </Text>
                </View>
              </View>
            </>
          ) : null}

          <View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                fontSize: "13px",
                borderTop: "2px solid #000",
                borderBottom: "2px solid #000",
                padding: "5px 0",
              }}
            >
              <Text>Codigo</Text>
              <Text>Descripcion</Text>
              <Text>Precio</Text>
              <Text>Cantidad</Text>
              <Text>Total</Text>
            </View>
            {productos.map((producto) => (
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  fontSize: "9px",
                  justifyContent: "space-between",
                  marginTop: "5px",
                }}
              >
                <Text>{producto.idProducto}</Text>
                <Text>{producto.descripcion.substring(0, 20)}</Text>
                <Text>$ {producto.precio.toFixed(2)}</Text>
                <Text>{producto.cantidad}</Text>
                <Text>
                  $ {(producto.precio * producto.cantidad).toFixed(2)}
                </Text>
              </View>
            ))}
          </View>

          <Text style={{ textAlign: "right", marginTop: "15px", fontSize: "14px" }}>
            TOTAL: ${total.toFixed(2)}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default CotizacionPdf;
