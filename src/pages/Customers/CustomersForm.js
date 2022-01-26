import React, { useEffect } from "react";
import { Grid } from "@material-ui/core";
import Controls from "../../components/controls/Controls";
import { useForm, Form } from "../../components/useForm";
import * as employeeService from "../../services/employeeService";
import axios from "axios";

const initialFValues = {
  idCliente: "",
  nombre: "",
  correo: "",
  calle: "",
  nuext: "",
  colonia: "",
  codigoPostal: "",
  localidad: "",
  municipio: "",
  estado: "",
  pais: "",
};

export default function CustomersForm(props) {
  const { addOrEdit, recordForEdit } = props;

   const validate = (fieldValues = values) => {
    let temp = { ...errors };
    if ("idCliente" in fieldValues)
      temp.idCliente = fieldValues.idCliente ? "" : "Este campo es requerido";
   if ("correo" in fieldValues)
      temp.correo = fieldValues.correo ? "" : "Este campo es requerido";
      if ("codigoPostal" in fieldValues)
      temp.codigoPostal = fieldValues.codigoPostal ? "" : "Este campo es requerido";

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
          `http://localhost:4000/api/clientes/${values.idCliente}`,
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
            name="idCliente"
            label="RFC"
            value={values.idCliente}
            onChange={handleInputChange}
            error={errors.idCliente}
          />
          <Controls.Input
            name="nombre"
            label="Nombre Completo"
            value={values.nombre}
            onChange={handleInputChange}
            error={errors.nombre}
          />
          <Controls.Input
            label="Correo Electronico"
            name="correo"
            value={values.correo}
            onChange={handleInputChange}
            error={errors.correo}
          />
          <Controls.Input
            label="Codigo Postal"
            name="codigoPostal"
            value={values.codigoPostal}
            onChange={handleInputChange}
            error={errors.codigoPostal}
          />
  
          <Controls.Input
            label="Estado"
            name="estado"
            value={values.estado}
            error={errors.estado}
            onChange={handleInputChange}
          />
          <Controls.Input
            label="Pais"
            name="pais"
            value={values.pais}
            error={errors.pais}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={6}>
          <Controls.Input
            label="Numero exterior"
            name="nuext"
            value={values.nuext}
            error={errors.nuext}
            onChange={handleInputChange}
          />
          <Controls.Input
            label="Colonia"
            name="colonia"
            value={values.colonia}
            error={errors.colonia}
            onChange={handleInputChange}
          />
          <Controls.Input
            label="Localidad"
            name="localidad"
            value={values.localidad}
            error={errors.localidad}
            onChange={handleInputChange}
          />
          <Controls.Input
            label="Municipio"
            name="municipio"
            value={values.municipio}
            error={errors.municipio}
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
