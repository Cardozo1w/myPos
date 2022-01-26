import React, { useState } from "react";
import {
  TableHead,
  TableRow,
  TableCell,
  TableSortLabel,
} from "@material-ui/core";

import { makeStyles, TableBody } from "@material-ui/core";
import useTable from "../../components/useTable";
import Controls from "../../components/controls/Controls";
import axios from "axios";
import Swal from "sweetalert2";
import { useForm } from "../../components/useForm";

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
];

export default function SaleTable({ productosVenta, setProductosVenta }) {
  const [productos, setProductos] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const pages = [5, 10, 25];
  const [page, setPage] = useState(0);
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
            </TableRow>
          ))}
        </TableBody>
      </TblContainer>
    </>
  );
}
