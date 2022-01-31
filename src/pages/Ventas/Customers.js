import React, { useState, useEffect } from "react";
import {
  TableHead,
  TableRow,
  TableCell,
  TableSortLabel,
} from "@material-ui/core";
import PageHeader from "../../components/PageHeader";
import PeopleOutlineTwoToneIcon from "@material-ui/icons/PeopleOutlineTwoTone";
import {
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
];

export default function Customers({ setCliente, setOpenPopup }) {
  const [clientes, setClientes] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const pages = [5, 10, 25];
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState();
  const [orderBy, setOrderBy] = useState();
  const classes = useStyles();
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

  const handleSortRequest = (cellId) => {
    const isAsc = orderBy === cellId && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(cellId);
  };

  const handleClick = (item) => {
    setCliente(item);
    setOpenPopup(false);
  };

  return (
    <>
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
          {clientes.map((item) => (
            <TableRow key={item.idCliente} onClick={() => handleClick(item)}>
              <TableCell>{item.idCliente}</TableCell>
              <TableCell>{item.nombre}</TableCell>
              <TableCell>{item.correo}</TableCell>
              <TableCell>{item.codigoPostal}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </TblContainer>
    </>
  );
}
