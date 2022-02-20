export default {
  methods: {
    crearCampana (form) {
      if (this.$refs.form.validate()) {
        this.$service.post(`campanas`,
          {
            'nombre': this.form.nombre,
            'descripcion': this.form.descripcion,
            'fecha_inicio': this.form.fechaInicio,
            'fecha_fin': this.form.fechaFin,
            'id_tipo_campana': this.form.tipoMedioEscogido,
            'duracion': this.form.duracion
          })
        .then((response) => {
          if (response && response.campana) {
            this.$message.success('La campaña se ha creado correctamente.');
            let idCampana = response.campana.data.id;
            this.limpiaFormulario();
            this.modalCreate = false;
            this.recargaCampanas();
            this.$router.push(`/campana/${idCampana}`);
          }
        }).catch((error) => {
          this.$message.error('No se pudo crear la campaña ' + error);
        });
      } else {
        this.$message.error('Por favor verifique que la información haya sido llenada correctamente.');
      }
    },
    limpiaFormulario () {
      this.form.nombre = '';
      this.form.descripcion = '';
      this.form.tipoMedioEscogido = null;
      this.form.fechaInicio = null;
      this.form.fechaFin = null;
      this.form.duracion = null;
    },
    recargaCampanas () {
      this.$service.get(`campanas`)
      .then((response) => {
        if (response && response.campanas && response.campanas.data) {
          this.campanas = response.campanas.data.rows;
          this.campanasFiltradas = this.campanas;
        }
      }).catch((error) => {
        this.$message.error('No se pudo crear la campaña ' + error);
      });
    },
    editarCampanaCompleta (idCampana) {
      this.$router.push(`/campana/${idCampana}`);
    },
    eliminarCampana (idCampana) {
      this.$confirm('¿Quiere eliminar la campaña?', () => {
        this.$service.delete(`campanas/${idCampana}`)
        .then(response => {
          if (response) {
            this.$message.success('Campaña eliminada correctamente!');
            this.recargaCampanas();
          }
        });
      });
    },
    verCampana (idCampana) {
      this.$router.push(`/vercampana/${idCampana}`);
    },
    filtrarCampanas () {
      if (this.filtroCampana !== '') {
        this.campanasFiltradas = this.campanas.filter(
          (elemento) => elemento.nombre.toUpperCase().includes(this.filtroCampana.toUpperCase()) || elemento.descripcion.toUpperCase().includes(this.filtroCampana.toUpperCase())
        );
      } else {
        this.campanasFiltradas = this.campanas;
      }
    },
    guardar () {
      this.$service.get(`campanas/${this.idCampana}/validar`)
      .then((response) => {
        this.$message.success('La campaña fue almacenada y validada correctamente.');
      }).catch((error) => {
        this.$message.error('Por favor revise la información llenada ' + error);
      });
    },
    finalizar () {
      this.$confirm('¿Está seguro de finalizar la campaña? A partir de este momento no podrá realizar más cambios. La campaña será enviada para revisión.', () => {
        this.$service.put(`campanas/${this.idCampana}/enviar`)
        .then((response) => {
          this.$message.success('La campaña fue enviada para revisión.');
          this.$router.push(`/bandejaPauteo`);
        }).catch((error) => {
          this.$message.error('Por favor revise la información llenada ' + error);
        });
      });
    }
  }
};
