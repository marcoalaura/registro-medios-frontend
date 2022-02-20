<template>
  <section>
    <v-card-text v-show="estadoMedio === 'PENDIENTE'">
      <v-form ref="form" lazy-validation @submit.prevent="guardarPrograma">
        <h4>Agregar Programa {{nombreTipoMedio}}</h4>
        <v-container grid-list-md>
          <v-card>
            <v-card-text>
              <v-alert type="info" :value="true">
                Por favor ingrese los detalles del ítem que será parte de su propuesta comercial.
              </v-alert>
            </v-card-text>
            <v-card-text>
              <v-layout wrap align-center>
                <v-flex xs3>
                  <v-text-field
                    name="descripcion"
                    label = "Descripción"
                    id="descripcion"
                    v-model="form.descripcion"
                    maxlength="150"
                    :rules="$validate(['required'])"
                    hint="Nombre del programa"
                    persistent-hint
                    required
                  ></v-text-field>
                  
                </v-flex>
                <v-flex xs3>
                  <v-card-text>
                    <span>Días de transmisión<b class="error--text">*</b></span>
                  <v-switch
                    label="Toda la semana"
                    v-model="form.semanaCompleta"
                    v-debounce="delay"
                  ></v-switch>
                  <v-layout>
                    <v-flex xs12 sm12>
                      <v-select
                        label="Días"
                        :items="weekdayNames"
                        v-model="form.intervaloDias"
                        item-text="label"
                        item-value="index"
                        multiple
                        max-height="200"
                        hint="Seleccione los días de transmisión"
                        persistent-hint
                        :disabled="form.semanaCompleta === true"
                        required
                      ></v-select>
                    </v-flex>
                  </v-layout>
                  </v-card-text>
                </v-flex>
                <v-flex xs3>
                  <!-- <span>Horario de transmisión <b class="error--text">*</b></span> -->
                  <template v-if="flagHorasCrear">
                    <v-layout row wrap>
                      <v-flex xs9 sm9>
                        <selector-horas empieza="00:00" model="horaIni"></selector-horas>
                      </v-flex>
                      <v-flex xs9 sm9>
                        <selector-horas :inicio="false" empieza="00:00" model="horaFin"></selector-horas>
                      </v-flex>
                    </v-layout>
                  </template>
                </v-flex>
                <v-flex xs2>
                  <span>Tarifa <b class="error--text">*</b></span>
                  <v-flex xs9>
                    <v-radio-group v-model="form.tipoCosto">
                      <!-- <v-radio
                        label="Tarifa Plana"
                        value="PLANA"
                      ></v-radio> -->
                      <v-radio
                        label="por SEGUNDO"
                        value="SEGUNDO"
                      ></v-radio>
                      <v-radio
                        label="por Pase"
                        value="PASE"
                      ></v-radio>
                      <v-radio
                        label="por Paquete"
                        value="PAQUETE"
                      ></v-radio>
                    </v-radio-group>
                    <v-text-field
                      name="costo"
                      id="costo"
                      prefix="Bs"
                      maxlength="9"
                      :rules="$validate(['required'])"
                      v-model="form.costo"
                      hint="Use punto para especificar decimales. Ejemplo: 3.00"
                      persistent-hint
                      required
                    ></v-text-field>
                  </v-flex>
                  <v-text-field
                    name="especificacion"
                    label = "Especificación del paquete"
                    id="especificacion"
                    v-model="form.especificacion"
                    maxlength="150"
                    :rules="$validate(['required'])"
                    hint="Ejemplo: 3 pases por programa."
                    persistent-hint
                    required
                    v-if="form.tipoCosto === 'PAQUETE'"
                  ></v-text-field>
                </v-flex>
                <v-flex xs1 align-center >
                  <v-card-actions>
                    <v-btn round dark color="info" type="submit">
                      <v-icon dark>add</v-icon>
                    </v-btn>
                  </v-card-actions>
                </v-flex>
              </v-layout>
            </v-card-text>
          </v-card>
        </v-container>
      </v-form>
      <v-container grid-list-md v-if="tarifarioDetalle.length === 0 && nombreTipoMedio !== 'Televisión'">
        <v-card>
          <v-card-text>
            <v-alert type="info" color="primary" :value="true">
              Por medio de este registro puede llenar facilmente el tarifario con horarios y programación por defecto.
            </v-alert>
          </v-card-text>
          <v-card-text>
            <v-layout row wrap>
              <span>Tarifa <b class="error--text">*</b></span>
              <v-flex xs3 sm3>
                <v-radio-group v-model="form.tipoCostoPD">
                  <v-radio
                    label="por SEGUNDO"
                    value="SEGUNDO"
                  ></v-radio>
                  <v-radio
                    label="por Pase"
                    value="PASE"
                  ></v-radio>
                  <v-radio
                    label="por Paquete"
                    value="PAQUETE"
                  ></v-radio>
                </v-radio-group>
              </v-flex>
              <v-flex xs3 sm3>
                <v-text-field
                  name="costo"
                  id="costo"
                  prefix="Bs"
                  maxlength="9"
                  :rules="$validate(['required'])"
                  v-model="form.costoPD"
                  hint="Use punto para especificar decimales. Ejemplo: 3.00"
                  persistent-hint
                  required
                ></v-text-field>
              </v-flex>
              <v-flex xs2 sm2>
                <v-card-actions>
                  <v-btn round dark color="primary" @click.stop="registrarPorDefecto()">
                    Por defecto
                  </v-btn>
                </v-card-actions>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-container>
    </v-card-text>
    <v-card-text>
      <v-container grid-list-md>
        <div class="calendar-view">
          <slot name="header">
            <div class="header" text-xs-center>
              <h3 >Tarifario</h3>
            </div>
          </slot>
            <div style="max-height: 500px;" class="scroll-y horario">
            <div class="dayList">
              <template v-for="day in weekdayNamesColumn">
                <slot :index="day.index" :label="day.label" name="dayHeader">
                  <div class="hour" v-if="day.label === '' ">Hrs.</div>
                  <div class="day" v-if="day.label !== '' ">{{ day.label }}</div>
                </slot>
              </template>
            </div>
            <div v-for="fiveMinutes in 264" class="groupMinutes">
              <div class="daysContent">
                <template v-for="day in weekdayNamesColumn">
                  <slot :day="day" name="dayContent">
                    <div class="hour" v-if="day.label === ''">
                      <div v-if="day.label === '' && (fiveMinutes-1)%12===0 " class="minutes">{{ horarios[(fiveMinutes-1)/12].label }}</div>
                    </div>
                    <div class="days" v-if="day.label !== ''" :class="{ active: day.label !== '' && recuperaDatos(day.index, fiveMinutes) && recuperaDatos(day.index, fiveMinutes).costo }">
                      <div class="programa" v-if="day.label !== '' && recuperaDatos(day.index, fiveMinutes)">
                        <span class="white--text" v-if="recuperaDatos(day.index, fiveMinutes).primero">
                          {{ recuperaDatos(day.index, fiveMinutes).horas }}
                          <v-tooltip top>
                            <v-btn small icon dark slot="activator" color="info" @click.stop="editarDetalleCarga(day.index, fiveMinutes)"> <v-icon> edit </v-icon> </v-btn>
                            <span>Editar programa</span>
                          </v-tooltip>
                          <v-tooltip top>
                            <v-btn small icon dark slot="activator" color="info" @click="eliminarDetalle(day.index, fiveMinutes)"  v-show="estadoMedio === 'PENDIENTE'"> <v-icon> delete </v-icon> </v-btn>
                            <span>Eliminar programa</span>
                          </v-tooltip>
                        </span>
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
    </v-card-text>
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
    <v-dialog v-model="modalEditar" max-width="600px" persistent>
      <v-card>
        <v-card-title>
          <b>Editar Programa</b>
        </v-card-title>
        <v-form ref="formEditar" lazy-validation @submit.prevent="editarDetalle">
          <v-card-text>
            <v-layout wrap align-center>
              <v-flex xs1>
              </v-flex>
              <v-flex xs10>
                <v-text-field
                  name="descripcion"
                  id="descripcion"
                  v-model="formEditar.descripcion"
                  maxlength="150"
                  :rules="$validate(['required'])"
                  hint="Descripción"
                  persistent-hint
                  required
                ></v-text-field>
              </v-flex>
              <v-flex xs1>
              </v-flex>
            </v-layout>
      <v-layout wrap>
      <v-flex xs8>
        <v-card-text>
          <span>Días de difusión</span>
        <v-layout>
          <template v-if="modalEditar === true">
          <v-flex xs10 sm10>
            <v-select
              :items="weekdayNames"
              v-model="formEditar.intervaloDias"
              item-text="label"
              item-value="index"
              multiple
              max-height="200"
              :rules="$validate(['required'])"
              required
              :disabled="estadoMedio !== 'PENDIENTE'"
            ></v-select>
          </v-flex>
          </template>
        </v-layout>
        </v-card-text>
      </v-flex>
      <v-flex xs4>
        <template v-if="flagHoras !== false && estadoMedio === 'PENDIENTE'">
          <v-layout row wrap>
            <v-flex xs12 sm12>
              <selector-horas model="horaIniEditar" :hora="horaInicio" :minuto="minutoInicio" disabled="estadoMedio !== 'PENDIENTE'"></selector-horas>
            </v-flex>
            <v-flex xs12 sm12>
              <selector-horas :inicio="false" model="horaFinEditar" :hora="horaFin" :minuto="minutoFin" :disabled="estadoMedio !== 'PENDIENTE'"></selector-horas>
            </v-flex>
          </v-layout>
        </template>
        <template v-if="estadoMedio !== 'PENDIENTE'">
          Hora inicio: <br>
          {{horaInicio}} : {{minutoInicio}} <br>
          Hora fin: <br>
          {{horaFin}} : {{minutoFin}} <br>
        </template>
      </v-flex>
    </v-layout>
    <v-layout wrap align-center>
      <v-flex xs5>
        <v-radio-group v-model="formEditar.tipoCosto">
          <!-- <v-radio
            label="Tarifa Plana"
            value="PLANA"
          ></v-radio> -->
          <v-radio
            label="por SEGUNDO"
            value="SEGUNDO"
            :disabled="estadoMedio !== 'PENDIENTE'"
          ></v-radio>
          <v-radio
            label="por Pase"
            value="PASE"
            :disabled="estadoMedio !== 'PENDIENTE'"
          ></v-radio>
          <v-radio
            label="por Paquete"
            value="PAQUETE"
            :disabled="estadoMedio !== 'PENDIENTE'"
          ></v-radio>
        </v-radio-group>
      </v-flex>
        <v-flex xs7>
          <v-text-field
            name="costo"
            id="costo"
            prefix="Bs"
            maxlength="9"
            :rules="$validate(['required'])"
            v-model="formEditar.costo"
            hint="Costo (Use punto para especificar decimales. Ejemplo: 3.50)"
            persistent-hint
            required
            :disabled="estadoMedio !== 'PENDIENTE'"
          ></v-text-field>
          <v-text-field
            name="especificacion"
            id="especificacion"
            v-model="formEditar.especificacion"
            maxlength="150"
            :rules="$validate(['required'])"
            hint="Especificación del paquete"
            persistent-hint
            required
            v-if="formEditar.tipoCosto === 'PAQUETE'"
            :disabled="estadoMedio !== 'PENDIENTE'"
          ></v-text-field>
        </v-flex>
      </v-layout>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click.stop="modalEditar=false">Cancelar</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="info" type="submit">
            Guardar cambios</v-btn>
        </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </section>
</template>
<script>

import validate from '@/common/mixins/validate';
import debounce from 'debounce';
import Tarifario from './mixins/tarifario';
import SelectorHoras from './SelectorHoras.vue';
import EventBus from './bus';

export default {
  mixins: [validate, Tarifario],
  props: {
    tipoMedio: {
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
    }
  },
  created () {
    if (this.$storage.get('medio')) {
      if (this.$storage.get('medio').tipos_medio) {
        this.estadoMedio = this.$storage.get('medio').estado;
        let tiposMediosRecuperados = this.$storage.get('medio').tipos_medio;
        let tipoMedioEncontrado = tiposMediosRecuperados.find((elemento) => {
          return elemento.id === this.idMedioTipoMedioTvRadio;
        });
        if (tipoMedioEncontrado) {
          this.nombreTipoMedio = tipoMedioEncontrado.nombre;
          if (tipoMedioEncontrado.tarifario) {
            let idTarifarioEncontrado = tipoMedioEncontrado.tarifario.id;
            this.idTarifarioTvRadio = idTarifarioEncontrado;
            this.$service.get(`medios/${this.$storage.get('medio').id}/tipos_medio/${this.idMedioTipoMedio}/tarifarios/${this.idTarifarioTvRadio}`)
            .then((response) => {
              if (response && response.tarifario) {
                this.tarifario = response.tarifario;
                this.tarifarioProdTv = this.tarifario.data.matriz_detalles;
                this.tarifarioDetalle = this.tarifario.data.detalles;
              } else {
                this.$message.error('No se pudo obtener el detalle');
              }
            }).catch((error) => {
              this.$message.error('No se pudo obtener el detalle ' + error);
            });
          }
        } else {
          this.$router.push('/registro');
          this.$message.error('No se no se encontró el tarifario.');
        }
      }
    }
  },
  mounted () {
    if (this.$storage.get('medio')) {
      if (this.$storage.get('medio').tipos_medio) {
        let tiposMediosRecuperados = this.$storage.get('medio').tipos_medio;
        let tipoMedioEncontrado = tiposMediosRecuperados.find((elemento) => {
          return elemento.id === this.idMedioTipoMedioTvRadio;
        });
        if (tipoMedioEncontrado) {
          this.idMedioTipoMedio = tipoMedioEncontrado.id;
          if (tipoMedioEncontrado.tarifario) {
            let idTarifarioEncontrado = tipoMedioEncontrado.tarifario.id;
            this.idTarifarioTvRadio = idTarifarioEncontrado;
            this.$service.get(`medios/${this.$storage.get('medio').id}/tipos_medio/${this.idMedioTipoMedioTvRadio}/tarifarios/${this.idTarifarioTvRadio}`)
            .then((response) => {
              if (response && response.tarifario) {
                this.tarifario = response.tarifario;
                this.tarifarioProdTv = this.tarifario.data.matriz_detalles;
              }
            }).catch((error) => {
              this.$message.error('No se pudo obtener el detalle' + error);
            });
          }
        }
      }
    }
    EventBus.$on('horaIni', (item) => {
      this.form.horaIni = item;
    });
    EventBus.$on('horaFin', (item) => {
      this.form.horaFin = item;
    });
    // EventBus.$on('horaIniEditar', (item) => {
    //   this.formEditar.horaIni = item;
    // });
    // EventBus.$on('horaFinEditar', (item) => {
    //   this.formEditar.horaFin = item;
    // });
  },
  data () {
    return {
      form: {
        intervaloDias: [],
        semanaCompleta: false,
        descripcion: null,
        costo: null,
        costoPD: null,
        id: 0,
        horaIni: '',
        horaFin: '',
        especificacion: null,
        tipoCosto: 'PASE',
        tipoCostoPD: 'PASE'
      },
      delay: 2000,
      tarifarioProdTv: [],
      tarifarioDetalle: [],
      tipos_medio: this.tipos_medio,
      estadoMedio: '',
      nombreTipoMedio: '',
      filters: [
        {
          field: 'descripcion',
          label: this.$t('entity.crud.name'),
          type: 'text',
          typeG: 'String'
        }
      ],
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
        {label: '05:00', index: 0},
        {label: '06:00', index: 1},
        {label: '07:00', index: 2},
        {label: '08:00', index: 3},
        {label: '09:00', index: 4},
        {label: '10:00', index: 5},
        {label: '11:00', index: 6},
        {label: '12:00', index: 7},
        {label: '13:00', index: 8},
        {label: '14:00', index: 9},
        {label: '15:00', index: 10},
        {label: '16:00', index: 11},
        {label: '17:00', index: 12},
        {label: '18:00', index: 13},
        {label: '19:00', index: 14},
        {label: '20:00', index: 15},
        {label: '21:00', index: 16},
        {label: '22:00', index: 17},
        {label: '23:00', index: 18},
        {label: '00:00', index: 19},
        {label: '01:00', index: 20},
        {label: '02:00', index: 21}],
      idTarifarioTvRadio: this.idTarifario,
      idMedioTipoMedioTvRadio: this.idMedioTipoMedio,
      modalEditar: false,
      modalVer: false,
      intervaloDiasVer: [],
      semanaCompletaVer: false,
      descripcionVer: null,
      costoVer: null,
      horasVer: '',
      especificacionVer: null,
      tipoCostoVer: null,
      formEditar: {
        intervaloDias: [],
        semanaCompleta: false,
        descripcion: null,
        costo: null,
        id: 0,
        horaIni: '',
        horaFin: '',
        especificacion: null,
        tipoCosto: 'PASE'
      },
      horaFin: '',
      minutoFin: '',
      horaInicio: '',
      minutoInicio: '',
      flagHoras: false,
      flagHorasCrear: true
    };
  },
  methods: {
    guardarPrograma (form) {
      if (this.$refs.form.validate()) {
        let data = {
          'descripcion': this.form.descripcion,
          'dias': this.form.intervaloDias,
          'hora_inicio': this.form.horaIni,
          'hora_fin': this.form.horaFin,
          'tipo_costo': this.form.tipoCosto,
          'costo': this.form.costo
        };
        if (this.form.tipoCosto === 'PAQUETE') {
          data = {
            'descripcion': this.form.descripcion,
            'dias': this.form.intervaloDias,
            'hora_inicio': this.form.horaIni,
            'hora_fin': this.form.horaFin,
            'tipo_costo': this.form.tipoCosto,
            'costo': this.form.costo,
            'especificacion': this.form.especificacion
          };
        }
        this.$service.post(`medios/${this.$storage.get('medio').id}/tipos_medio/${this.idMedioTipoMedioTvRadio}/tarifarios/${this.idTarifarioTvRadio}/detalles`, data)
        .then((response) => {
          if (response && response.detalle) {
            this.actualizaMedio();
            this.$message.success('El ítem se ha guardado correctamente.');
            this.limpiaFormulario();
            this.flagHorasCrear = false;
            this.$nextTick(() => {
              this.flagHorasCrear = true;
            });
            this.recuperaDetalle();
          }
        }).catch((error) => {
          this.$message.error('No se pudo guardar el ítem en el tarifario ' + error);
        });
      } else {
        this.$message.error('Debe llenar todos los datos requeridos');
      }
    },
    obtieneNombreDia (index) {
      let nombre = this.weekdayNames.find((elemento) => {
        return elemento.index === index;
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
    limpiaFormulario () {
      this.form.descripcion = null;
      this.form.costo = null;
      this.form.tipoCosto = 'PASE';
      this.form.intervaloDias = [];
      this.form.semanaCompleta = false;
      this.form.horaIni = null;
      this.form.horaFin = null;
      this.form.especificacion = null;
    },
    recuperaDetalle () {
      this.$service.get(`medios/${this.$storage.get('medio').id}/tipos_medio/${this.idMedioTipoMedioTvRadio}/tarifarios/${this.idTarifarioTvRadio}`)
      .then((response) => {
        if (response && response.tarifario) {
          this.tarifario = response.tarifario;
          this.tarifarioProdTv = this.tarifario.data.matriz_detalles;
          this.tarifarioDetalle = this.tarifario.data.detalles;
        }
      }).catch((error) => {
        this.$message.error('No se pudo obtener el detalle' + error);
      });
    },
    editarDetalleCarga (dia, minutos) {
      this.modalEditar = true;
      let item = this.recuperaDatos(dia, minutos);
      this.$service.get(`medios/${this.$storage.get('medio').id}/tipos_medio/${this.idMedioTipoMedioTvRadio}/tarifarios/${this.idTarifarioTvRadio}/detalles/${item.id}`)
      .then(response => {
        if (response.detalle && response.detalle.data) {
          let detalle = response.detalle.data;
          this.formEditar.descripcion = detalle.descripcion;
          this.formEditar.intervaloDias = detalle.dias;
          this.formEditar.horaIni = detalle.hora_inicio;
          this.formEditar.horaFin = detalle.hora_fin;
          this.horaFin = this.obtieneHora(this.formEditar.horaFin);
          this.minutoFin = this.obtieneMinutos(this.formEditar.horaFin);
          this.horaInicio = this.obtieneHora(this.formEditar.horaIni);
          this.minutoInicio = this.obtieneMinutos(this.formEditar.horaIni);
          this.formEditar.tipoCosto = detalle.tipo_costo;
          this.formEditar.costo = detalle.costo;
          this.formEditar.id = detalle.id;
          if (detalle.especificacion !== null && detalle.tipo_costo === 'PAQUETE') {
            this.formEditar.especificacion = detalle.especificacion;
          } else {
            this.formEditar.especificacion = null;
          }
          this.flagHoras = false;
          this.$nextTick(() => {
            this.flagHoras = true;
          });
          EventBus.$on('horaIniEditar', (item) => {
            this.formEditar.horaIni = item;
          });
          EventBus.$on('horaFinEditar', (item) => {
            this.formEditar.horaFin = item;
          });
        }
      }).catch((error) => {
        this.$message.error('No se puede cargar el programa seleccionado ' + error);
      });
    },
    editarDetalle (formEditar) {
      if (this.$refs.formEditar.validate()) {
        if (this.formEditar.tipoCosto !== 'PAQUETE') {
          this.formEditar.especificacion = null;
        }
        this.$service.put(`medios/${this.$storage.get('medio').id}/tipos_medio/${this.idMedioTipoMedioTvRadio}/tarifarios/${this.idTarifarioTvRadio}/detalles/${this.formEditar.id}`,
          {
            'descripcion': this.formEditar.descripcion,
            'dias': this.formEditar.intervaloDias,
            'hora_inicio': this.formEditar.horaIni.substring(0, 5),
            'hora_fin': this.formEditar.horaFin.substring(0, 5),
            'tipo_costo': this.formEditar.tipoCosto,
            'costo': this.formEditar.costo,
            'especificacion': this.formEditar.especificacion
          })
        .then((response) => {
          if (response && response.detalle) {
            this.actualizaMedio();
            this.$message.success('El programa se ha actualizado correctamente.');
            this.recuperaDetalle();
            this.modalEditar = false;
          }
        }).catch((error) => {
          this.$message.error('No se pudo editar el programa en el tarifario ' + error);
        });
      }
    },
    eliminarDetalle (dia, minutos) {
      let item = this.recuperaDatos(dia, minutos);
      this.$confirm('¿Está seguro de eliminar el programa? El conjunto de horarios del programa se eliminarán.', () => {
        this.$service.delete(`medios/${this.$storage.get('medio').id}/tipos_medio/${this.idMedioTipoMedioTvRadio}/tarifarios/${this.idTarifarioTvRadio}/detalles/${item.id}`)
        .then(response => {
          if (response.detalle) {
            this.$message.success('Programa eliminado correctamente');
            this.actualizaMedio();
            this.recuperaDetalle();
          }
        }).catch((error) => {
          this.$message.error('No se pudo eliminar el programa del tarifario ' + error);
        });
      });
    },
    muestraDetalle (dia, minutos) {
      this.modalVer = true;
      let item = this.recuperaDatos(dia, minutos);
      this.$service.get(`medios/${this.$storage.get('medio').id}/tipos_medio/${this.idMedioTipoMedioTvRadio}/tarifarios/${this.idTarifarioTvRadio}/detalles/${item.id}`)
      .then(response => {
        if (response.detalle && response.detalle.data) {
          this.descripcionVer = response.detalle.data.descripcion;
          this.horasVer = response.detalle.data.hora_inicio + ' - ' + response.detalle.data.hora_fin;
          this.intervaloDiasVer = response.detalle.data.dias;
          // if (response.detalle.data.tipo_costo === 'PLANA') {
          //   this.tipoCostoVer = 'tarifa ' + response.detalle.data.tipo_costo;
          // } else {
          this.tipoCostoVer = 'por ' + response.detalle.data.tipo_costo;
          // }
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
    registrarPorDefecto () {
      let data = {
        'tipo_costo': this.form.tipoCostoPD,
        'costo': this.form.costoPD
      };
      if (this.form.tipoCostoPD !== '' && this.form.costoPD) {
        this.$confirm('¿Está seguro de registrar el horario automáticamente? Se creará el programa SEGÚN PROGRAMACIÓN cada hora, todos los días de la semana, con tarifa por ' + (this.form.tipoCostoPD ? this.form.tipoCostoPD : 'PASE') + ', a un costo de ' + (this.form.costoPD ? this.form.costoPD : '100') + ' Bs.', () => {
          this.$service.post(`medios/${this.$storage.get('medio').id}/tipos_medio/${this.idMedioTipoMedioTvRadio}/tarifarios/${this.idTarifarioTvRadio}/detalles/pordefecto`, data)
          .then(response => {
            if (response.detalle) {
              this.$message.success('Programas registrados por defecto correctamente.');
              this.actualizaMedio();
              this.recuperaDetalle();
            }
          }).catch((error) => {
            this.$message.error('No se pudo eliminar los programa del tarifario ' + error);
          });
        });
      } else {
        this.$message.warning('Debe ingresar el monto del tarifario por defecto.');
      }
    }
  },
  watch: {
    'form.semanaCompleta': function () {
      if (this.form.semanaCompleta === true) {
        this.form.intervaloDias = [1, 2, 3, 4, 5, 6, 7];
      }
    }
  },
  directives: {
    debounce
  },
  components: {
    SelectorHoras
  }
};
</script>

<style type="text/css">

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
	background-color: #f7f7f7;
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
