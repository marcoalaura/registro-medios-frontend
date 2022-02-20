<template>
  <section>
    <v-card-text>
      <v-container grid-list-md text-xs-center>
        <v-data-table
        v-model="ordenes"
        :headers="headers"
        :items="ordenes"
        :pagination.sync="pagination"
        item-key="id"
        class="elevation-1"
      >
        <template slot="headers" slot-scope="props">
          <tr>
            <th
              v-for="header in props.headers"
              :key="header.text"
              :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']"
              @click="changeSort(header.value)"
            >
              <v-icon small>arrow_upward</v-icon>
              {{ header.text }}
            </th>
          </tr>
        </template>
        <template slot="items" slot-scope="props">
          <tr>
            <td class="text-xs-center">
              {{ props.index +1 }}
            </td>
            <td>
              {{ props.item.medio.razon_social }}
              <v-tooltip top>
                <v-btn slot="activator" flat icon color="info" @click.stop="ordenServicio(props.item.id)" v-if="!props.item.ordenes.length > 0">
                  <v-icon>add</v-icon>
                </v-btn>
                <span>CREAR ORDEN DE PUBLICIDAD</span>
              </v-tooltip>
              <v-tooltip top>
                <v-btn slot="activator" flat icon color="secondary" @click.stop="cargaEditarOrdenServicio(props.item)" v-if="props.item.ordenes.length > 0">
                  <v-icon>edit</v-icon>
                </v-btn>
                  <span>EDITAR ORDEN</span>
              </v-tooltip>
              <v-tooltip top>
                <v-btn slot="activator" flat icon color="error" @click.stop="deleteOrdenServicioAll(props.item.id)" v-if="props.item.ordenes.length > 0">
                  <v-icon>delete</v-icon>
                </v-btn>
                  <span>ELIMINAR MEDIO DE LA CAMPAÑA</span>
              </v-tooltip>
            </td>
            <td class="text-xs-center" v-if="flagTipoPrensa">{{ props.item.ordenes.length > 0 ? obtieneResumenFormato(props.item) : '-' }}</td>
            <td v-if="flagTipoPrensa">{{ props.item.ordenes.length > 0 ? obtieneResumenFormato(props.item) : '-' }}</td>
            <td class="text-xs-center" v-if="flagTipoPrensa">{{ props.item.ordenes.length > 0 ? obtieneResumenEdicion(props.item) : '-' }} <br v-if="obtieneResumenEdicion(props.item) && obtieneResumenFecha(props.item)"> {{ props.item.ordenes.length >0 ? obtieneResumenFecha(props.item) : '' }}</td>
            <td class="text-xs-center" v-if="flagTipoPrensa">{{ props.item.ordenes.length > 0 ? obtieneResumenUbicacion(props.item) : '-' }}</td>
            <td class="text-xs-right" v-if="flagTipoPrensa">{{ props.item.ordenes.length > 0 ? obtieneResumenCosto(props.item) : '-' }}</td>
            <!--para TV radio -->
            <td class="text-xs-right" v-if="!flagTipoPrensa && props.item.ordenes.length > 0">
              <template v-for="resumen in obtieneResumenTarifasTipoSegundo(props.item)">
                <span :key="`a${resumen}`">{{resumen}}<br></span>
              </template>
            </td>
            <td class="text-xs-right" v-if="!flagTipoPrensa">{{ props.item.ordenes.length > 0 ? duracionCampana : '-' }}</td>
            <td class="text-xs-right" v-if="!flagTipoPrensa && props.item.ordenes.length > 0">
              <template v-for="resumen in obtieneResumenTarifasTipoPase(props.item)">
                <span :key="`b${resumen}`">{{resumen}}<br></span>
              </template>
            </td>
            <td class="text-xs-right" v-if="!flagTipoPrensa && props.item.ordenes.length > 0">
              <template v-for="resumen in obtieneResumenTarifasTipoPaquete(props.item)">
                <span :key="`c${resumen}`">{{resumen}}<br></span>
              </template>
            </td>
            <td class="text-xs-right" v-if="!flagTipoPrensa && props.item.ordenes.length > 0">{{ props.item.ordenes.length > 0 ? frecuenciaPases(props.item).join('-') : '-' }}
              <!-- <template v-for="resumen in obtieneResumenPases(props.item)">
                <span>{{resumen}}<br></span>
              </template> -->
            </td>
            <td class="text-xs-right" v-if="!flagTipoPrensa">{{ props.item.ordenes.length > 0 ? obtenerPasesTotal(props.item) : '-' }}</td>
            <!-- <td class="text-xs-right" v-if="!flagTipoPrensa && props.item.ordenes.length > 0">
              <template v-for="resumen in obtieneResumenCostoParcial(props.item)">
                <span>{{resumen}}<br></span>
              </template>
            </td> -->
            <td class="text-xs-right" v-if="!flagTipoPrensa">{{ props.item.ordenes.length > 0 ? obtenerCostoTotal(props.item) : '-' }}</td>
          </tr>
        </template>
        <!-- <template slot="footer">
          <td colspan="80%">
            <strong>Total: </strong>
          </td>
        </template> -->
        <template slot="no-data">
            No existen datos.
        </template>
      </v-data-table>
      </v-container>
    </v-card-text>
    <!-- <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="info" @click="finalizar()">
        Finalizar
      </v-btn>
    </v-card-actions> -->
    <v-dialog v-model="modalEditarPrensa" max-width="500px" persistent>
      <v-card>
        <v-form ref="form" lazy-validation @submit.prevent="editarOrdenServicio">
          <v-container grid-list-md>
            <v-card>
              <v-card-text>
                <h4>Editar Orden de Publicidad</h4>
              </v-card-text>
              <v-card-text>
                <v-layout wrap align-center>
                  <v-flex xs6>
                    <v-text-field
                      name="nombre"
                      hint = "Arte/Separata"
                      persistent-hint
                      id="nombre"
                      v-model="form.nombre"
                      maxlength="150"
                      :rules="$validate(['required'])"
                      required
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs6>
                    <v-card-text>
                      <v-text-field
                        name="edicion"
                        hint = "Edición"
                        persistent-hint=""
                        id="edicion"
                        v-model="form.edicion"
                        maxlength="150"
                      ></v-text-field>
                      <v-menu
                        ref="menu"
                        :close-on-content-click="false"
                        v-model="menu"
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
                          v-model="dateFormattedPublicacion"
                          hint="Fecha de publicación"
                          persistent-hint
                          prepend-icon="event"
                          @blur="form.fechaPublicacion = parseDate(dateFormattedPublicacion)"
                        ></v-text-field>
                        <v-date-picker 
                          v-model="form.fechaPublicacion" 
                          no-title 
                          @input="menu = false"
                          locale="es-bo"
                        ></v-date-picker>
                      </v-menu>
                    </v-card-text>
                  </v-flex>
                </v-layout>
                <v-layout wrap align-center>
                  <v-flex xs6>
                    <v-card-text>
                      <v-text-field
                        name="formato"
                        hint = "Formato"
                        persistent-hint
                        id="formato"
                        v-model="form.formato"
                        maxlength="150"
                        :rules="$validate(['required'])"
                        required
                      ></v-text-field>
                    </v-card-text>
                  </v-flex>
                  <v-flex xs6>
                    <v-card-text>
                      <v-text-field
                        name="ubicacion"
                        hint = "Ubicación"
                        persistent-hint
                        id="ubicacion"
                        v-model="form.ubicacion"
                        maxlength="150"
                        :rules="$validate(['required'])"
                        required
                      ></v-text-field>
                    </v-card-text>
                  </v-flex>
                </v-layout>
                <v-layout wrap align-center>
                  <v-flex xs6>
                    <v-flex xs9>
                      <v-text-field
                        name="costo"
                        id="costo"
                        prefix="Bs"
                        maxlength="9"
                        :rules="$validate(['required'])"
                        v-model="form.costo"
                        required
                      ></v-text-field>
                    </v-flex>
                  </v-flex>
                </v-layout>
                <v-card-actions>
                  <v-btn color="primary" @click.stop="modalEditarPrensa=false">Cancelar</v-btn>
                  <v-spacer></v-spacer>
                  <v-btn dark color="info" type="submit">
                    <v-icon dark>check</v-icon>guardar cambios
                  </v-btn>
                </v-card-actions>
              </v-card-text>
            </v-card>
          </v-container>
        </v-form>
      </v-card>
    </v-dialog>
     <v-dialog v-model="modalEditarTvRadio" persistent>
      <v-card>
        <v-container>
          Editar Orden de Publicidad
          <v-layout row>
            <v-flex xs12>
              <v-card-text>
                <v-select
                  label="Tipo Medio"
                  :items="tiposMediosPosibles"
                  v-model="idMedioTipoMedioEditar"          
                >
                </v-select>
              </v-card-text>
            </v-flex>
          </v-layout>
        </v-container>
        <v-card-text>
          <template v-if="flagCreacion">
          <tv-radio-orden
            :idTarifario="idTarifarioEditar"
            :idCampanaMedio="idCampanaMedioEditar"
            :idMedio="idMedioEditar"
            :idCampana="idCampanaEditar"
            :idMedioTipoMedio="idMedioTipoMedioEditar"
            :editar="flagEditar"
            :ordenesGuardadas="pasesGuardados"
          ></tv-radio-orden>
      </template>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click.stop="modalEditarTvRadio=false">Cancelar</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
     </v-dialog>
  </section>
</template>
<script>

import CrudTable from '@/common/util/crud-table/CrudTable.vue';
import validate from '@/common/mixins/validate';
import Campana from './mixins/campania.js';
import MediosSeleccionados from './mixins/mediosSeleccionados.js';
import TvRadioOrden from './TvRadioOrden.vue';
import EventBus from '../../registro/tarifario/bus';
// import dateFormat from 'dateformat';

export default {
  mixins: [ validate, Campana, MediosSeleccionados ],
  created () {
    if (this.$route.params.idCampana) {
      this.idCampana = this.$route.params.idCampana;
      this.$service.get(`campanas/${this.idCampana}`)
      .then(response => {
        if (response && response.campana && response.campana.data) {
          let campanaEncontrada = response.campana.data;
          this.duracionCampana = parseInt(campanaEncontrada.duracion);
          this.tipoCampanaParam = campanaEncontrada.tipo_campana.id;
          if (campanaEncontrada.medios.length > 0) {
            this.$service.get(`campanas/${this.idCampana}/medios`)
            .then(response => {
              if (response && response.medios) {
                this.ordenes = response.medios.data;
              }
            });
            if (campanaEncontrada.tipo_campana.id !== 3) {
              this.headers = this.headersTvRadio;
              this.flagTipoPrensa = false;
            } else {
              this.headers = this.headersPrensa;
              this.flagTipoPrensa = true;
            }
          }
        }
      });
    } else {
      this.$route.push('/bandejaPauteo');
      this.$message.error('Problemas en la redirección a los datos de la campaña.');
    }
  },
  mounted () {
    EventBus.$on('edito', (item) => {
      this.modalEditarTvRadio = false;
      this.$service.get(`campanas/${this.idCampana}/medios`)
      .then(response => {
        if (response && response.medios) {
          this.ordenes = response.medios.data;
        }
      });
    });
  },
  data () {
    return {
      valid: true,
      flagEditar: true,
      pasesGuardados: [],
      idCampana: null,
      duracionCampana: null,
      mediosSeleccionados: 11,
      flagRecarga: true,
      flagTipoPrensa: false,
      tipoCampanaParam: null,
      ordenes: [],
      headers: [],
      headersPrensa: [
        { text: 'Nro.', value: 'numero' },
        { text: 'Medio', value: 'medio' },
        { text: 'Especificaciones', value: 'especificaciones' },
        { text: 'Arte/Separata', value: 'arte' },
        { text: 'Difusión', value: 'difusion' },
        { text: 'Ubicación', value: 'ubicacion' },
        { text: 'Costo', value: 'costo' }
      ],
      headersTvRadio: [
        { text: 'Nro.', value: 'numero' },
        { text: 'Medio', value: 'medio.razon_social' },
        { text: 'Tarifa Segundo', value: 'tarifaSegundo' },
        { text: 'Duración Spot', value: 'duracionSpot' },
        { text: 'Costo Pase', value: 'costoPase' },
        { text: 'Costo Paquete', value: 'costoPaquete' },
        { text: 'Frecuencia', value: 'frecuencia' },
        { text: 'Pases Total', value: 'pasesTotal' },
        // { text: 'Costo Parcial', value: 'costoParcial' },
        { text: 'Costo Total', value: 'costo' }
      ],
      pagination: {
        sortBy: 'medio.razon_social'
      },
      modalEditarPrensa: false,
      modalEditarTvRadio: false,
      form: {
        descripcion: null,
        costo: null,
        fechaPublicacion: null,
        edicion: null,
        nombre: null,
        formato: null,
        ubicacion: null,
        idDetalle: null,
        item: null
      },
      menu: false,
      dateFormattedPublicacion: null,
      idTarifarioEditar: null,
      idCampanaMedioEditar: null,
      idMedioEditar: null,
      idCampanaEditar: null,
      idMedioTipoMedioEditar: null,
      flagCreacion: false,
      arrayOrdenes: [],
      tiposMediosPosibles: [],
      listadoOrdenes: [
        { value: 1, text: 'Orden #1' },
        { value: 2, text: 'Orden #2' },
        { value: 3, text: 'Orden #3' }
      ]
    };
  },
  computed: {
  },
  methods: {
    changeSort (column) {
      if (this.pagination.sortBy === column) {
        this.pagination.descending = !this.pagination.descending;
      } else {
        this.pagination.sortBy = column;
        this.pagination.descending = false;
      }
    },
    formatDate (date) {
      if (!date) return null;
      const [year, month, day] = date.split('-');
      return `${day}/${month}/${year}`;
    },
    parseDate (date) {
      if (!date) return null;
      const [month, day, year] = date.split('/');
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
  },
  components: {
    CrudTable,
    TvRadioOrden
  },
  watch: {
    'form.fechaPublicacion' (val) {
      this.dateFormattedPublicacion = this.formatDate(this.form.fechaPublicacion);
    },
    'idMedioTipoMedioEditar': function (nuevoValor, antiguoValor) {
      if (antiguoValor !== nuevoValor) {
        let idTarifarioEncontrado = this.tiposMediosPosibles.find((elemento) => {
          if (elemento.value === this.idMedioTipoMedioEditar) {
            return elemento;
          }
        });
        if (idTarifarioEncontrado) {
          this.idTarifarioEditar = idTarifarioEncontrado.id_tarifario;
        }
        this.flagCreacion = false;
        this.$nextTick(() => {
          this.flagCreacion = true;
        });
      }
    }
  }
};
</script>
