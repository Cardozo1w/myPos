import React, { createContext, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export const DataContext = createContext();

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
  //const [dataFactura, setDataFactura] = useState(null);
  const [loading, setLoading] = useState(false);

  const generarToken = async () => {
    try {
      const grant =
        "grant_type=password&scope=offline_access+openid+APINegocios+&username=RULV690623SM4&password=538deff0ae5b17ab11f413ccf32e5ee3&client_id=client_RULV690623SM4&client_secret=584C3DA5-B119-438E-B634-F5C9D114D0E9&es_md5=true";
      const token = await axios.post(
        "https://auth.facturador.com/connect/token",
        grant
      );
      return token.data.access_token;
    } catch (error) {
      setLoading(false);
      return;
    }
  };

  const crearFactura = async (
    cliente,
    elementos,
    total,
    token,
    usoCFDI,
    formaPago,
    metodoPago,
    reiniciarFactura
  ) => {
    const ultimaFactura = await axios.post('http://localhost:4000/api/ultimafactura');
    let folio = ultimaFactura.data[0].folio + 1;
    const subTotalFactura = (total / 1.16).toFixed(2);
    const totalFactura = total.toFixed(2);

    let conceptos = [];
    let subTotal = 0;
    let impuestosTrasladados = (totalFactura - subTotalFactura).toFixed(2);

    elementos.map((elemento) => {
      let totalPartida =
        parseFloat(elemento.cantidad) * parseFloat(elemento.precio);
      let precioSinImpuesto = (totalPartida / 1.16).toFixed(2);
      let impuesto = (precioSinImpuesto * 1.16 - precioSinImpuesto).toFixed(2);
      let precioUnitario = (elemento.precio / 1.16).toFixed(2);
      subTotal = subTotal + impuesto;
      //impuestosTrasladados = impuestosTrasladados + impuesto;

      let data = {
        impuestos: {
          traslados: [
            {
              base: precioSinImpuesto,
              impuesto: "002",
              tipoFactor: "Tasa",
              tasaOCuota: 0.16,
              importe: impuesto,
              descripcionFacturador: "",
              esExento: false,
            },
          ],
          retenciones: null,
        },
        claveProdServ: elemento.claveSat,
        noIdentificacion: "1",
        cantidad: elemento.cantidad,
        claveUnidad: elemento.claveUnidad,
        unidad: "Pieza",
        descripcion: elemento.descripcion,
        valorUnitario: precioUnitario,
        importe: precioSinImpuesto,
        descuento: 0,
        claveFacturador: 0,
        descripcionFacturador: "",
        descripcionSat: "",
        complementoIds: [],
        idConcepto: 0,
      };

      // console.log(data);
      conceptos.push(data);
    });

    let facturaProcesar = {
      emisor: {
        rfc: "RULV690623SM4",
        nombre: "VICTOR RUIZ LIMON",
        regimenFiscal: "612",
        descripcionFacturador:
          "Personas Físicas con Actividades Empresariales y Profesionales",
        sucursal: {
          nombre: "ISLA",
          pais: "MEX",
          estado: "Veracruz",
          municipio: "Isla",
          localidad: "",
          colonia: "Centro",
          calle: "Av 5 de Mayo",
          noExterior: "79",
          noInterior: "",
          referencia: "",
          codigoPostal: "95641",
          descripcionColonia: "",
          descripcionLocalidad: "",
          descripcionMunicipio: "",
          descripcionEstado: "",
          descripcionPais: "",
          correo: "ferreteriaruiz@hotmail.com",
        },
      },
      receptor: {
        rfc: cliente.idCliente,
        nombre: cliente.nombre,
        usoCFDI: usoCFDI.id,
        descripcionFacturador: usoCFDI.descripcion,
        direccionIDFacturador: 0,
        direccion: {
          nombre: "",
          pais: "MEX",
          estado: cliente.estado,
          municipio: cliente.municipio,
          localidad: cliente.localidad,
          colonia: cliente.colonia,
          calle: cliente.calle,
          noExterior: "",
          noInterior: "",
          referencia: "",
          codigoPostal: cliente.codigoPostal,
          descripcionColonia: "",
          descripcionLocalidad: "",
          descripcionMunicipio: "",
          descripcionEstado: "",
          descripcionPais: "",
          correo: cliente.correo,
        },
        descripcionResidenciaFiscal: "",
      },
      conceptos,
      impuestos: {
        retenciones: null,
        traslados: [
          {
            impuesto: "002",
            tipoFactor: "Tasa",
            tasaOCuota: 0.16,
            importe: impuestosTrasladados,
          },
        ],
        totalImpuestosRetenidos: 0,
        totalImpuestosTrasladados: impuestosTrasladados,
      },
      version: "3.3",
      serie: "Sin serie",
      folio: folio,
      fecha: "2025-03-10T14:34:00",
      sello: "",
      formaPago: formaPago.id,
      noCertificado: "00001000000506694246",
      certificado: "",
      subTotal: subTotalFactura,
      descuento: 0,
      moneda: "MXN",
      tipoCambio: 1,
      total: totalFactura,
      tipoDeComprobante: "I",
      metodoPago: metodoPago,
      lugarExpedicion: "95641",
      informacionExtra: null,
      complementoIds: [0],
      estatusComprobante: 1,
      descripcionFacturador: "Factura",
      descripcionMetodoPago: "",
      descripcionFormaPago: "",
      descripcionMoneda: "",
      descripcionTipoConfirmacion: "",
    };

    console.log(facturaProcesar);

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    try {
      const { data } = await axios.post(
        "https://emision-api.facturador.com/api/v1/emisores/3280/comprobantes?emitir=true",
        
        facturaProcesar,
        {
          headers: headers,
        }
      );

      if (data.esValido) {
        try {
          const fechaCreacion = new Date();

          const dd = fechaCreacion.getDate();
          const mm = fechaCreacion.getMonth() + 1; //January is 0!
          const yyyy = fechaCreacion.getFullYear();

          const today = mm + "/" + dd + "/" + yyyy;
          await axios.post("http://localhost:4000/api/factura/insertar", {
            folio,
            rfc: cliente.idCliente,
            fecha: today,
            total: totalFactura,
            subTotal: subTotalFactura,
            uuid: data.uuid
          });
        } catch (error) {
          setLoading(false);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            html: "Error al en la isersion a la base de datos",
            // footer: '<a href="">Why do I have this issue?</a>'
          });
        }
        try {
          const pdfComprobante = await axios.get(
            `https://emision-api.facturador.com/api/v1/emisores/3280/comprobantes/${data.uuid}/pdf`,
            {
              headers: headers,
            }
          );
          setLoading(false);
          window.open(pdfComprobante.data, data.uuid, "resizable");
          reiniciarFactura();
        } catch (error) {
          setLoading(false);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            html: "Error al obtener el pdf",
            // footer: '<a href="">Why do I have this issue?</a>'
          });
        }
      } else if (!data.esValido) {
        if (data.errores.length > 0) {
          console.log(data.errores);
          let mensajes = "";
          data.errores.map((error) => {
            let msj = `<p style="display:block; margin-bottom: 10px;">${error.codigo} <span>${error.mensaje}</span></p>`;
            mensajes = mensajes + msj;
          });
          setLoading(false);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            html: mensajes,
            // footer: '<a href="">Why do I have this issue?</a>'
          });
        } else {
          setLoading(false);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: data,
            // footer: '<a href="">Why do I have this issue?</a>'
          });
        }
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Error al generar la factura, revisar que todos los datos esten correctos",
        // footer: '<a href="">Why do I have this issue?</a>'
      });
    }
  };

  return (
    <DataContext.Provider
      value={{
        parsearFecha,
        generarToken,
        crearFactura,
        loading,
        setLoading,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
