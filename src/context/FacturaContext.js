import React, { createContext, useState } from "react";

export const FacturaContext = createContext();

export const FacturaProvider = ({ children }) => {
  const [productosFactura, setProductosFactura] = useState([]);

  return (
    <FacturaContext.Provider
      value={{
        productosFactura,
        setProductosFactura,
      }}
    >
      {children}
    </FacturaContext.Provider>
  );
};
