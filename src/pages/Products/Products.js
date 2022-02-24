import React, { useState } from "react";
import {
  TableHead,
  TableRow,
  TableCell,
  TableSortLabel,
} from "@material-ui/core";

import ProductForm from "./ProductForm";
import PageHeader from "../../components/PageHeader";
import AssignmentOutlinedIcon from '@material-ui/icons/AssignmentOutlined';
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
import axios from "axios";
import { useEffect } from "react";
import AgregarProducto from "./AgregarProducto";
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
  { id: "id", label: "Clave" },
  { id: "desc", label: "Descripcion" },
  { id: "precio", label: "Precio" },
  { id: "claveSat", label: "Clave SAT" },
  { id: "actions", label: "Acciones", disableSorting: true },
];

export default function Products() {
  const [agregarForm, setAgregarForm] = useState(false);
  const [productos, setProductos] = useState([]);
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
      const { data } = await axios.get("http://localhost:4000/api/");
      setProductos(data);
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
      const { data } = await axios.post("http://localhost:4000/api/like/", {
        target: target,
      });
      setProductos(data);
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
        await axios.delete(`http://localhost:4000/api/${deleteId}`);
        setRefresh(true);
      }
    });
  };

  return (
    <>
      <PageHeader
        title="Productos"
        subTitle="Formulario de Productos"
        icon={<AssignmentOutlinedIcon fontSize="large" />}
      />
      <Paper className={classes.pageContent}>
        <Toolbar>
          <Controls.Input
            label="Buscar Producto"
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
              {productos.map((item) => (
                <TableRow key={item.idProducto}>
                  <TableCell>{item.idProducto}</TableCell>
                  <TableCell>{item.descripcion}</TableCell>
                  <TableCell>$ {item.precio.toFixed(2)}</TableCell>
                  <TableCell>{item.claveSat}</TableCell>
                  <TableCell>
                    <Controls.ActionButton
                      color="primary"
                      onClick={() => {
                        openInPopup(item);
                      }}
                    >
                      <EditOutlinedIcon fontSize="small" />
                    </Controls.ActionButton>
                    {/* <Controls.ActionButton color="secondary">
                      <CloseIcon
                        fontSize="small"
                        onClick={() => deleteItem(item.idProducto)}
                      />
                    </Controls.ActionButton> */}
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
