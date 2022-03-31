import React, { useState, useContext } from "react";
import {
  TableHead,
  TableRow,
  TableCell,
  TableSortLabel,
} from "@material-ui/core";
import { PDFViewer } from "@react-pdf/renderer";
import PageHeader from "../../components/PageHeader";
import FormatListBulletedOutlinedIcon from "@material-ui/icons/FormatListBulletedOutlined";
import { AiFillPrinter } from "react-icons/ai";
import DescriptionIcon from "@material-ui/icons/Description";
import { FacturaContext } from "../../context/FacturaContext";
import {
  Paper,
  makeStyles,
  TableBody,
  Toolbar,
  InputAdornment,
} from "@material-ui/core";
import useTable from "../../components/useTable";
//import * as employeeService from "../../services/employeeService";
import Controls from "../../components/controls/Controls";
import { Search } from "@material-ui/icons";
import Popup from "../../components/Popup";
import axios from "axios";
import { useEffect } from "react";
import Cotizacionpdf from "../../components/pdf/cotizacionLista";
import { useForm, Form } from "../../components/useForm";


const useStyles = makeStyles((theme) => ({
  pageContent: {
    margin: 20,
    padding: theme.spacing(3),
  },
  searchInput: {
    width: "75%",
  },
  newButton: {
    position: "absolute",
    right: "10px",
  },
}));

const headCells = [
  { id: "id", label: "Folio" },
  { id: "cliente", label: "Cliente" },
  { id: "fecha", label: "Fecha" },
  { id: "total", label: "Total" },
  {id: "acciones", label: "Acciones"}
];

export default function ListadoCotizaciones({setActive}) {
  const { setProductosFactura } = useContext(FacturaContext);
  const [cotizaciones, setCotizaciones] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [order, setOrder] = useState();
  const [orderBy, setOrderBy] = useState();
  const classes = useStyles();

  useEffect(() => {
    const obtenerProductos = async () => {
      const { data } = await axios.post("http://localhost:4000/api/cotizacion");
      setCotizaciones(data);
      setRefresh(false);
    };

    obtenerProductos();
  }, [refresh]);

  const [openPopup, setOpenPopup] = useState(false);

  const { TblContainer } = useTable(headCells);

  const handleSortRequest = (cellId) => {
    const isAsc = orderBy === cellId && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(cellId);
  };

  const [productosCotizacion, setProductos] = useState([]);
  const [folio, setFolio] = useState(null);
  const [total, setTotal] = useState(0);
  const [fecha, setFecha] = useState(null);
  const [clienteCotizacion, setCliente] = useState({
    idCliente: "",
  });

  const obtenerCotizacion = async (
    folioCotizacion,
    totalCotizacion,
    fechaCotizacion
  ) => {
    const { data } = await axios.get(
      `http://localhost:4000/api/cotizacion/${folioCotizacion}`
    );
    let cliente = data.cliente[0];
    cliente = cliente[0];
    if (cliente !== undefined) {
      setCliente(cliente);
    }

    setFolio(folioCotizacion);
    setTotal(totalCotizacion);
    setFecha(fechaCotizacion);
    setProductos(data.productos[0]);
    setOpenPopup(true);
  };

  const initialFValues = {
    fechaInicial: new Date(),
    fechaFinal: new Date(),
  };

  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    setErrors({
      ...temp,
    });

    if (fieldValues == values) return Object.values(temp).every((x) => x == "");
  };

  const { values, setValues, errors, setErrors, handleInputChange, resetForm } =
    useForm(initialFValues, true, validate);

  const aplicarFiltro = async () => {
    const { data } = await axios.post("http://localhost:4000/api/cotizacion", {
      fechaInicial: values.fechaInicial,
      fechaFinal: values.fechaFinal,
    });
    setCotizaciones(data);
  };


  const crearFactura = async (folio, fecha, total) => {
    const { data } = await axios.get(
      `http://localhost:4000/api/cotizacion/${folio}`
    );
    console.log(data);
    setProductosFactura(data.productos[0]);
    setActive("facturacion")
    
  };

  return (
    <>
      <PageHeader
        title="Cotizaciones"
        subTitle="Listado de Cotizaciones"
        icon={<FormatListBulletedOutlinedIcon fontSize="large" />}
      />

      <Paper className={classes.pageContent}>
        <p>Filtrar por fecha</p>
        <div style={{ display: "flex" }}>
          <Controls.DatePicker
            name="fechaInicial"
            label="Fecha Inicial"
            value={values.fechaInicial}
            onChange={handleInputChange}
          />
          <div
            style={{
              marginLeft: 20,
            }}
          >
            <Controls.DatePicker
              name="fechaFinal"
              label="Fecha Final"
              value={values.fechaFinal}
              onChange={handleInputChange}
            />
          </div>

          <Controls.Button
            style={{
              height: "56px",
              width: "200px",
              margin: 0,
              marginLeft: 20,
            }}
            text="Aplicar Filtro"
            variant="outlined"
            className=""
            onClick={() => {
              aplicarFiltro();
            }}
          />
        </div>
      </Paper>
      <Paper className={classes.pageContent}>
        <div className="overflow">
          <TblContainer>
            <TableHead>
              <TableRow>
                {headCells.map((headCell) => (
                  <TableCell
                    key={headCell.id}
                    sortDirection={orderBy === headCell.id ? order : false}
                  >
                    {headCell.disableSorting ? (
                      headCell.label
                    ) : (
                      <TableSortLabel
                        active={orderBy === headCell.id}
                        direction={orderBy === headCell.id ? order : "asc"}
                        onClick={() => {
                          handleSortRequest(headCell.id);
                        }}
                      >
                        {headCell.label}
                      </TableSortLabel>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {cotizaciones.map((item) => (
                <TableRow
                  key={item.folio}
                >
                  <TableCell>{item.folio}</TableCell>
                  <TableCell>{item.idCliente}</TableCell>
                  <TableCell>{item.fecha.substring(0, 10)}</TableCell>
                  <TableCell>$ {item.total.toFixed(2)}</TableCell>
                  <TableCell>
                  <Controls.ActionButton
                      color="primary"
                      onClick={() => {
                        obtenerCotizacion(item.folio, item.total, item.fecha);
                      }}
                    >
                      <AiFillPrinter style={{ width: 20, height: 20 }} />
                    </Controls.ActionButton>
                  <Controls.ActionButton
                      color="primary"
                      onClick={() => {
                        crearFactura(item.folio, item.fecha, item.total);
                      }}
                    >
                      <DescriptionIcon style={{ width: 20, height: 20 }} />
                    </Controls.ActionButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </TblContainer>
        </div>
      </Paper>

      <Popup
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
        title="Cotizacion"
      >
        {productosCotizacion ? (
          <>
            <PDFViewer style={{ width: "800px", height: "90vh" }}>
              <Cotizacionpdf
                customer={clienteCotizacion}
                setCliente={setCliente}
                productos={productosCotizacion}
                total={total}
                folio={folio}
                fecha={fecha}
              />
            </PDFViewer>
          </>
        ) : null}
      </Popup>
    </>
  );
}
