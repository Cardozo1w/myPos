import React from "react";
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


export default function AgregarCliente(props) {
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
    console.log('No paso validacion')
    if (validate()) {
      console.log('Paso Validacion')
      try {
        await axios.post("http://localhost:4000/api/nuevocliente", values);
        props.setRefresh(true);
        props.setAgregarForm(false);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Grid container>
        <Grid item xs={6}>
          <Controls.Input
            name="idCliente"
            label="RFC"
            onChange={handleInputChange}
            error={errors.idCliente}
          />
          <Controls.Input
            name="nombre"
            label="Nombre Completo"
           
            onChange={handleInputChange}
            error={errors.nombre}
          />
          <Controls.Input
            label="Correo Electronico"
            name="correo"
           
            onChange={handleInputChange}
            error={errors.correo}
          />
          <Controls.Input
            label="Codigo Postal"

            name="codigoPostal"
           
            onChange={handleInputChange}
            error={errors.codigoPostal}
          />
         
          <Controls.Input
            label="Estado"
            name="estado"
           
            error={errors.estado}
            onChange={handleInputChange}
          />
          <Controls.Input
            label="Pais"
            name="pais"
           
            error={errors.pais}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={6}>
          <Controls.Input
            label="Numero exterior"
            name="nuext"
           
            error={errors.nuext}
            onChange={handleInputChange}
          />
          <Controls.Input
            label="Colonia"
            name="colonia"
           
            error={errors.colonia}
            onChange={handleInputChange}
          />
          <Controls.Input
            label="Localidad"
            name="localidad"
           
            error={errors.localidad}
            onChange={handleInputChange}
          />
          <Controls.Input
            label="Municipio"
            name="municipio"
           
            error={errors.municipio}
            onChange={handleInputChange}
          />

          <div>
            <Controls.Button type="submit" text="Agregar" />
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
