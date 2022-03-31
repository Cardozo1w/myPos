import React, { createContext, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Decimal from "decimal.js-light";

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
  const [loading, setLoading] = useState(false);

  const generarToken = async () => {
    try {
      const grant =
        "grant_type=password&scope=offline_access+openid+APINegocios+&username=GOYA780416GM0&password=20b03da6247eb1ba4a04c3bda7285c94&client_id=webconector1&client_secret=D2EBED43-3DAD-48E8-906A-1B2221C63062&es_md5=true";
      const token = await axios.post(
        "https://authcli.stagefacturador.com/connect/token",
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
    const ultimaFactura = await axios.post(
      "http://localhost:4000/api/ultimafactura"
    );
    let folio = ultimaFactura.data[0].folio + 1;
    const totalFactura = total.toFixed(2);

    let conceptos = [];
    let impuestosTrasladados = new Decimal(0)

    elementos.map((elemento) => {
      let totalPartida =
        parseFloat(elemento.cantidad) * parseFloat(elemento.precio);
      totalPartida = new Decimal(totalPartida);
      let precioSinImpuesto = new Decimal(0)
      precioSinImpuesto = totalPartida.dividedBy(1.16);
      precioSinImpuesto = precioSinImpuesto.toFixed(2);
      let impuesto = new Decimal(0);
      impuesto = totalPartida.minus(totalPartida.dividedBy(1.16));
      impuesto = impuesto.toFixed(2);
      let precioUnitario = new Decimal(elemento.precio)
      precioUnitario = precioUnitario.dividedBy(1.16)
      precioUnitario = precioUnitario.toFixed(2)
      impuestosTrasladados = new Decimal(impuestosTrasladados);
      impuestosTrasladados = impuestosTrasladados.plus(impuesto);
      impuestosTrasladados = impuestosTrasladados.toFixed(2);

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


    let subTotalFactura = new Decimal(total);
    subTotalFactura = subTotalFactura.minus(new Decimal(impuestosTrasladados));
    subTotalFactura = subTotalFactura.toFixed(2);

    let facturaProcesar = {
      emisor: {
        rfc: "GOYA780416GM0",
        nombre: "EMPRESA DE DEMOSTRACION S.A. DE C.V.",
        regimenFiscal: "612",
        descripcionFacturador:
          "Personas Físicas con Actividades Empresariales y Profesionales",
        sucursal: {
          nombre: "Atizapán",
          pais: "MEX",
          estado: "Edo. de México",
          municipio: "Atizapán de Zaragoza",
          localidad: "",
          colonia: "México Nuevo",
          calle: "Veracruz",
          noExterior: "34",
          noInterior: "20",
          referencia: "",
          codigoPostal: "51907",
          descripcionColonia: "",
          descripcionLocalidad: "",
          descripcionMunicipio: "",
          descripcionEstado: "",
          descripcionPais: "",
          correo: " contacto@facturador.com ",
        },
      },
      receptor: {
        rfc: "XAXX010101000",
        nombre: "EMPRESA DE PRUEBA TALLER 24",
        usoCFDI: "G03",
        descripcionFacturador: "Gastos en general",
        direccionIDFacturador: 0,
        direccion: {
          nombre: "Principal",
          pais: "",
          estado: "",
          municipio: "",
          localidad: "",
          colonia: "",
          calle: "",
          noExterior: "",
          noInterior: "",
          referencia: "",
          codigoPostal: "77500",
          descripcionColonia: "",
          descripcionLocalidad: "",
          descripcionMunicipio: "",
          descripcionEstado: "",
          descripcionPais: "",
          correo: "contacto@facturador.com",
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
        "https://pruebas.stagefacturador.com/businessEmision/api/v1/emisores/208/comprobantes?emitir=true",

        facturaProcesar,
        {
          headers: headers,
        }
      );

      if (data.esValido) {
        console.log("Valido");
        // try {
        //   //const fechaCreacion = new Date();

        //   // const dd = fechaCreacion.getDate();
        //   // const mm = fechaCreacion.getMonth() + 1; //January is 0!
        //   // const yyyy = fechaCreacion.getFullYear();

        //  // const today = mm + "/" + dd + "/" + yyyy;
        //   // await axios.post("http://localhost:4000/api/factura/insertar", {
        //   //   folio,
        //   //   rfc: cliente.idCliente,
        //   //   fecha: today,
        //   //   total: totalFactura,
        //   //   subTotal: subTotalFactura,
        //   //   uuid: data.uuid
        //   // });
        // } catch (error) {
        //   setLoading(false);
        //   Swal.fire({
        //     icon: "error",
        //     title: "Oops...",
        //     html: "Error al en la isersion a la base de datos",
        //     // footer: '<a href="">Why do I have this issue?</a>'
        //   });
        // }
        try {
          const pdfComprobante = await axios.get(
            `https://pruebas.stagefacturador.com/businessEmision/api/v1/emisores/208/comprobantes/${data.uuid}/pdf`,
            {
              headers: headers,
            }
          );
          setLoading(false);
          window.open(pdfComprobante.data, data.uuid, "resizable");
          //reiniciarFactura();
        } catch (error) {
          setLoading(false);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            html: "Error al obtener el pdf",
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
          });
        } else {
          setLoading(false);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: data,
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
