<template>
  <div>
    <v-card-actions>
      <v-text-field
        name="nroOrden"
        label="Nro. Orden"
        id="nroOrden"
        v-model="nroOrden"
        maxlength="5"
        v-if="!esEdicion"
        required=""
      ></v-text-field>
      <v-text-field
        name="nroOrden"
        label="Nro. Orden"
        id="nroOrden"
        v-model="nroOrden"
        maxlength="5"
        v-if="esEdicion"
        required=""
      ></v-text-field>
      <!-- Si en la edicion el nro_orden debe comenzar en 1 entonces descomentar el siguiente text-field -->
      <!-- <v-text-field
        name="nroOrden"
        label="Nro. Orden"
        id="nroOrden"
        v-model="nroOrdenEditar"
        maxlength="5"
        v-if="esEdicion"
        required=""
      ></v-text-field> -->

      <!-- <v-select
        label="Nro. Orden"
        :items="listadoOrdenes"
        v-model="nroOrden"
        v-if="esEdicion"
      >
      </v-select> -->
      <v-spacer> </v-spacer>
      <v-btn round dark color="info" @click="finalizarOrden()" v-if="esEdicion === false">
        GUARDAR ORDEN DE PUBLICIDAD
      </v-btn>
    </v-card-actions>
    <v-card-text>
      <v-container grid-list-md>
        <div class="calendar-view" v-if="flagVer">
            <div style="max-height: 500px;" class="scroll-y horario">
            <div class="dayList">
              <template v-for="day in cabeceras">
                <slot :index="day.index" :label="day.label" name="dayHeader">
                  <div class="hour" v-if="day.label === '' " :key="`A${day.fecha}`">Hrs.</div>
                  <div class="day" v-if="day.label !== '' " :key="`B${day.fecha}`">{{ day.label }} {{obtieneDiaString(day.fecha)}}</div>
                </slot>
              </template>
            </div>
            <div v-for="fiveMinutes in 264" class="groupMinutes" :key="`a${fiveMinutes}`">
              <div class="daysContent">
                <template v-for="day in cabeceras">
                  <slot :day="day" name="dayContent">
                    <div class="hour" v-if="day.label === ''" :key="`b${day.fecha}`">
                      <div v-if="day.label === '' && (fiveMinutes-1)%12===0 " class="minutes">{{ horarios[(fiveMinutes-1)/12].label }}</div>
                    </div>
                    <div class="days" v-if="day.label !== ''" :class="{ active: day.label !== '' && recuperaDatos(day.index, fiveMinutes) && recuperaDatos(day.index, fiveMinutes).costo }" :key="`c${fiveMinutes}${day.fecha}`">
                      <div class="programa" v-if="day.label !== '' && recuperaDatos(day.index, fiveMinutes)">
                        <v-container v-if="recuperaDatos(day.index, fiveMinutes).primero" style="padding-top: 0px; padding-left: 0px; padding-bottom: 0px; padding-right: 14px;">
                         <v-layout row align-center>
                          <span class="white--text" v-if="recuperaDatos(day.index, fiveMinutes).primero">
                            {{ recuperaDatos(day.index, fiveMinutes).horas }}
                          </span>
                           <v-text-field
                            v-if="recuperaDatos(day.index, fiveMinutes).primero"
                              style="width: 35px; min-height:14px; padding: 0px; background: #fff;"
                              id="pases"
                              name="pases"
                              box
                              solo
                              v-model.number="arrayOrdenes[parseInt(recuperaDatos(day.index, fiveMinutes).id + obtieneDiaMesString(day.fecha))]"
                              @keydown.native="$filter.numeric($event)"
                              maxlength="2"
                              hide-details
                              single-line
                            ></v-text-field>
                            <!-- <v-flex xs11>
                                <span class="white--text" v-if="recuperaDatos(day.index, fiveMinutes).primero">
                                  {{ recuperaDatos(day.index, fiveMinutes).horas }}
                                </span>
                            </v-flex>
                            <v-flex xs1>
                              <v-text-field
                                v-if="recuperaDatos(day.index, fiveMinutes).primero"
                                style="max-width: 20px; min-height:14px; padding-top: 2px;"
                                id="pases"
                                name="pases"
                                box
                                solo
                                v-model.number="arrayOrdenes[parseInt(recuperaDatos(day.index, fiveMinutes).id + obtieneDiaMesString(day.fecha))]"
                                @keydown.native="$filter.numeric($event)"
                                maxlength="2"
                                hide-details
                                single-line
                              ></v-text-field>
                              // <input v-model.number="ww" type="number" v-if="recuperaDatos(day.index, fiveMinutes).primero"/>
                            </v-flex> -->
                         </v-layout>  
                        </v-container>
                        <span class="white--text" v-if="recuperaDatos(day.index, fiveMinutes-1) && recuperaDatos(day.index, fiveMinutes-1).primero && !recuperaDatos(day.index, fiveMinutes).primero">
                          {{ recuperaDatos(day.index, fiveMinutes).descripcion}}
                          <v-tooltip bottom>
                            <v-btn small icon dark slot="activator" color="info" @click="muestraDetalle(day.index, fiveMinutes)"> <v-icon> visibility </v-icon> </v-btn>
                            <span>Ver detalle</span>
                          </v-tooltip>
                        </span>
                        <span v-else>&nbsp;</span>
                      </div>
                    </div>
                  </slot>
                </template>
              </div>
            </div>
          </div>
        </div>
      </v-container>
      <v-dialog v-model="modalVer" max-width="500px" persistent>
        <v-card>
          <v-card-title>
            <h3>Detalles del programa</h3>
          </v-card-title>
          <v-card-text>
            <v-layout wrap align-left>
              <v-flex xs2>
                <b class="primary--text">Nombre:</b>
              </v-flex>
              <v-flex xs10>  
                <div>
                  {{ descripcionVer }}
                </div>
              </v-flex>
            </v-layout>
            <div>
              <b class="primary--text">Días y Horario de difusión:</b>
            </div>
            <v-layout wrap align-left>
              <v-flex xs4>
                <div>
                  {{ horasVer }}
                </div>
              </v-flex>
              <v-flex xs8>  
                <div>
                  {{ obtieneNombreDias(intervaloDiasVer) }}
                </div>
              </v-flex>
            </v-layout>
            <v-layout wrap align-left>
              <v-flex xs3>
                <b class="primary--text">Tipo de Costo:</b>
              </v-flex>
              <v-flex xs9>  
                <div>
                  {{ tipoCostoVer }}
                </div>
              </v-flex>
              <v-layout wrap align-left>
              <v-flex xs2>
                <b class="primary--text">Costo:</b>
              </v-flex>
              <v-flex xs10>  
                <div>
                  {{ costoVer }}
                </div>
              </v-flex>
            </v-layout>
            <v-layout wrap align-left v-if="especificacionVer">
              <v-flex xs3>
                <b class="primary--text">Especificación:</b>
              </v-flex>
              <v-flex xs10>  
                <div>
                  {{ especificacionVer }}
                </div>
              </v-flex>
            </v-layout>
            </v-layout>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click.stop="modalVer=false">Cerrar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card-text>
    <v-card-actions>
      <v-spacer> </v-spacer>
      <v-btn round dark color="info" @click="finalizarOrden()" v-if="esEdicion === false">
        GUARDAR ORDEN DE PUBLICIDAD
      </v-btn>
      <v-btn dark color="info" @click="finalizarOrdenEdicion()" v-if="esEdicion === true">
        <v-icon dark>check</v-icon>guardar cambios
      </v-btn>
    </v-card-actions>
  </div>
</template>

<script>

import dateFormat from 'dateformat';
import moment from 'moment';
import EventBus from '../../registro/tarifario/bus';

export default {
  props: {
    idMedio: {
      type: Number,
      default: 0
    },
    idTarifario: {
      type: Number,
      default: 0
    },
    idMedioTipoMedio: {
      type: Number,
      default: 0
    },
    idCampanaMedio: {
      type: Number,
      default: 0
    },
    idCampana: {
      type: Number,
      default: 0
    },
    editar: {
      type: Boolean,
      default: false
    },
    ordenesGuardadas: {
      type: Array,
      default: null
    }
  },
  data () {
    return {
      tarifario: [],
      tarifarioProdTv: [],
      esEdicion: this.editar,
      ordenesEditar: this.ordenesGuardadas,
      ordenesMostrar: [],
      weekdayNames: [
        {label: 'Lunes', index: 1},
        {label: 'Martes', index: 2},
        {label: 'Miércoles', index: 3},
        {label: 'Jueves', index: 4},
        {label: 'Viernes', index: 5},
        {label: 'Sábado', index: 6},
        {label: 'Domingo', index: 7} ],
      weekdayNamesColumn: [
        {label: '', index: 0},
        {label: 'Lunes', index: 1},
        {label: 'Martes', index: 2},
        {label: 'Miércoles', index: 3},
        {label: 'Jueves', index: 4},
        {label: 'Viernes', index: 5},
        {label: 'Sábado', index: 6},
        {label: 'Domingo', index: 7} ],
      horarios: [
        {label: '05:00', index: 1},
        {label: '06:00', index: 2},
        {label: '07:00', index: 3},
        {label: '08:00', index: 4},
        {label: '09:00', index: 5},
        {label: '10:00', index: 6},
        {label: '11:00', index: 7},
        {label: '12:00', index: 8},
        {label: '13:00', index: 9},
        {label: '14:00', index: 10},
        {label: '15:00', index: 11},
        {label: '16:00', index: 12},
        {label: '17:00', index: 13},
        {label: '18:00', index: 14},
        {label: '19:00', index: 15},
        {label: '20:00', index: 16},
        {label: '21:00', index: 17},
        {label: '22:00', index: 18},
        {label: '23:00', index: 19},
        {label: '00:00', index: 20},
        {label: '01:00', index: 21},
        {label: '02:00', index: 22}],
      idTarifarioTvRadio: this.idTarifario,
      idMedioTipoMedioTvRadio: this.idMedioTipoMedio,
      idMedioTvRadio: this.idMedio,
      idCampanaMedioTvRadio: this.idCampanaMedio,
      modalVer: false,
      intervaloDiasVer: [],
      semanaCompletaVer: false,
      descripcionVer: null,
      costoVer: null,
      horasVer: '',
      especificacionVer: null,
      tipoCostoVer: null,
      diaInicio: null,
      diaFinal: null,
      cabeceras: [],
      columnas: [],
      idCampanaTvRadio: this.idCampana,
      arrayOrdenes: [],
      haEditado: false,
      listadoOrdenes: [],
      nroOrden: 0,
      nroOrdenEditar: 1,
      flagVer: true
    };
  },
  created () {
    if (this.idMedioTvRadio !== null && this.idMedioTipoMedioTvRadio !== null && this.idTarifarioTvRadio !== null) {
      this.$service.get(`medios/${this.idMedioTvRadio}/tipos_medio/${this.idMedioTipoMedioTvRadio}/tarifarios/${this.idTarifarioTvRadio}`)
      .then((response) => {
        if (response && response.tarifario) {
          this.tarifario = response.tarifario;
          this.tarifarioProdTv = this.tarifario.data.matriz_detalles;
          if (this.ordenesEditar) {
            this.ordenesMostrar = this.ordenesEditar.filter((elemento) => (elemento.nro_orden === this.nroOrdenEditar));
          }
          // let tarifarioProdTvSinPases = this.tarifario.data.matriz_detalles;
          // this.tarifarioProdTv = tarifarioProdTvSinPases.map((elemento) => {
          //   let nuevoElemento = {};
          //   nuevoElemento = {
          //     label: elemento.label,
          //     index: elemento.index,
          //     programacion: elemento.programacion.map((element) => {
          //       let newElement = {};
          //       newElement = {
          //         primero: element.primero,
          //         horaIndex: element.horaIndex,
          //         costo: element.costo,
          //         descripcion: element.descripcion,
          //         horas: element.horas,
          //         ultimo: element.ultimo,
          //         id: element.id,
          //         hora: element.hora,
          //         pases: null
          //       };
          //       return newElement;
          //     })
          //   };
          //   return nuevoElemento;
          // });
          this.actualizarOrdenesSeleccionadas();
        } else {
          this.$message.error('No se pudo obtener el detalle');
        }
      }).catch((error) => {
        this.$message.error('No se pudo obtener el detalle ' + error);
      });
    };

    // Consulta el número máximo de ordenes registradas
    this.obtenerNroMaximoOrden();
  },
  methods: {
    obtienePasesOrdenesEditar (numero) {
      const cadena = numero + '';
      const idDetalle = cadena.substr(0, cadena.length - 4);
      const diaColumna = cadena.substring(cadena.length - 4, cadena.length);
      let devuelve = null;
      this.ordenesMostrar.forEach((elemento) => {
        if (elemento.id_tarifario_det === parseInt(idDetalle) && this.obtieneDiaMesString(elemento.fecha_publicacion) === diaColumna) {
          devuelve = elemento.nro_pases;
        }
      });
      return devuelve;
    },
    generaCabecera (inicio, cantidadDias, conHora, fechaInicio) {
      let columnas = [];
      let j = parseInt(inicio);
      let fechas = fechaInicio;
      if (conHora) {
        columnas.push({label: '', index: 0});
      }
      for (let i = 1; i <= cantidadDias; i = i + 1) {
        columnas.push({ index: this.weekdayNames[j - 1].index,
          label: this.weekdayNames[j - 1].label,
          fecha: fechas });
        if (j === 7) {
          j = 1;
        } else {
          j = j + 1;
        }
        fechas = this.obtieneFechaSiguiente(fechas);
      }
      return columnas;
    },
    obtieneFechaSiguiente (fecha) {
      let nuevaFecha = new Date(fecha);
      nuevaFecha.setDate(nuevaFecha.getDate() + 1);
      return nuevaFecha;
    },
    obtieneDiaString (fecha) {
      return dateFormat(fecha, 'dd', true);
    },
    obtieneDiaMesString (fecha) {
      return dateFormat(fecha, 'ddmm', true);
    },
    obtieneNombreDia (i) {
      let nombre = this.weekdayNames.find((elemento) => {
        return elemento.index === parseInt(i);
      });
      if (nombre) {
        return nombre;
      } else {
        return null;
      }
    },
    obtieneNombreDias (diasArray) {
      let nombresArray = [];
      nombresArray = diasArray.map((elemento) => {
        if (this.obtieneNombreDia(elemento) !== null) {
          return ' ' + this.obtieneNombreDia(elemento).label;
        }
      });
      return nombresArray.toString();
    },
    recuperaDatos (dia, nIntervaloMinutos) {
      let programacionDia = null;
      let contenidoEncontrado = null;
      programacionDia = this.tarifarioProdTv.find((elemento) => {
        if (elemento.index === dia) {
          return elemento;
        }
      });
      if (programacionDia && programacionDia.programacion && nIntervaloMinutos > 0) {
        contenidoEncontrado = programacionDia.programacion.find((element) => {
          if (element.horaIndex === nIntervaloMinutos) {
            return element;
          }
          return null;
        });
      }
      return contenidoEncontrado;
    },
    muestraDetalle (dia, minutos) {
      this.modalVer = true;
      let item = this.recuperaDatos(dia, minutos);
      this.$service.get(`medios/${this.idMedioTvRadio}/tipos_medio/${this.idMedioTipoMedioTvRadio}/tarifarios/${this.idTarifarioTvRadio}/detalles/${item.id}`)
      .then(response => {
        if (response.detalle && response.detalle.data) {
          this.descripcionVer = response.detalle.data.descripcion;
          this.horasVer = response.detalle.data.hora_inicio + ' - ' + response.detalle.data.hora_fin;
          this.intervaloDiasVer = response.detalle.data.dias;
          this.tipoCostoVer = 'por ' + response.detalle.data.tipo_costo;
          this.costoVer = 'Bs' + response.detalle.data.costo;
          if (response.detalle.data.especificacion) {
            this.especificacionVer = response.detalle.data.especificacion;
          } else {
            this.especificacionVer = null;
          }
        }
      }).catch((error) => {
        this.$message.error('No se puede mostrar el programa seleccionado ' + error);
      });
    },
    obtieneHora (cadenaHora) {
      let cadenaSeparada = cadenaHora.split(':');
      return cadenaSeparada[0];
    },
    obtieneMinutos (cadenaHora) {
      let cadenaSeparada = cadenaHora.split(':');
      return cadenaSeparada[1];
    },
    recuperaDatosOrden (dia, nIntervaloMinutos) {
      let programacionDia = null;
      let contenidoEncontrado = null;
      programacionDia = this.tarifarioProdTv.find((elemento) => {
        if (elemento.index === dia) {
          return elemento;
        }
      });
      if (programacionDia && programacionDia.programacion && nIntervaloMinutos > 0) {
        contenidoEncontrado = programacionDia.programacion.find((element) => {
          if (element.horaIndex === nIntervaloMinutos) {
            return element;
          }
          return null;
        });
      }
      return contenidoEncontrado;
    },
    finalizarOrden () {
      if (!this.nroOrden) {
        this.$message.error('Debe seleccionar el número de orden.');
        return null;
      }
      let mensaje = '';
      if (this.nroOrden >= 3) {
        mensaje = 'Solo se permite hasta 3 ordenes de solicitud, al aceptar directamete finalizara el registro.';
      }
      this.$confirm('¿Está seguro de registrar la orden de publicidad #' + this.nroOrden + '? ' + mensaje, () => {
        this.$service.get(`campanas/${this.idCampanaTvRadio}/medios/${this.idCampanaMedioTvRadio}`)
        .then(response => {
          if (response && response.campanaMedio && response.campanaMedio.data) {
            if (response.campanaMedio.data.referencia) {
              let arrayOrdenesEnvio = [];
              for (let i = 1; i <= 288; i = i + 1) {
                this.cabeceras.forEach((elemento) => {
                  let ordenSimple = null;
                  ordenSimple = this.recuperaDatosOrden(elemento.index, i);
                  if (ordenSimple && ordenSimple.primero) {
                    if (this.arrayOrdenes[parseInt(ordenSimple.id + this.obtieneDiaMesString(elemento.fecha))]) {
                      arrayOrdenesEnvio.push({'costo': ordenSimple.costo,
                        'fecha_publicacion': dateFormat(elemento.fecha, 'yyyy-mm-dd', true),
                        'hora_inicio': ordenSimple.horas.substring(0, 5),
                        'nro_pases': this.arrayOrdenes[parseInt(ordenSimple.id + this.obtieneDiaMesString(elemento.fecha))],
                        'id_tarifario_det': ordenSimple.id,
                        'nombre': ordenSimple.descripcion,
                        'tipo_costo': ordenSimple.tipo_costo,
                        'nro_orden': this.nroOrden});
                    }
                  }
                });
              }
              if (arrayOrdenesEnvio.length > 0) {
                this.$service.post(`campanas/${this.idCampanaTvRadio}/medios_relacionados/${this.idCampanaMedioTvRadio}/ordenes`,
                  {
                    'ordenes': arrayOrdenesEnvio
                  })
                .then((response) => {
                  if (response) {
                    this.$message.success('La orden publicitaria fue creada correctamente.');
                    this.nroOrden = this.nroOrden + 1;
                    this.flagVer = false;
                    this.$nextTick(() => {
                      this.flagVer = true;
                    });
                    if (this.nroOrden > 3) {
                      this.$router.push(`/campana/${this.idCampanaTvRadio}`);
                    }
                  }
                }).catch((error) => {
                  this.$message.error('No se pudo crear la orden de publicidad ' + error);
                });
              } else {
                this.$message.error('No ha introducido ningún parámetro para los pases. Por favor, revise los datos introducidos.');
              }
            } else {
              this.$message.error('Por favor elija el contacto del medio.');
            }
          }
        });
      });
    },
    finalizarOrdenEdicion () {
      if (!this.nroOrdenEdicion) {
        this.nroOrdenEdicion = 1;
      }
      this.$confirm('Los cambios de la orden de publicidad serán almacenados', () => {
        let arrayOrdenesEnvio = [];
        for (let i = 1; i <= 288; i = i + 1) {
          this.cabeceras.forEach((elemento) => {
            let ordenSimple = null;
            ordenSimple = this.recuperaDatosOrden(elemento.index, i);
            if (ordenSimple && ordenSimple.primero) {
              if (this.arrayOrdenes[parseInt(ordenSimple.id + this.obtieneDiaMesString(elemento.fecha))]) {
                arrayOrdenesEnvio.push({'costo': ordenSimple.costo,
                  'fecha_publicacion': dateFormat(elemento.fecha, 'yyyy-mm-dd', true),
                  'hora_inicio': ordenSimple.horas.substring(0, 5),
                  'nro_pases': this.arrayOrdenes[parseInt(ordenSimple.id + this.obtieneDiaMesString(elemento.fecha))],
                  'id_tarifario_det': ordenSimple.id,
                  'nombre': ordenSimple.descripcion,
                  'tipo_costo': ordenSimple.tipo_costo,
                  'nro_orden': this.nroOrdenEdicion});
              }
            }
          });
        }
        if (arrayOrdenesEnvio.length > 0) {
          this.$service.put(`campanas/${this.idCampanaTvRadio}/medios_relacionados/${this.idCampanaMedioTvRadio}/ordenes/nro/${this.nroOrden}`,
            {
              'ordenes': arrayOrdenesEnvio
            })
          .then((response) => {
            if (response) {
              this.$message.success('La orden publicitaria fue editada correctamente.');
              this.haEditado = true;
            }
          }).catch((error) => {
            this.$message.error('No se pudo editar la orden de publicidad ' + error);
          });
        } else {
          this.$message.error('No ha introducido ningún parámetro para los pases. Por favor, revise los datos introducidos.');
        }
      });
    },
    actualizarOrdenesSeleccionadas () {
      this.$service.get(`campanas/${this.idCampanaTvRadio}`)
      .then(response => {
        if (response && response.campana && response.campana.data) {
          let campanaEncontrada = response.campana.data;
          this.diaInicio = campanaEncontrada.fecha_inicio;
          this.diaFinal = campanaEncontrada.fecha_fin;
          let inicioColumna = dateFormat(dateFormat(this.diaInicio, 'fullDate', true), 'N');
          // let finColumna = dateFormat(dateFormat(this.diaFinal, 'fullDate', true), 'N');
          let cantidadDias = moment(this.diaFinal).diff(moment(this.diaInicio), 'days') + 1;
          this.cabeceras = this.generaCabecera(inicioColumna, cantidadDias, true, this.diaInicio);
          this.columnas = this.generaCabecera(inicioColumna, cantidadDias, false, this.diaInicio);
          for (let i = 1; i <= 228; i = i + 1) {
            this.cabeceras.forEach((elemento) => {
              let orden = null;
              orden = this.recuperaDatosOrden(elemento.index, i);
              if (orden && orden.primero === true) {
                if (this.esEdicion === false) {
                  this.arrayOrdenes[parseInt(orden.id + this.obtieneDiaMesString(elemento.fecha))] = null;
                } else {
                  this.arrayOrdenes[parseInt(orden.id + this.obtieneDiaMesString(elemento.fecha))] = this.obtienePasesOrdenesEditar(parseInt(orden.id + this.obtieneDiaMesString(elemento.fecha)));
                }
              }
            });
          }
        }
      });
    },
    obtenerNroMaximoOrden () {
      this.$service.get(`campanas/${this.idCampanaTvRadio}/medios_relacionados/${this.idCampanaMedioTvRadio}/maxordenes`)
      .then(response => {
        if (response.orden.data) {
          this.maximoNroOrden = response.orden.data.max;
        } else {
          this.maximoNroOrden = 0;
        }
        this.nroOrden = this.maximoNroOrden + 1;
        for (let i = 1; i <= this.maximoNroOrden; i = i + 1) {
          if (this.ordenesEditar.find((elemento) => {
            if (elemento.nro_orden === i && elemento.id_tarifario_det === this.tarifario.data.detalles[0].id) {
              this.listadoOrdenes.push({ value: i, text: 'Orden #' + i });
            }
          }));
        }
      });
    }
  },
  watch: {
    'haEditado' (val) {
      EventBus.$emit('edito', this.haEditado);
    },
    'nroOrdenEditar': function (nuevoValor, antiguoValor) {
      this.ordenesMostrar = this.ordenesEditar.filter((elemento) => (elemento.nro_orden === this.nroOrdenEditar));
      this.actualizarOrdenesSeleccionadas();
      this.flagVer = false;
      this.$nextTick(() => {
        this.flagVer = true;
      });
    }
  }
};
</script>

<style type="text/css">

/* Para los pases*/
.input-group--text-field-box:not(.input-group--textarea):not(.input-group--multi-line) .input-group__input {
    padding-left: 2px !important;
    padding-right: 2px !important;
}
.input-group--text-field input, .input-group--text-field textarea {
    font-size: 1em;
    min-width: 25px;
    background-color: white;
}

.input-group--text-field-box .input-group__input {
  min-height: 14px;
  padding-top: 0px;
}

.input-group--text-field-box .input-group__details {
  padding-top: 0px;
  padding-left: 0px;
  padding-right: 0px;
}
/* Position/Flex */

/* Make the calendar flex vertically */
.calendar-view {
	display: flex;
	flex-direction: column;
}

.calendar-view .header {
	display: flex;
	flex: 0 1 auto;
	flex-flow: row nowrap;
	align-items: center;
	min-height: 2.5em;
}

.calendar-view .header .periodLabel {
	display: flex;
	flex: 1 1 auto;
	flex-flow: row nowrap;
	min-height: 1.2em;
}

.calendar-view .dayList {
	display: flex;
	flex: 0 0 auto;
	flex-flow: row nowrap;
}

.calendar-view .daysContent {
	display: flex;
	flex: 0 0 auto;
	flex-flow: row nowrap;
}

.calendar-view .daysContent .days {
	display: flex;
	flex: 1 1 0;
	flex-flow: row nowrap;
	align-items: center;
	justify-content: left;
	text-align: justify;
  height: auto;
  /* border: 0px 2px 0 2px;
  border-width: 0px 2px 0 2px;
  border-color: #435f43;
  para bordessss */
}

.calendar-view .dayList .day {
	display: flex;
	flex: 1 1 0;
	flex-flow: row nowrap;
	align-items: center;
	justify-content: center;
  text-align: center;
  min-width: 120px;
}

/* The calendar grid should take up the remaining vertical space */
.calendar-view .weeks {
	display: flex;
	flex: 1 1 auto;
	flex-flow: column nowrap;

	/* Allow grid to scroll if there are too may weeks to fit in the view */
	overflow-y: scroll;
	-ms-overflow-style: none;
}

/* Use flex basis of 0 on week row so all weeks will be same height regardless of content */
.calendar-view .week {
	display: flex;
	flex: 1 1 0;
	flex-flow: row nowrap;
	min-height: 3em;

	/* Allow week events to scroll if they are too tall */
	position: relative;
	width: 100%;
	overflow-y: scroll;
	-ms-overflow-style: none;
}

.calendar-view .weeks::-webkit-scrollbar,
.calendar-view .week::-webkit-scrollbar {
	width: 0; /* remove scrollbar space */
	background: transparent; /* optional: just make scrollbar invisible */
}

.calendar-view .week .day {
	display: flex;
	flex: 1 1 0;
	position: relative; /* Fallback for IE11, which doesn't support sticky */
	position: sticky; /* When week's events are scrolled, keep the day content fixed */
	top: 0;
}

.calendar-view .day .content {
	position: absolute;
	left: 0;
	top: 0;
	bottom: 0;
	right: 0;
}

.calendar-view .days .content {
	position: absolute;
	left: 0;
	top: 0;
	bottom: 0;
	right: 0;
  width: auto;
}

.calendar-view .day .date {
	float: right;
	clear: both;
}

.calendar-view .hour {
	background-color: #f7f7f7;
  width: 50px;
  text-align: center;
  border-top: 1px;
}

.calendar-view .minutes {
	background-color: #ffffff;
  width: 50px;
  text-align: center;
  height: 14px;
  overflow: hidden;
  border-width: 2px 0px 0 0;
}

.calendar-view .groupMinutes {
	/* background-color: #f7f7f7; */
  text-align: left;
}

.calendar-view .event {
	position: absolute;
	/* // white-space: nowrap; */
	overflow: hidden;
	background-color: #f7f7f7;
}
.calendar-view .sin-event {
	position: absolute;
	/* // white-space: nowrap; */
	overflow: hidden;
	background-color: #f7f7f7;

}

.calendar-view .programa {
	/* white-space: nowrap; */
	overflow: hidden;
  display: block;
  min-width: 10%;
	/* background-color: #ffc241; */
}
/* Colors */

.calendar-view .header,
.calendar-view button,
.calendar-view .dayList,
.calendar-view .weeks,
.calendar-view .week,
.calendar-view .day,
.calendar-view .event {
	border-style: solid;
	border-color: #ddd;
}

/* Event Times */

.calendar-view .event .startTime:not(.hasEndTime),
.calendar-view .event .endTime {
	margin-right: 0.4em;
}

.calendar-view .event .endTime::before {
	content: "-";
}

/* Internal Metrics */

.calendar-view,
.calendar-view div,
.calendar-view button {
	box-sizing: border-box;
	line-height: 0.8em;
	font-size: 1em;
}

.calendar-view .dayList div {
	padding: 0.2em;
}

.calendar-view .date,
.calendar-view .event {
	padding: 0.5em;
}

/* Allows emoji icons or labels (such as holidays) to be added more easily to specific dates by having the margin set already. */
.calendar-view .day .date::before {
	margin-right: 0.5em;
}

/* Borders */

.calendar-view .week {
	border-width: 0 0 0px 0px;
}

.calendar-view .header {
	border-width: 1px 1px 0 1px;
}

.calendar-view .dayList {
	border-width: 2px 0px 1px 1px;
}

.calendar-view .day {
	border-width: 1px 1px 0 0;
}
/* }  cambiar el segundo a cero para que no hayan líneas */

.calendar-view .event {
	border-width: 1px;
}

.horario .days, .horario .hour {
  position: relative;
  min-height: 12px;
  border-bottom: 1px solid #eee;
  font-size: .95rem;
}
.horario .hour {
  min-width: 50px;
}
.horario .days {
  min-width: 120px;
}
.horario .days.active {
  background-color: #3d93c0;
  border-bottom: 1px solid #3d93c0;
  font-size: .9rem;
}
.horario .days::after, .horario .hour::after {
  content: "";
  position: absolute;
  right: 0;
  top: 0;
  bottom: -3px;
  border-right: 1px solid #aaa;
}

.horario .groupMinutes:nth-child(12n+1) {
  border-bottom: 1px solid #3593be;
}
</style>
