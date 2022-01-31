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
} from "@material-ui/core";
import useTable from "../../../components/useTable";
import Controls from "../../../components/controls/Controls";
import { useForm, Form } from "../../../components/useForm";

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
  { id: "total", label: "Total"}
];

export default function SaleTable({ productosVenta, setProductosVenta }) {
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


 
  const handleSortRequest = (cellId) => {
    const isAsc = orderBy === cellId && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(cellId);
  };
  const { TblContainer } = useTable(
    headCells,
    filterFn
  );


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
              <TableCell style={{textAlign: "center"}}>{parseFloat(item.cantidad).toFixed(2)}</TableCell>
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
