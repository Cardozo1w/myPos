import React, { useState, useEffect } from "react";
import { Paper, makeStyles  } from "@material-ui/core";

import SaleTable from "./saleTable";


const useStyles = makeStyles((theme) => ({
  pageContent: {
    margin: theme.spacing(5),
    padding: theme.spacing(3),
  },
  searchInput: {
    width: "70%",
  },
  newButton: {
    position: "absolute",
    right: "10px",
  },
}));

export default function Sales({productosVenta}) {

  const [total, setTotal] = useState(0);

  const classes = useStyles();

  useEffect(() => {
    let tot = 0;
    productosVenta.map((item) => {
      tot = tot + parseFloat(item.cantidad) * item.precio;
    });

    setTotal(tot);
  }, [productosVenta]);


  return (
    <>
      <Paper>
        <div className="overflow2">
          <SaleTable
            productosVenta={productosVenta}
          />
        </div>
      </Paper>

      <Paper
        className={classes.pageContent}
        style={{ width: "40%", float: "right", marginTop: 20 }}
      >
        <p>
          Total <span>$ {total.toFixed(2)}</span>
        </p>
      </Paper>
    </>
  );
}
