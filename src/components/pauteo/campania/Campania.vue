<template>
  <section>
    <h3 class="primary--text"><v-icon info>perm_camera_mic</v-icon> Campaña </h3>
    <v-card>
      <!-- <v-card-title>
        <h3>Campaña "{{ form.nombre }}"</h3>
      </v-card-title> -->
      <v-card-text>
        <v-toolbar card color="secondary">
          <v-toolbar-title>
            <h3>Información general de la campaña</h3>
          </v-toolbar-title>
        </v-toolbar>
        <v-form ref="form" lazy-validation @submit.prevent="editarCampana">
          <v-card-text>
            <template v-if="flagRecarga === true">
            <v-layout wrap align-center>
              <v-flex xs2>
              </v-flex>
              <v-flex xs8>
                <v-text-field
                  name="nombre"
                  id="nombre"
                  v-model="form.nombre"
                  maxlength="150"
                  hint="Nombre"
                  persistent-hint
                  :rules="$validate(['required'])"
                  required
                  :disabled="!habilitadoEditar"
                ></v-text-field>
              </v-flex>
              <v-flex xs2>
              </v-flex>
            </v-layout>
            <v-layout wrap align-center>
              <v-flex xs1>
              </v-flex>
              <v-flex xs5>
                <v-text-field
                  name="descripcion"
                  id="descripcion"
                  v-model="form.descripcion"
                  maxlength="150"
                  :rules="$validate(['required'])"
                  hint="Descripción / Nombre de Spot"
                  persistent-hint
                  multi-line
                  required
                  auto-grow
                  :disabled="!habilitadoEditar"
                ></v-text-field>
              </v-flex>
              <v-flex xs1>
              </v-flex>
              <v-flex xs4>
                <v-select
                  :items="tiposMedio"
                  v-model="form.tipoMedioEscogido"
                  hint="Tipo de Campaña"
                  persistent-hint
                  single-line
                  item-text="nombre"
                  item-value="id"
                  :rules="$validate(['required'])"
                  required
                  disabled
                ></v-select>
                <!-- <v-text-field
                  name="tipoMedioEscogido"
                  id="tipoMedioEscogido"
                  v-model="form.tipoMedioEscogido"
                  maxlength="150"
                  hint="Tipo de campaña"
                  persistent-hint
                  :rules="$validate(['required'])"
                  required
                  disabled
                ></v-text-field> -->
                <v-text-field
                  name="duracion"
                  id="duracion"
                  v-model="form.duracion"
                  maxlength="150"
                  hint="Duración en segundos"
                  persistent-hint
                  :rules="$validate(['required'])"
                  required
                  :disabled="!habilitadoEditar"
                  v-if="form.tipoMedioEscogido !== 'Prensa Escrita'"
                ></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout wrap align-center>
              <v-flex xs1>
              </v-flex>
              <v-flex xs5>
                <v-menu
                  ref="menu1"
                  :close-on-content-click="false"
                  v-model="menu1"
                  :nudge-right="40"
                  lazy
                  transition="scale-transition"
                  offset-y
                  full-width
                  max-width="290px"
                  min-width="290px"
                >
                  <v-text-field
                    slot="activator"
                    v-model="dateFormattedInicio"
                    hint="Fecha de Inicio"
                    persistent-hint
                    prepend-icon="event"
                    @blur="form.fechaInicio = parseDate(dateFormattedInicio)"
                    :rules="$validate(['required'])"
                    required
                    :disabled="!habilitadoEditar"
                  ></v-text-field>
                  <v-date-picker 
                    v-model="form.fechaInicio" 
                    no-title 
                    @input="menu1 = false"
                    locale="es-bo"
                    :readonly="!habilitadoEditar"
                  ></v-date-picker>
                </v-menu>
              </v-flex>
              <v-flex xs5>
                <v-menu
                  ref="menu2"
                  :close-on-content-click="false"
                  v-model="menu2"
                  :nudge-right="40"
                  lazy
                  transition="scale-transition"
                  offset-y
                  full-width
                  max-width="290px"
                  min-width="290px"
                >
                  <v-text-field
                    slot="activator"
                    v-model="dateFormattedFin"
                    hint="Fecha Fin"
                    persistent-hint
                    prepend-icon="event"
                    @blur="form.fechaFin = parseDate(dateFormattedFin)"
                    :rules="$validate(['required'])"
                    required
                    :disabled="!habilitadoEditar"
                  ></v-text-field>
                  <v-date-picker 
                    v-model="form.fechaFin" 
                    no-title 
                    @input="menu2 = false"
                    locale="es-bo"
                    :readonly="!habilitadoEditar"
                  ></v-date-picker>
                </v-menu>
              </v-flex>
              <v-flex xs1>
              </v-flex>
            </v-layout>
            </template>
          </v-card-text>
          <v-card-actions v-if="tieneMediosSeleccionados === false">
            <v-spacer></v-spacer>
            <v-btn color="info" @click="habilitarEdicion()" v-if="!habilitadoEditar">
              Editar datos generales de la campaña
            </v-btn>
            <v-btn color="info" type="submit" v-if="habilitadoEditar">
              Guardar cambios
            </v-btn>
            <v-btn color="primary" @click="deshabilitarEdicion()" v-if="habilitadoEditar">
              Cancelar
            </v-btn>
          </v-card-actions>
        </v-form>
        <v-toolbar card color="secondary">
          <v-toolbar-title>
            <h3>Cobertura de la campaña</h3>
          </v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <cobertura-campana :campana="idCampana" ></cobertura-campana>
        </v-card-text>
        <div v-if="tieneCobertura">
        <v-toolbar card color="secondary">
          <v-toolbar-title>
            <h3>Medios de comunicación</h3>
          </v-toolbar-title>
        </v-toolbar>
        <v-card-text v-if="tieneMediosSeleccionados === false">
          <medios-disponibles :campana="idCampana" ></medios-disponibles>
        </v-card-text>
        <v-card-text v-if="tieneMediosSeleccionados === true">
          <medios-seleccionados :campana="idCampana" ></medios-seleccionados>
        </v-card-text>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="secondary" @click="guardar()" v-if="tieneMediosSeleccionados === true">
          <v-icon>save</v-icon>
          Guardar
        </v-btn>
        <v-btn color="info" @click="finalizar()" v-if="tieneMediosSeleccionados === true">
          <v-icon>check</v-icon>
          Finalizar
        </v-btn>
      </v-card-actions>
    </v-card>
  </section>
</template>
<script>

import CrudTable from '@/common/util/crud-table/CrudTable.vue';
import validate from '@/common/mixins/validate';
import Campana from './mixins/campania.js';
import CoberturaCampana from './CoberturaCampana.vue';
import MediosDisponibles from './MediosDisponibles.vue';
import MediosSeleccionados from './MediosSeleccionados.vue';
import EventBus from '../../registro/tarifario/bus';

export default {
  mixins: [ validate, Campana ],
  created () {
    if (this.$route.params.idCampana) {
      this.idCampana = this.$route.params.idCampana;
      this.$service.get(`campanas/${this.idCampana}`)
      .then(response => {
        if (response && response.campana && response.campana.data) {
          let campanaEncontrada = response.campana.data;
          this.form.nombre = campanaEncontrada.nombre;
          this.form.descripcion = campanaEncontrada.descripcion;
          this.form.tipoMedioEscogido = campanaEncontrada.tipo_campana.id;
          this.form.fechaInicio = campanaEncontrada.fecha_inicio;
          this.form.fechaFin = campanaEncontrada.fecha_fin;
          this.form.duracion = campanaEncontrada.duracion;
          this.form.id = campanaEncontrada.id;
        }
      });
      this.$service.get('parametros?grupo=TIPO_MEDIO')
      .then(response => {
        if (response && response.rows.length > 0) {
          this.tiposMedio = response.rows.map((elemento) => {
            return ({'id': elemento.id, 'nombre': elemento.nombre, 'estado': elemento.estado});
          }).filter((elemento) => elemento.estado === 'ACTIVO' && !elemento.nombre.includes('Productor') && !elemento.nombre.includes('FM') && !elemento.nombre.includes('AM'));
        }
      });
    } else {
      this.$route.push('/bandejaPauteo');
      this.$message.error('Problemas en la redirección a los datos de la campaña.');
    }
  },
  mounted () {
    EventBus.$on('estaRegistrado', (item) => {
      this.tieneCobertura = item;
    });
    EventBus.$on('tieneMedios', (item) => {
      this.tieneMediosSeleccionados = item;
    });
    // Verifica si ya tiene una selección de medios en la base para evitar mostrar los disponibles
    this.$service.get(`campanas/${this.idCampana}`)
    .then(response => {
      if (response && response.campana && response.campana.data) {
        let campanaEncontrada = response.campana.data;
        // if (campanaEncontrada.coberturas.length > 0) {
        //   this.tieneCobertura = true;
        // }
        if (campanaEncontrada.medios.length > 0) {
          this.tieneMediosSeleccionados = true;
        }
      }
    });
  },
  data () {
    return {
      valid: true,
      campanas: [],
      form: {
        nombre: '',
        descripcion: '',
        fechaInicio: null,
        fechaFin: null,
        tipoMedioEscogido: null,
        duracion: null,
        id: null
      },
      modalCreate: false,
      dateFormattedInicio: null,
      dateFormattedFin: null,
      tiposMedio: [],
      menu1: false,
      menu2: false,
      idCampana: null,
      habilitadoEditar: false,
      mediosDisponibles: 12,
      mediosPreseleccionados: [],
      flagRecarga: true,
      tieneCobertura: false,
      tieneMediosSeleccionados: false
    };
  },
  computed: {
  },
  methods: {
    formatDate (date) {
      if (!date) return null;
      const [year, month, day] = date.split('-');
      return `${day}/${month}/${year}`;
    },
    parseDate (date) {
      if (!date) return null;
      const [month, day, year] = date.split('/');
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    },
    deshabilitarEdicion () {
      this.habilitadoEditar = false;
      this.$service.get(`campanas/${this.idCampana}`)
      .then(response => {
        if (response && response.campana && response.campana.data) {
          let campanaEncontrada = response.campana.data;
          this.form.nombre = campanaEncontrada.nombre;
          this.form.descripcion = campanaEncontrada.descripcion;
          this.form.tipoMedioEscogido = campanaEncontrada.tipo_campana.nombre;
          this.form.fechaInicio = campanaEncontrada.fecha_inicio;
          this.form.fechaFin = campanaEncontrada.fecha_fin;
          this.form.duracion = campanaEncontrada.duracion ? campanaEncontrada.duracion : null;
        }
      });
      this.flagRecarga = false;
      this.$nextTick(() => {
        this.flagRecarga = true;
      });
    },
    habilitarEdicion () {
      this.habilitadoEditar = true;
      this.flagRecarga = false;
      this.$nextTick(() => {
        this.flagRecarga = true;
      });
    },
    editarCampana (form) {
      if (this.$refs.form.validate()) {
        this.$service.put(`campanas/${this.form.id}`,
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
            this.$message.success('La campaña fue modificada correctamente.');
            this.deshabilitarEdicion();
          }
        }).catch((error) => {
          this.$message.error('No se pudo crear la campaña ' + error);
        });
      } else {
        this.$message.error('Por favor verifique que la información haya sido llenada correctamente.');
      }
    }
  },
  components: {
    CrudTable,
    CoberturaCampana,
    MediosDisponibles,
    MediosSeleccionados
  },
  watch: {
    'form.fechaInicio' (val) {
      this.dateFormattedInicio = this.formatDate(this.form.fechaInicio);
    },
    'form.fechaFin' (val) {
      this.dateFormattedFin = this.formatDate(this.form.fechaFin);
    },
    'tieneMediosSeleccionados': function () {
      EventBus.$emit('tieneMedios', this.tieneMediosSeleccionados);
    }
  }
};
</script>
