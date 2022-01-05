import React, { useState } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TablePagination,
  TableSortLabel,
} from "@material-ui/core";
import productosjson from "../../pages/Products/productos.json";

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
import { useForm, Form } from "../../components/useForm";

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
  { id: "cantidad", label: "Cantidad" },
  { id: "total", label: "Total" },
  {id:'acciones', label: "Acciones"}
];

export default function SaleTable({ productosVenta, setProductosVenta }) {
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

  const initialFValues = {
    cantidad: "",
  };

  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    if ("cantidad" in fieldValues)
      temp.cantidad = fieldValues.cantidad ? "" : "Este campo es requerido";
  };

  const { values, setValues, errors, setErrors, handleInputChange, resetForm } =
    useForm(initialFValues, true, validate);

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

  const deleteItem = async (idProducto) => {
   console.log(idProducto);
   let deleteProduct = productosVenta.filter(producto=> producto.idProducto !== idProducto)
   setProductosVenta(deleteProduct);
  };

  const cantidadChange = (e, item) => {
    setProductosVenta(
      productosVenta.map((ventaItem) => {
        if (ventaItem.idProducto === item.idProducto) {
          return {
            ...ventaItem,
            cantidad: e.target.value,
          };
        } else {
          return ventaItem;
        }
      })
    );
  };

  return (
    <>
      <TblContainer>
        <TableHead>
          <TableRow>
            {headCells.map((headCell) => (
              <TableCell
                key={headCell.id}
                sortDirection={orderBy === headCell.id ? order : false}
                style={{ textAlign: "center" }}
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
          {productosVenta.map((item) => (
            <TableRow key={item.idProducto}>
              <TableCell>{item.idProducto}</TableCell>
              <TableCell>{item.descripcion}</TableCell>
              <TableCell>$ {item.precio.toFixed(2)}</TableCell>
              <TableCell style={{ display: "flex", alignItems: "center" }}>
                <Controls.Input
                  style={{ width: "75%" }}
                  name="cantidad"
                  label="Cantidad"
                  className={classes.searchInput}
                  onBlur={(e) => cantidadChange(e, item)}
                  //value={item.cantidad}
                  type="number"
                />
                <p
                  style={{
                    marginLeft: "20px",
                    fontSize: "20px",
                    fontWeight: "bold",
                  }}
                >
                  {item.cantidad}
                </p>
              </TableCell>
              <TableCell>
                $ {(item.precio * item.cantidad).toFixed(2)}
              </TableCell>
              <TableCell>
               <Controls.ActionButton color="secondary">
                      <CloseIcon
                        fontSize="small"
                        onClick={() => deleteItem(item.idProducto)}
                      />
                    </Controls.ActionButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </TblContainer>
    </>
  );
}
