import React, { useEffect } from "react";
import { Grid } from "@material-ui/core";
import Controls from "../../components/controls/Controls";
import { useForm, Form } from "../../components/useForm";
import * as employeeService from "../../services/employeeService";
import axios from "axios";

const initialFValues = {
  idProducto: "",
  descripcion: "",
  precio: "",
  unidad: "",
  claveUnidad: "",
  claveSat: "",
};

export default function ProductForm(props) {
  const { addOrEdit, recordForEdit } = props;

  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    if ("idProducto" in fieldValues)
      temp.idProducto = fieldValues.idProducto ? "" : "Este campo es requerido";
    if ("descripcion" in fieldValues)
      temp.descripcion = fieldValues.descripcion
        ? ""
        : "Este campo es requerido";
    if ("precio" in fieldValues)
      temp.precio = fieldValues.precio ? "" : "Este campo es requerido";
    if ("unidad" in fieldValues)
      temp.unidad = fieldValues.unidad ? "" : "Este campo es requerido";
    if ("claveUnidad" in fieldValues)
      temp.claveUnidad = fieldValues.claveUnidad
        ? ""
        : "Este campo es requerido";
    if ("claveSat" in fieldValues)
      temp.claveSat = fieldValues.claveSat ? "" : "Este campo es requerido";

    setErrors({
      ...temp,
    });

    if (fieldValues == values) return Object.values(temp).every((x) => x == "");
  };

  const { values, setValues, errors, setErrors, handleInputChange, resetForm } =
    useForm(initialFValues, true, validate);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      //addOrEdit(values, resetForm);

      try {
        await axios.put(
          `http://localhost:4000/api/${values.idProducto}`,
          values
        );

        props.setRefresh(true);
        props.setOpenPopup(false);
      } catch (error) {
        console.log(error);
      }
  }
  };

  useEffect(() => {
    if (recordForEdit != null)
      setValues({
        ...recordForEdit,
      });
  }, [recordForEdit]);

  return (
    <Form onSubmit={handleSubmit}>
      <Grid container>
        <Grid item xs={6}>
          <Controls.Input
            disabled={true}
            name="idProducto"
            label="Clave"
            value={values.idProducto}
            onChange={handleInputChange}
            error={errors.idProducto}
          />
          <Controls.Input
            name="descripcion"
            label="Descripcion del Producto"
            value={values.descripcion}
            onChange={handleInputChange}
            error={errors.descripcion}
          />
          <Controls.Input
            label="Precio"
            name="precio"
            value={values.precio}
            onChange={handleInputChange}
            error={errors.precio}
          />
          <Controls.Input
            label="Unidad"
            name="unidad"
            value={values.unidad}
            onChange={handleInputChange}
            error={errors.unidad}
          />
        </Grid>
        <Grid item xs={6}>
          <Controls.Input
            label="Clave de Medida SAT"
            name="claveUnidad"
            value={values.claveUnidad}
            error={errors.claveUnidad}
            onChange={handleInputChange}
          />
          <Controls.Input
            label="Clave SAT"
            name="claveSat"
            value={values.claveSat}
            error={errors.claveSat}
            onChange={handleInputChange}
          />

          <div>
            <Controls.Button type="submit" text="Modificar" />
            <Controls.Button
              text="Resetear"
              color="default"
              onClick={resetForm}
            />
          </div>
        </Grid>
      </Grid>
    </Form>
  );
}
