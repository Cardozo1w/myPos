import React, { useState } from "react";
import {
  TableHead,
  TableRow,
  TableCell,
  TableSortLabel,
} from "@material-ui/core";

import {
  makeStyles,
  TableBody,
  Toolbar,
  InputAdornment,
} from "@material-ui/core";
import useTable from "../../components/useTable";
import Controls from "../../components/controls/Controls";
import { Search } from "@material-ui/icons";

import axios from "axios";
import { useEffect } from "react";

const useStyles = makeStyles((theme) => ({
  pageContent: {
    margin: theme.spacing(5),
    padding: theme.spacing(3),
  },
  searchInput: {
    width: "100%",
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
];

export default function Products({
  setOpenProducts,
  productosVenta,
  setProductosVenta,
}) {
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

  const handleSearch = async (e) => {
    let target = e.target.value;
    if (target === "") {
      setRefresh(true);
    } else {
      const { data } = await axios.post("http://localhost:4000/api/like", {
        target: target,
      });
      setProductos(data);
    }
  };

  const handleClick = (item) => {
    item.cantidad = 1;
    setProductosVenta([...productosVenta, item]);
    setOpenProducts(false);
  };

  return (
    <>
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
      </Toolbar>
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
            <TableRow key={item.idProducto} onClick={() => handleClick(item)}>
              <TableCell>{item.idProducto}</TableCell>
              <TableCell>{item.descripcion}</TableCell>
              <TableCell>$ {item.precio.toFixed(2)}</TableCell>
              <TableCell>{item.claveSat}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </TblContainer>
    </>
  );
}
