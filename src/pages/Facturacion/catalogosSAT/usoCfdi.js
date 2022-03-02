import React, { useState } from "react";
import {
  TableHead,
  TableRow,
  TableCell,
  TableSortLabel,
} from "@material-ui/core";
import usoCFDIJSON from "./UsoCFDI.json";
import {
  makeStyles,
  TableBody,
  Toolbar,
  InputAdornment,
} from "@material-ui/core";
import useTable from "../../../components/useTable";
import Controls from "../../../components/controls/Controls";
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
];

const UsoCFDI = ({ setUsoCFDI, setAbrirUsoCFDI }) => {
  const [refresh, setRefresh] = useState(false);
  const [order, setOrder] = useState();
  const [orderBy, setOrderBy] = useState();
  const classes = useStyles();

  const { TblContainer, TblHead, TblPagination } = useTable(headCells);
  const handleSortRequest = (cellId) => {
    const isAsc = orderBy === cellId && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(cellId);
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
          {usoCFDIJSON.map((item) => (
            <TableRow
              key={item.id}
              onClick={() => {
                setUsoCFDI(item);
                setAbrirUsoCFDI(false);
              }}
            >
              <TableCell>{item.id}</TableCell>
              <TableCell>{item.descripcion}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </TblContainer>
    </>
  );
};

export default UsoCFDI;
