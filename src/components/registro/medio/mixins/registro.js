'use strict';

export default {
  methods: {
    validar (data) {
    //   console.log(JSON.stringify(data));
    //   this.apm = this.$storage.get('apm');
    //   this.$service.get('persona/servicio/segip?ci=' + data.ci + '&fecha_nacimiento=' + data.fecha_nacimiento)
    //     .then(response => {
    //       if (response) {
    //         let nombres = response.datos.nombres;
    //         let apPaterno = response.datos.primer_apellido;
    //         let apMaterno = response.datos.segundo_apellido;
    //         console.log(nombres + apPaterno + apMaterno);
    //         this.form.representante.nombres = nombres;
    //         this.form.representante.apPaterno = apPaterno;
    //         this.form.representante.apMaterno = apMaterno;
    //         this.form.representante.id_apm = this.apm.id_apm;
    //         let representante = {
    //           ci: response.datos.documento_identidad,
    //           propietario: this.form.representante.tipo_representante,
    //           fecha_nacimiento: data.fecha_nacimiento,
    //           id_apm: this.apm.id_apm
    //         };
    //         if (!data.id_representante) {
    //           this.guardarRepresentante(representante);
    //         }
    //       }
    //     }).catch(() => {
    //       this.seen = true;
    //       this.$message.error('Los valores no son correctos');
    //     });
    },
    // guardarRepresentante (data) {
    //   this.apm = this.$storage.get('apm');
    //   this.$service.post('representante', {
    //     ci: data.ci,
    //     id_apm: this.apm.id_apm,
    //     propietario: data.propietario,
    //     fecha_nacimiento: data.fecha_nacimiento
    //   }).then(response => {
    //     if (response) {
    //       this.$storage.set('representanteLegal', response.datos.id_representante_legal);
    //       this.form.representante.id_representante = response.datos.id_representante_legal;
    //     }
    //   }).catch(() => {
    //     this.$message.error('No se pudo guardar el representante');
    //   });
    // },
    guardaDatosRepresentante (data) {
      const medio = this.$storage.get('medio');
      console.log(`medios/${medio.id}/referencias/${data.id}`);
      this.$service.put(`medios/${medio.id}/referencias/${data.id}`, {
        propietario: data.propietario,
        email: data.email,
        telefonos: data.telefonos.join(',')
      }).then(response => {
        if (response) {
          this.actualizaMedio();
        }
      }).catch(() => {
        this.$message.error('No se pudo guardar los datos del representante.');
      });
    },
    guardaDatosMedio (data) {
      const medio = this.$storage.get('medio');
      this.$service.put(`medios/${medio.id}/`, {
        razon_social: data.razonsocial,
        tipo_societario: data.tiposocietario,
        tipo_grupo: data.tipogrupo,
        medios: data.medios.join(','),
        email: data.email,
        telefonos: data.telefonos.join(','),
        direccion: data.direccion,
        web: data.web
      }).then(response => {
        if (response) {
          this.actualizaMedio();
        }
      }).catch(() => {
        this.$message.error('Los valores no son correctos');
      });
    },
    guardaTiposMedio (data) {
      const medio = this.$storage.get('medio');
      // Controla cuando es de tipo entero Select de seleccion simple, para convertir en array y la funcionalidad sea normal
      if (data !== []) {
        this.$service.put(`medios/${medio.id}/`, {
          tipos_medio: data
        }).then(response => {
          if (response) {
            this.actualizaMedio();
          }
        }).catch(() => {
          this.$message.error('Los valores no son correctos');
        });
      }
    },
    guardaTipoProductor (data) {
      const medio = this.$storage.get('medio');
      // Controla cuando es de tipo entero Select de seleccion simple, para convertir en array y la funcionalidad sea normal
      // if (data !== null) {
      if (data !== []) {
        // data = [data];
        this.$service.put(`medios/${medio.id}/`, {
          tipos_medio: data
        }).then(response => {
          if (response) {
            this.actualizaMedio();
          }
        }).catch(() => {
          this.$message.error('Los valores no son correctos');
        });
      }
    }
  }
};
