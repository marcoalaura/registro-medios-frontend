export default {
  methods: {
    obtieneResumenFormato (item) {
      if (item.ordenes.length > 0) {
        return (item.ordenes[0].formato);
      }
      return ('dato inexistente');
    },
    obtieneResumenEdicion (item) {
      if (item.ordenes.length > 0) {
        return (item.ordenes[0].edicion);
      }
      return ('dato inexistente');
    },
    obtieneResumenFecha (item) {
      if (item.ordenes.length > 0) {
        return (item.ordenes[0].fecha_publicacion);
      }
      return (null);
    },
    obtieneResumenUbicacion (item) {
      if (item.ordenes.length > 0) {
        return (item.ordenes[0].ubicacion);
      }
      return ('dato inexistente');
    },
    obtieneResumenCosto (item) {
      if (item.ordenes.length > 0) {
        return (item.ordenes[0].costo);
      }
      return ('dato inexistente');
    },
    esDiferente (item, arrayItem) {
      let flag = true;
      arrayItem.forEach((elemento) => {
        if (elemento.tipo_costo === item.tipo_costo && elemento.costo === item.costo) {
          flag = false;
        }
      });
      return flag;
    },
    esDiferenteFecha (item, arrayItem) {
      let flag = true;
      arrayItem.forEach((elemento) => {
        if (elemento.fecha_publicacion === item.fecha_publicacion) {
          flag = false;
        }
      });
      return flag;
    },
    obtenerCostos (item, arrayOrdenes) {
      let costo = 0;
      arrayOrdenes.forEach((elemento) => {
        if (elemento.costo === item.costo && elemento.tipo_costo === item.tipo_costo) {
          if (elemento.tipo_costo === 'SEGUNDO') {
            costo = costo + (parseFloat(elemento.costo) * this.duracionCampana * elemento.nro_pases);
          } else {
            if (elemento.tipo_costo === 'PASE') {
              costo = costo + (parseFloat(elemento.costo) * elemento.nro_pases);
            } else {
              costo = costo + parseFloat(elemento.costo);
            }
          }
        }
      });
      return Math.round(costo * 100) / 100;
    },
    obtenerPases (item, arrayOrdenes) {
      let pases = 0;
      arrayOrdenes.forEach((elemento) => {
        if (elemento.costo === item.costo && elemento.tipo_costo === item.tipo_costo) {
          pases = pases + elemento.nro_pases;
        }
      });
      return pases;
    },
    obtieneResumenPasesDia (item) {
      if (item.ordenes.length > 0) {
        let pases = [];
        let nroPases = 0;
        let ordenes = item.ordenes;
        let diferentes = [];
        ordenes.forEach((element) => {
          if (this.esDiferenteFecha(element, diferentes)) {
            diferentes.push({fecha_publicacion: element.fecha_publicacion});
          }
        });
        diferentes.forEach((elemento) => {
          nroPases = 0;
          ordenes.forEach((element) => {
            if (elemento.fecha_publicacion === element.fecha_publicacion) {
              nroPases = nroPases + element.nro_pases;
            }
          });
          pases.push(nroPases);
        });
        if (pases.length > 0) {
        }
        return pases;
      }
      return null;
    },
    // es un array con frecuencia de pases ordenado y sin repetición
    frecuenciaPases (item) {
      let pasesResumen = [];
      pasesResumen = this.obtieneResumenPasesDia(item);
      let unicos = [];
      let esIgual = false;
      pasesResumen.forEach((element) => {
        esIgual = false;
        unicos.forEach((elemento) => {
          if (element === elemento) {
            esIgual = true;
          }
        });
        if (esIgual === false) {
          unicos.push(element);
        }
      });
      let ordenado = unicos.sort((a, b) => {
        return a - b;
      });
      return ordenado;
    },
    obtenerPasesTotal (item) {
      if (item.ordenes.length > 0) {
        let ordenes = item.ordenes;
        let pases = 0;
        ordenes.forEach((elemento) => {
          pases = pases + elemento.nro_pases;
        });
        return pases;
      }
      return null;
    },
    obtenerCostoTotal (item) {
      if (item.ordenes.length > 0) {
        let ordenes = item.ordenes;
        let costo = 0;
        ordenes.forEach((elemento) => {
          if (elemento.tipo_costo === 'SEGUNDO') {
            costo = costo + (parseFloat(elemento.costo) * this.duracionCampana * elemento.nro_pases);
          } else {
            if (elemento.tipo_costo === 'PASE') {
              costo = costo + (parseFloat(elemento.costo) * elemento.nro_pases);
            } else {
              costo = costo + parseFloat(elemento.costo);
            }
          }
        });
        return Math.round(costo * 100) / 100;
      }
    },
    obtieneResumenCostoParcial (item) {
      let costos = [];
      if (item.ordenes.length > 0) {
        let ordenes = item.ordenes;
        let diferentes = [];
        ordenes.forEach((element) => {
          if (this.esDiferente(element, diferentes)) {
            diferentes.push({tipo_costo: element.tipo_costo, costo: element.costo});
          }
        });
        diferentes.forEach((elemento) => {
          costos.push(this.obtenerCostos(elemento, ordenes));
        });
      }
      return costos;
    },
    obtieneResumenTarifasTipo (item) {
      if (item.ordenes.length > 0) {
        let ordenes = item.ordenes;
        let diferentes = [];
        ordenes.forEach((element) => {
          if (this.esDiferente(element, diferentes)) {
            diferentes.push({tipo_costo: element.tipo_costo, costo: element.costo});
          }
        });
        return diferentes;
      }
      return null;
    },
    obtieneResumenTarifasTipoSegundo (item) {
      if (item.ordenes.length > 0) {
        let ordenes = item.ordenes;
        let diferentes = [];
        ordenes.forEach((element) => {
          if (this.esDiferente(element, diferentes)) {
            diferentes.push({tipo_costo: element.tipo_costo, costo: element.costo});
          }
        });
        let segunderos = [];
        diferentes.forEach((element) => {
          if (element.tipo_costo === 'SEGUNDO') {
            segunderos.push(element.costo);
          }
        });
        return segunderos;
      }
      return null;
    },
    obtieneResumenTarifasTipoPase (item) {
      if (item.ordenes.length > 0) {
        let ordenes = item.ordenes;
        let diferentes = [];
        ordenes.forEach((element) => {
          if (this.esDiferente(element, diferentes)) {
            diferentes.push({tipo_costo: element.tipo_costo, costo: element.costo});
          }
        });
        let porPase = [];
        diferentes.forEach((element) => {
          if (element.tipo_costo === 'PASE') {
            porPase.push(element.costo);
          }
        });
        return porPase;
      }
      return null;
    },
    obtieneResumenTarifasTipoPaquete (item) {
      if (item.ordenes.length > 0) {
        let ordenes = item.ordenes;
        let diferentes = [];
        ordenes.forEach((element) => {
          if (this.esDiferente(element, diferentes)) {
            diferentes.push({tipo_costo: element.tipo_costo, costo: element.costo});
          }
        });
        let porPaquete = [];
        diferentes.forEach((element) => {
          if (element.tipo_costo === 'PAQUETE') {
            porPaquete.push(element.costo);
          }
        });
        return porPaquete;
      }
      return null;
    },
    ordenServicio (item) {
      this.$router.push(`/ordenes/${this.idCampana}/${item}`);
    },
    cargaEditarOrdenServicio (item) {
      if (this.flagTipoPrensa) {
        this.modalEditarPrensa = true;
        this.form.costo = item.ordenes[0].costo;
        this.form.fechaPublicacion = item.ordenes[0].fecha_publicacion;
        this.form.edicion = item.ordenes[0].edicion;
        this.form.nombre = item.ordenes[0].nombre;
        this.form.formato = item.ordenes[0].formato;
        this.form.ubicacion = item.ordenes[0].ubicacion;
        this.form.item = item;
      } else {
        this.modalEditarTvRadio = true;
        this.idCampanaMedioEditar = item.id;
        this.idMedioEditar = item.id_medio;
        this.idCampanaEditar = item.id_campana;
        this.pasesGuardados = item.ordenes;
        this.$service.get(`medios/${item.id_medio}`)
        .then((response) => {
          if (response && response.medio) {
            let medioEncontrado = response.medio.data;
            if (medioEncontrado.tipos_medio.length > 0) {
              let tiposMediosRecuperados = medioEncontrado.tipos_medio;
              let tipoMedioEncontrado = tiposMediosRecuperados.find((elemento) => {
                if (elemento.id_tipo_medio === 1 && this.tipoCampanaParam === 1) {
                  return elemento;
                }
                if (elemento.id_tipo_medio === 4 && this.tipoCampanaParam === 2) {
                  return elemento;
                }
                if (elemento.id_tipo_medio === 5 && this.tipoCampanaParam === 2) {
                  return elemento;
                }
                if (elemento.id_tipo_medio === 6 && this.tipoCampanaParam === 1) {
                  return elemento;
                }
                if (elemento.id_tipo_medio === 7 && this.tipoCampanaParam === 2) {
                  return elemento;
                }
                if (elemento.id_tipo_medio === 8 && this.tipoCampanaParam === 2) {
                  return elemento;
                }
                return elemento.id_tipo_medio === this.tipoCampanaParam;
              });
              // Se puede tener dos tipos de tarifarios en Radio
              this.tiposMediosPosibles = tiposMediosRecuperados.map((elemento) => {
                return ({'value': elemento.id, 'text': elemento.nombre, 'id_tarifario': elemento.tarifario.id});
              });

              if (this.tipoCampanaParam === 2) {
                this.tiposMediosPosibles = tiposMediosRecuperados.map((elemento) => {
                  return ({'value': elemento.id, 'text': elemento.nombre, 'id_tipo_medio': elemento.id_tipo_medio, 'id_tarifario': elemento.tarifario.id});
                }).filter((elemento) => (elemento.id_tipo_medio === 4 || elemento.id_tipo_medio === 5 || elemento.id_tipo_medio === 7 || elemento.id_tipo_medio === 8));
              } else {
                this.tiposMediosPosibles = tiposMediosRecuperados.map((elemento) => {
                  return ({'value': elemento.id, 'text': elemento.nombre, 'id_tipo_medio': elemento.id_tipo_medio, 'id_tarifario': elemento.tarifario.id});
                }).filter((elemento) => (elemento.id_tipo_medio === this.tipoCampanaParam));
              }
              if (tipoMedioEncontrado) {
                this.idMedioTipoMedioEditar = tipoMedioEncontrado.id;
                if (tipoMedioEncontrado.tarifario) {
                  this.idTarifarioEditar = tipoMedioEncontrado.tarifario.id;
                  this.flagCreacion = false;
                  this.$nextTick(() => {
                    this.flagCreacion = true;
                  });
                }
              } else {
                this.$message.error('No se encontró el tarifario.');
              }
            }
          }
        }).catch((error) => {
          this.$message.error('No se pudo obtener la información del medio ' + error);
        });
      }
    },
    editarOrdenServicio (form) {
      if (this.$refs.form.validate()) {
        this.$service.put(`campanas/${this.form.item.id_campana}/medios_relacionados/${this.form.item.id}/ordenes/${this.form.item.ordenes[0].id}`,
          {
            'costo': this.form.costo,
            'fecha_publicacion': this.form.fechaPublicacion,
            'edicion': this.form.edicion,
            'nombre': this.form.nombre,
            'formato': this.form.formato,
            'ubicacion': this.form.ubicacion,
            'nro_orden': 1
          })
        .then((response) => {
          if (response) {
            this.$message.success('La orden de publicidad fue editada correctamente.');
            this.form.item = null;
            this.form.costo = null;
            this.form.fechaPublicacion = null;
            this.form.edicion = null;
            this.form.nombre = null;
            this.form.formato = null;
            this.form.ubicacion = null;
            this.modalEditarPrensa = false;
            this.$service.get(`campanas/${this.idCampana}/medios`)
            .then(response => {
              if (response && response.medios) {
                this.ordenes = response.medios.data;
              }
            });
          }
        }).catch((error) => {
          this.$message.error('No se pudo crear la orden de publicidad ' + error);
        });
      } else {
        this.$message.error('Por favor verifique que la información haya sido llenada correctamente.');
      }
    },
    deleteOrdenServicioAll (item) {
      this.$confirm('¿Está seguro de eliminar el medio junto a su orden de publicidad? Este medio no aparecerá ligado a la campaña.', () => {
        this.$service.delete(`campanas/${this.idCampana}/medios/${item}`)
        .then(response => {
          if (response.detalle) {
            this.$message.success('Medio eliminado correctamente de la campaña.');
          }
        }).catch((error) => {
          this.$message.error('No se pudo eliminar el medio de la campaña. Por favor, vuelva a intentarlo. ' + error);
        });
      });
    }
  }
};
