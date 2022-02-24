import React, { createContext, useState } from "react";
import axios from "axios";

export const DataContext = createContext();

const generarToken = async () => {
  const grant =
    "grant_type=password&scope=offline_access+openid+APINegocios+&username=GOYA780416GM0&password=20b03da6247eb1ba4a04c3bda7285c94&client_id=webconector1&client_secret=D2EBED43-3DAD-48E8-906A-1B2221C63062&es_md5=true";
  const token = await axios.post(
    "https://authcli.stagefacturador.com/connect/token",
    grant
  );
  return token.data.access_token;
};

const parsearFecha = (fecha) => {
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
  const dias_semana = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];
  var date = new Date(fecha);
  const hoy =
    dias_semana[date.getDay()] +
    ", " +
    date.getDate() +
    " de " +
    meses[date.getMonth()] +
    " de " +
    date.getUTCFullYear();

  return hoy;
};

export const DataProvider = ({ children }) => {
  const [dataFactura, setDataFactura] = useState({
    emisor: {
      rfc: "GOYA780416GM0",
      nombre: "VICTOR RUIZ LIMON",
      regimenFiscal: "612",
      descripcionFacturador:
        "Personas Físicas con Actividades Empresariales y Profesionales",
      sucursal: {
        nombre: "FERRETERIA RUIZ",
        pais: "MEX",
        estado: "Veracruz",
        municipio: "Isla",
        localidad: "Isla",
        colonia: "Centro",
        calle: "AVENIDA 5 DE MAYO SUR",
        noExterior: "76",
        noInterior: "",
        referencia: "",
        codigoPostal: "95640",
        descripcionColonia: "",
        descripcionLocalidad: "",
        descripcionMunicipio: "",
        descripcionEstado: "",
        descripcionPais: "",
        correo: "contacto@facturador.com ",
      },
    },
  });

  const crearFactura = async (receptor) => {
    setDataFactura({
      ...dataFactura,
      receptor: {
        rfc: receptor.idCliente,
        nombre: receptor.nombre,
        usoCFDI: "G03",
        descripcionFacturador: "Gastos en general",
        direccionIDFacturador: 0,
        direccion: {
          nombre: "",
          pais: "MEX",
          estado: receptor.estado,
          municipio: receptor.municipio,
          localidad: receptor.localidad,
          colonia: receptor.colonia,
          calle: receptor.calle,
          noExterior: "",
          noInterior: "",
          referencia: "",
          codigoPostal: receptor.codigoPostal,
          descripcionColonia: "",
          descripcionLocalidad: "",
          descripcionMunicipio: "",
          descripcionEstado: "",
          descripcionPais: "",
          correo: receptor.correo,
        },
        descripcionResidenciaFiscal: "",
      },
    });
 
  };

  return (
    <DataContext.Provider
      value={{
        parsearFecha,
        generarToken,
        crearFactura,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
