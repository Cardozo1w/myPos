import React, { useState, useEffect } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TablePagination,
  TableSortLabel,
} from "@material-ui/core";

import ProductForm from "./CustomersForm";
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
import AgregarProducto from "./AgregarCliente";
import Swal from "sweetalert2";

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
  { id: "rf", label: "RFC" },
  { id: "nombre", label: "Nombre" },
  { id: "correo", label: "Correo" },
  { id: "codigopostal", label: "Codigo Postal" },
  { id: "actions", label: "Acciones", disableSorting: true },
];

export default function Customers() {
  const [agregarForm, setAgregarForm] = useState(false);
  const [clientes, setClientes] = useState([]);
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
      const { data } = await axios.get("http://localhost:4000/api/clientes/");
      setClientes(data);
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
    let target = e.target.value;
    if (target === "") {
      setRefresh(true);
    } else {
      console.log(target);
      const { data } = await axios.post(
        "http://localhost:4000/api/like/clientes",
        {
          target: target,
        }
      );
      setClientes(data);
    }
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

  const deleteItem = async (deleteId) => {
    Swal.fire({
      title: "¿Estás seguro de querer eliminar este registro?",
      text: "La acción no se puede revertir",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Si, eliminar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios.delete(`http://localhost:4000/api/clientes/${deleteId}`);
        setRefresh(true);
      }
    });
  };

  return (
    <>
      <PageHeader
        title="Clientes"
        subTitle="Formulario de Clientes"
        icon={<PeopleOutlineTwoToneIcon fontSize="large" />}
      />
      <Paper className={classes.pageContent}>
        <Toolbar>
          <Controls.Input
            label="Buscar Cliente"
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
            {clientes.map((item) => (
              <TableRow key={item.idCliente}>
                <TableCell>{item.idCliente}</TableCell>
                <TableCell>{item.nombre}</TableCell>
                <TableCell>{item.correo}</TableCell>
                <TableCell>{item.codigoPostal}</TableCell>
                <TableCell>
                  <Controls.ActionButton
                    color="primary"
                    onClick={() => {
                      openInPopup(item);
                    }}
                  >
                    <EditOutlinedIcon fontSize="small" />
                  </Controls.ActionButton>
                  <Controls.ActionButton color="secondary">
                    <CloseIcon
                      fontSize="small"
                      onClick={() => deleteItem(item.idCliente)}
                    />
                  </Controls.ActionButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </TblContainer>
        </div>
      </Paper>
      <Popup
        title="Modificar Producto"
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <ProductForm
          recordForEdit={recordForEdit}
          addOrEdit={addOrEdit}
          setRefresh={setRefresh}
          setOpenPopup={setOpenPopup}
        />
      </Popup>

      <Popup
        title="Agregar Producto"
        openPopup={agregarForm}
        setOpenPopup={setAgregarForm}
      >
        <AgregarProducto
          setRefresh={setRefresh}
          setAgregarForm={setAgregarForm}
        />
      </Popup>
    </>
  );
}
