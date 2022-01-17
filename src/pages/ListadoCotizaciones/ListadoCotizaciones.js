import React, { useState } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TablePagination,
  TableSortLabel,
} from "@material-ui/core";
import { PDFViewer } from "@react-pdf/renderer";
import PageHeader from "../../components/PageHeader";
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
import AddIcon from "@material-ui/icons/Add";
import Popup from "../../components/Popup";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import CloseIcon from "@material-ui/icons/Close";
import axios from "axios";
import { useEffect } from "react";
import Swal from "sweetalert2";
import Cotizacionpdf from '../../components/pdf/cotizacionLista'

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
];

export default function ListadoCotizaciones() {
  const [agregarForm, setAgregarForm] = useState(false);
  const [cotizaciones, setCotizaciones] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const pages = [5, 10, 25];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pages[page]);
  const [order, setOrder] = useState();
  const [orderBy, setOrderBy] = useState();
  const classes = useStyles();
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [filterFn, setFilterFn] = useState({
    fn: (items) => {
      return items;
    },
  });

  useEffect(() => {
    const obtenerProductos = async () => {
      const { data } = await axios.get("http://localhost:4000/api/cotizacion");
      setCotizaciones(data);
      setRefresh(false);
    };

    obtenerProductos();
  }, [refresh]);

  const [openPopup, setOpenPopup] = useState(false);

  const { TblContainer, TblHead, TblPagination } = useTable(
    headCells,
    filterFn
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

  const addOrEdit = (employee, resetForm) => {};

  const openInPopup = (item) => {
    setRecordForEdit(item);
    setOpenPopup(true);
  };

  const handleSortRequest = (cellId) => {
    const isAsc = orderBy === cellId && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(cellId);
  };

const [clienteCotizacion, setCliente] = useState({
    idCliente: "",
    nombre: "",
});
const [productosCotizacion, setProductos] = useState([])
const [folio, setFolio] = useState(null)
const [total, setTotal] = useState(0)

  const obtenerCotizacion = async (folioCotizacion, totalCotizacion) => {

const {data} = await axios.get(`http://localhost:4000/api/cotizacion/${folioCotizacion}`);
let cliente = data.cliente[0];
cliente = cliente[0]
setFolio(folioCotizacion)
setTotal(totalCotizacion)
if(cliente !== undefined){
  setCliente(cliente)
}
setProductos(data.productos[0]);
setOpenPopup(true)



  }

  console.log(cotizaciones);

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
            label="Buscar Cotizacion"
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
          <Controls.Button
            text="Agregar Nuevo"
            variant="outlined"
            startIcon={<AddIcon />}
            className={classes.newButton}
            onClick={() => {
              setAgregarForm(true);
            }}
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
                <TableRow key={item.folio} onClick={()=>obtenerCotizacion(item.folio, item.total)}>
                  <TableCell>{item.folio}</TableCell>
                  <TableCell>{item.idCliente}</TableCell>
                  <TableCell>{item.fecha.substring(0,10)}</TableCell>
                  <TableCell>$ {item.total.toFixed(2)}</TableCell>
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
                productos={productosCotizacion}
                total={total}
                folio={folio}
              />
            </PDFViewer>
          </>
        ) : null}
      </Popup>
    </>
  );
}
