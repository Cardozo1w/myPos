import React, { useState, useEffect } from "react";
import { Document, Page, Text, View, Image } from "@react-pdf/renderer";
import membrete from "../../img/membrete.jpg";
import cotimg from "../../img/cot.jpg";

const CotizacionLista = ({ customer, productos, total, folio, fecha }) => {
  const [cliente, setClienteCotizacion] = useState({
    nombre: "",
    idCliente: "",
  });

  const [productosCotizacion, setProductosCotizacion] = useState([]);
  const [totalCotizacion, setTotalCotizacion] = useState(0);
  const [folioCotizacion, setFolioCotizacion] = useState(null);

  useEffect(() => {
    const llenarDatos = () => {
      if (customer.idCliente !== "") {
        setClienteCotizacion(customer);
      }
      setProductosCotizacion(productos);
      setTotalCotizacion(total);
      setFolioCotizacion(folio);
    };

    llenarDatos();
  }, []);

  const nombreOracion = () => {
    let nombre = cliente.nombre.toLowerCase();
    nombre = nombre.replace(/\b\w/g, (l) => l.toUpperCase());
    return nombre;
  };

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
  //const fecha = new Date();
  var fecha = new Date(fecha);
  const hoy =
    dias_semana[fecha.getDay()] +
    ", " +
    fecha.getDate() +
    " de " +
    meses[fecha.getMonth()] +
    " de " +
   fecha.getUTCFullYear();




  return (
    <Document title={`cotizacion no. ${folioCotizacion}`}>
      <Page size="LETTER">
        <View style={{ padding: "10px 50px" }}>
          <Image src={membrete} />

          <View
            style={{
              marginBottom: "10px",
              fontSize: "12px",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text>{hoy}</Text>
            <Text>Folio C{folioCotizacion}</Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <Image
              src={cotimg}
              style={{ width: "30%", marginBottom: "10px" }}
            />
          </View>

          {cliente.idCliente !== "" ? (
            <>
              <Text style={{ fontSize: "12px", marginBottom: "10px" }}>
                Se extiende la presente cotización a: {nombreOracion()}
              </Text>
            </>
          ) : null}

          <View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                fontSize: "12px",
                borderTop: "2px solid #000",
                borderBottom: "2px solid #000",
                padding: "5px 0",
              }}
            >
              <Text style={{flexBasis: '10%'}}>Codigo</Text>
              <Text style={{flexBasis: '45%'}}>Descripcion</Text>
              <Text style={{flexBasis: '15%', textAlign: 'center'}}>Precio</Text>
              <Text style={{flexBasis: '15%'}}>Cantidad</Text>
              <Text style={{flexBasis: '15%'}}>Total</Text>
            </View>
            {productosCotizacion.map((producto) => (
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  fontSize: "9px",
                  marginTop: "5px",
                }}
              >
                <Text style={{flexBasis: '10%'}}>{producto.idProducto}</Text>
                <Text style={{flexBasis: '45%'}}>{producto.descripcion}</Text>
                <Text style={{flexBasis: '15%', paddingLeft: '15px'}}>$ {producto.precio.toFixed(2)}</Text>
                <Text style={{flexBasis: '15%', paddingLeft: '25px'}}>{producto.cantidad}</Text>
                <Text style={{flexBasis: '15%'}}>
                  $ {(producto.precio * producto.cantidad).toFixed(2)}
                </Text>
              </View>
            ))}
          </View>

          <Text
            style={{
              textAlign: "right",
              marginTop: "15px",
              fontSize: "14px",
              marginBottom: "20px",
            }}
          >
            TOTAL: ${totalCotizacion.toFixed(2)}
          </Text>

          <Text style={{ fontSize: "10px" }}>
            PRECIOS SUJETOS A CAMBIO SIN PREVIO AVISO
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default CotizacionLista;
