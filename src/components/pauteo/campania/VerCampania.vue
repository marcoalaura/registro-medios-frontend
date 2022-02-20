<template>
  <section>
    <v-btn flat round color="primary" @click="$router.push('/bandejaPauteo')">
      <v-icon>arrow_back</v-icon> Volver al registro
    </v-btn>
    <h3 class="primary--text"><v-icon info>perm_camera_mic</v-icon> Campaña </h3>
    <v-card>
      <v-card-text>
        <v-toolbar card color="secondary">
          <v-toolbar-title>
            <h3>Información general de la campaña</h3>
          </v-toolbar-title>
        </v-toolbar>
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
                hint="Descripción"
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
        <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="info" type="submit" v-if="habilitadoEditar">
            Guardar cambios
        </v-btn>
        <v-btn color="primary" @click="deshabilitarEdicion()" v-if="habilitadoEditar">
            Cancelar
        </v-btn>
        </v-card-actions>
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
        <v-card-text v-if="tieneMediosSeleccionados === true">
          <ver-medios-seleccionados :campana="idCampana" ></ver-medios-seleccionados>
        </v-card-text>
        </div>
      </v-card-text>
      <v-card-actions v-if="rol===4 && form.estado==='CREADO'">
        <v-spacer></v-spacer>
        <v-btn color="error" @click="modalRechazar=true">
          Rechazar
        </v-btn>
        <v-btn color="warning" @click="observar()">
          Observar
        </v-btn>
        <v-btn color="info" @click="modalAprobar=true">
          Aprobar
        </v-btn>
      </v-card-actions>
    </v-card>


    <v-dialog v-model="modalRechazar" max-width="800px" persistent>
      <v-card>
        <v-card-title>
          <b>Rechazar campaña</b>
        </v-card-title>
        <v-form 
          ref="formR"
          lazy-validation 
          @submit.prevent="rechazar()">
          <v-card-text>
            <v-layout wrap>
              <v-flex xs12>
                <v-text-field
                  name="descripcion"
                  id="descripcion"
                  v-model="formR.descripcion"
                  maxlength="150"
                  :rules="$validate(['required'])"
                  hint="Observación por la cual se esta rechazando la campaña"
                  persistent-hint
                  multi-line
                  required
                  auto-grow
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click.stop="cerrarModalRechazar()">Cerrar</v-btn>
            <v-spacer></v-spacer>
            <v-btn color="info" block type="submit" ><v-icon dark>cancel</v-icon>Rechazar campaña</v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
    <v-dialog v-model="modalAprobar" max-width="800px" persistent>
      <v-card>
        <v-card-title>
          <b>Aprobar campaña</b>
        </v-card-title>
        <v-form 
          ref="formA"
          lazy-validation 
          @submit.prevent="aprobar()">
          <v-card-text>
            <v-layout wrap>
              <v-flex xs6>
                <br><p>Ingrese el correlativo de la campaña:</p>
              </v-flex>
              <v-flex xs6>
                <v-text-field
                  name="correlativo"
                  id="correlativo"
                  v-model="formA.correlativo"
                  maxlength="30"
                  :rules="$validate(['required'])"
                  required
                  auto-grow
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click.stop="cerrarModalAprobar()">Cerrar</v-btn>
            <v-spacer></v-spacer>
            <v-btn color="info" block type="submit" ><v-icon dark>check</v-icon>Aprobar campaña</v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </section>
</template>
<script>

import CrudTable from '@/common/util/crud-table/CrudTable.vue';
import validate from '@/common/mixins/validate';
import Campana from './mixins/campania.js';
import CoberturaCampana from './CoberturaCampana.vue';
import VerMediosSeleccionados from './VerMediosSeleccionados.vue';
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
          this.form.estado = campanaEncontrada.estado;
        }
      });
      this.$service.get('parametros?grupo=TIPO_MEDIO')
      .then(response => {
        if (response && response.rows.length > 0) {
          this.tiposMedio = response.rows.map((elemento) => {
            return ({'id': elemento.id, 'nombre': elemento.nombre, 'estado': elemento.estado});
          }).filter((elemento) => elemento.estado === 'ACTIVO' && !elemento.nombre.includes('Productor'));
        }
      });
    } else {
      this.$route.push('/bandejaPauteo');
      this.$message.error('Problemas en la redirección a los datos de la campaña.');
    }
    this.rol = this.$storage.getUser().id_rol;
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
      rol: null,
      form: {
        nombre: '',
        descripcion: '',
        fechaInicio: null,
        fechaFin: null,
        tipoMedioEscogido: null,
        duracion: null,
        estado: null,
        id: null
      },
      modalRechazar: false,
      formR: {
        descripcion: ''
      },
      modalAprobar: false,
      formA: {
        correlativo: ''
      },
      modalCreate: false,
      dateFormattedInicio: null,
      dateFormattedFin: null,
      tiposMedio: [],
      menu1: false,
      menu2: false,
      idCampana: null,
      habilitadoEditar: false,
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
    cerrarModalRechazar () {
      this.formR.descripcion = '';
      this.modalRechazar = false;
    },
    abrirModalRechazo () {
      this.formR.descripcion = '';
      this.modalRechazar = true;
    },
    rechazar () {
      if (this.$refs.formR.validate()) {
        this.$confirm('¿Está seguro de RECHAZAR la información de la campaña? Considere que no podrá dar un paso atrás posteriormente.', () => {
          this.$service.put(`campanas/${this.idCampana}/estado`, {
            'estado': 'RECHAZADO',
            'mensaje': this.formR.descripcion
          })
          .then((response) => {
            if (response && response.campana) {
              this.$message.success('La campaña fue rechazada correctamente.');
              this.$router.push('/bandejaPauteo');
            }
          }).catch((error) => {
            this.$message.error('No se puede cambiar el estado a la campaña.' + error);
          });
        });
      }
    },
    observar () {
      this.$confirm('¿Está seguro de OBSERVAR la campaña? Quedará en la bandeja del técnico para que solucione el problema.', () => {
        this.$service.put(`campanas/${this.idCampana}/estado`,
          {
            'estado': 'OBSERVADO'
          })
        .then((response) => {
          if (response && response.campana) {
            this.$message.success('La campaña fue observada.');
            this.$router.push('/bandejaPauteo');
          }
        }).catch((error) => {
          this.$message.error('No se puede cambiar el estado a la campaña.' + error);
        });
      });
    },
    cerrarModalAprobar () {
      this.formA.correlativo = null;
      this.modalAprobar = false;
    },
    abrirModalAprobar () {
      this.formA.correlativo = '';
      this.modalAprobar = true;
    },
    aprobar () {
      if (this.$refs.formA.validate()) {
        this.$confirm('¿Está seguro de APROBAR la información de la campaña? Considere que no se podrá dar un paso atrás posterior a esta aprobación.', () => {
          this.$service.put(`campanas/${this.idCampana}/estado`,
            {
              'estado': 'APROBADO',
              'codigo': this.formA.correlativo
            })
          .then((response) => {
            if (response && response.campana) {
              this.$message.success('La campaña fue aprobada correctamente.');
              this.$router.push('/bandejaPauteo');
            }
          }).catch((error) => {
            this.$message.error('No se puede cambiar el estado a la campaña.' + error);
          });
        });
      }
    }
  },
  components: {
    CrudTable,
    CoberturaCampana,
    VerMediosSeleccionados
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
