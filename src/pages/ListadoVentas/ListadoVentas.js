import React, { useState } from "react";
import {
  TableHead,
  TableRow,
  TableCell,
  TableSortLabel,
} from "@material-ui/core";
import PeopleOutlineTwoToneIcon from "@material-ui/icons/PeopleOutlineTwoTone";
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
import PageHeader from '../../components/PageHeader'
import Popup from "../../components/Popup";
import { AiFillPrinter } from 'react-icons/ai';
const ipcRenderer = window.ipcRenderer;


const useStyles = makeStyles((theme) => ({
  pageContent: {
    margin: theme.spacing(5),
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
  { id: "acciones", label: "Acciones" }
];

export default function ListadoVentas() {
  const [cotizaciones, setCotizaciones] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [order, setOrder] = useState();
  const [orderBy, setOrderBy] = useState();
  const classes = useStyles();

  useEffect(() => {
    const obtenerVentas = async () => {
      const { data } = await axios.get("http://localhost:4000/api/ventas");
      setCotizaciones(data);
      setRefresh(false);
    };

    obtenerVentas();
  }, [refresh]);

  const [openPopup, setOpenPopup] = useState(false);

  const { TblContainer } = useTable(
    headCells
  );

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


  const handleSortRequest = (cellId) => {
    const isAsc = orderBy === cellId && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(cellId);
  };

  const [productosVenta, setProductos] = useState([]);
  const [folio, setFolio] = useState(null)


  const verVenta = async (
    folioVenta
  ) => {
    const { data } = await axios.get(
      `http://localhost:4000/api/venta/${folioVenta}`
    )
    setFolio(folioVenta)
    setProductos(data);
    setOpenPopup(true);
  };

  const printData = (args) => {
    console.log('Intentando imprimir...')
    ipcRenderer.send('print', JSON.stringify(args))
  }

  const reImprimir = async (folioReceipt, fecha, totalReceipt) => {
    const { data } = await axios.get(
      `http://localhost:4000/api/venta/${folioReceipt}`
    )
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



    let productosNota = [];
    let arrayRandom = [];

    data.map(item => {
      arrayRandom = [];
      arrayRandom.push(`(${item.idProducto}) ${item.descripcion}`)
      arrayRandom.push(parseFloat(item.cantidad).toFixed(2))
      arrayRandom.push(parseFloat(item.precio).toFixed(2))
      arrayRandom.push((parseFloat(item.cantidad) * parseFloat(item.precio)).toFixed(2))
      console.log(arrayRandom)
      productosNota.push(arrayRandom)
      arrayRandom = []
    })

    printData({ folio: folioReceipt, productosNota, hoy, total: parseFloat(totalReceipt) });
    //console.log(productosNota);
    // console.log({ folio: folioReceipt, productosNota, hoy, totalReceipt })
  };




  return (
    <>
      <PageHeader
        title="Cotizaciones"
        subTitle="Listado de Cotizaciones"
        icon={<PeopleOutlineTwoToneIcon fontSize="large" />}
      />
      <Paper className={classes.pageContent}>
        <Toolbar>
          <Controls.Input
            label="Buscar Nota de Venta"
            className={classes.searchInput}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            onChange={handleSearch}
          />

        </Toolbar>
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
                  onClick={() => {
                    verVenta(item.folio);
                  }}
                >
                  <TableCell>{item.folio}</TableCell>
                  <TableCell>Mostrador</TableCell>
                  <TableCell>{item.fecha.substring(0, 10)}</TableCell>
                  <TableCell>$ {item.total.toFixed(2)}</TableCell>
                  <TableCell><Controls.ActionButton
                    color="primary"
                    onClick={() => {
                      reImprimir(item.folio, item.fecha, item.total)
                    }}
                  >
                    <AiFillPrinter style={{ width: 20, height: 20 }} />
                  </Controls.ActionButton></TableCell>
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
