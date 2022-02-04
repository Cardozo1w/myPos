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
import useTable from "../../components/useTable";
//import * as employeeService from "../../services/employeeService";
import Controls from "../../components/controls/Controls";
import CloseIcon from "@material-ui/icons/Close";

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
  const [order, setOrder] = useState();
  const [orderBy, setOrderBy] = useState();
  const classes = useStyles();

  const { TblContainer } = useTable(
    headCells
  );


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
