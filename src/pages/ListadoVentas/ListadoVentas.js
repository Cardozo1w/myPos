import React, { useState, useContext } from "react";
import { DataContext } from "../../context/DataContext";
import { FacturaContext } from "../../context/FacturaContext";
import {
  TableHead,
  TableRow,
  TableCell,
  TableSortLabel,
} from "@material-ui/core";
import VisibilityIcon from "@material-ui/icons/Visibility";
import FormatListBulletedOutlinedIcon from "@material-ui/icons/FormatListBulletedOutlined";
import DescriptionIcon from "@material-ui/icons/Description";
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
import axios from "axios";
import { useEffect } from "react";
import Sales from "./Ventas/Sales";
import PageHeader from "../../components/PageHeader";
import Popup from "../../components/Popup";
import { AiFillPrinter } from "react-icons/ai";
import { useForm, Form } from "../../components/useForm";

const ipcRenderer = window.ipcRenderer;

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
  { id: "acciones", label: "Acciones" },
];

export default function ListadoVentas({setActive}) {
  const { parsearFecha } = useContext(DataContext);
  const { setProductosFactura } = useContext(FacturaContext);

  const [cotizaciones, setCotizaciones] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [order, setOrder] = useState();
  const [orderBy, setOrderBy] = useState();
  const classes = useStyles();

  useEffect(() => {
    const obtenerVentas = async () => {
      const { data } = await axios.post("http://localhost:4000/api/ventas", {
        fechaInicial: values.fechaInicial,
        fechaFinal: values.fechaFinal,
      });
      console.log(data);
      setCotizaciones(data);
      setRefresh(false);
    };

    obtenerVentas();
  }, [refresh]);

  const [openPopup, setOpenPopup] = useState(false);

  const { TblContainer } = useTable(headCells);

  const handleSearch = async (e) => {
    // let target = e.target.value;
    // if (target === "") {
    //   setRefresh(true);
    // } else {
    //   console.log(target);
    //   const { data } = await axios.post("http://localhost:4000/api/like/", {
    //     target: target,
    //   });
    //   setCotizaciones(data);
    // }
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

  const handleSortRequest = (cellId) => {
    const isAsc = orderBy === cellId && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(cellId);
  };

  const [productosVenta, setProductos] = useState([]);
  const [folio, setFolio] = useState(null);

  const verVenta = async (folioVenta) => {
    const { data } = await axios.get(
      `http://localhost:4000/api/venta/${folioVenta}`
    );
    setFolio(folioVenta);
    setProductos(data);
    setOpenPopup(true);
  };

  const printData = (args) => {
    console.log("Intentando imprimir...");
    ipcRenderer.send("print", JSON.stringify(args));
  };

  const reImprimir = async (folioReceipt, fecha, totalReceipt) => {
    const { data } = await axios.get(
      `http://localhost:4000/api/venta/${folioReceipt}`
    );

    const hoy = parsearFecha(fecha);
    let productosNota = [];
    let arrayRandom = [];

    data.map((item) => {
      arrayRandom = [];
      arrayRandom.push(`(${item.idProducto}) ${item.descripcion}`);
      arrayRandom.push(parseFloat(item.cantidad).toFixed(2));
      arrayRandom.push(parseFloat(item.precio).toFixed(2));
      arrayRandom.push(
        (parseFloat(item.cantidad) * parseFloat(item.precio)).toFixed(2)
      );
      productosNota.push(arrayRandom);
      arrayRandom = [];
    });

    // printData({
    //   folio: folioReceipt,
    //   productosNota,
    //   hoy,
    //   total: parseFloat(totalReceipt),
    // });
  };

  const aplicarFiltro = async () => {
    console.log("Fecha Inicial: " + values.fechaInicial);
    console.log("Fecha Final: " + values.fechaFinal);
    const { data } = await axios.post("http://localhost:4000/api/ventas", {
      fechaInicial: values.fechaInicial,
      fechaFinal: values.fechaFinal,
    });
    setCotizaciones(data);
  };

  const crearFactura = async (folio, fecha, total) => {
    const { data } = await axios.get(
      `http://localhost:4000/api/venta/${folio}`
    );
    setProductosFactura(data);
    setActive("facturacion")
    
  };

  return (
    <>
      <PageHeader
        title="Ventas"
        subTitle="Listado de Ventas"
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
                <TableRow key={item.folio}>
                  <TableCell>{item.folio}</TableCell>
                  <TableCell>Mostrador</TableCell>
                  <TableCell>{item.fecha.substring(0, 10)}</TableCell>
                  <TableCell>$ {item.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <Controls.ActionButton
                      color="primary"
                      onClick={() => {
                        verVenta(item.folio);
                      }}
                    >
                      <VisibilityIcon style={{ width: 20, height: 20 }} />
                    </Controls.ActionButton>
                    <Controls.ActionButton
                      color="primary"
                      onClick={() => {
                        reImprimir(item.folio, item.fecha, item.total);
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
        title={`Nota de venta No.${folio}`}
      >
        <Sales productosVenta={productosVenta} />
      </Popup>
    </>
  );
}
