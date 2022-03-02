
      <Paper className={classes.pageContent}>
        <p>Filtrar por fecha</p>
        <div style={{ display: "flex" }}>
          <Controls.DatePicker
            name="fechaInicial"
            label="Fecha Inicial"
            value={values.fechaInicial}
            onChange={handleInputChange}
          />
          <div
            style={{
              marginLeft: 20,
            }}
          >
            <Controls.DatePicker
              name="fechaFinal"
              label="Fecha Final"
              value={values.fechaFinal}
              onChange={handleInputChange}
            />
          </div>

          <Controls.Button
            style={{
              height: "56px",
              width: "200px",
              margin: 0,
              marginLeft: 20,
            }}
            text="Aplicar Filtro"
            variant="outlined"
            className=""
            onClick={() => {
              aplicarFiltro();
            }}
          />
        </div>
      </Paper>