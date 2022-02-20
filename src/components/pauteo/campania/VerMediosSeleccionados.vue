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
            </td>
            <td class="text-xs-center" v-if="flagTipoPrensa">{{ props.item.ordenes.length > 0 ? obtieneResumenFormato(props.item) : '-' }}</td>
            <td v-if="flagTipoPrensa">{{ props.item.ordenes.length > 0 ? obtieneResumenFormato(props.item) : '-' }}</td>
            <td class="text-xs-center" v-if="flagTipoPrensa">{{ props.item.ordenes.length > 0 ? obtieneResumenEdicion(props.item) : '-' }} <br v-if="obtieneResumenEdicion(props.item) && obtieneResumenFecha(props.item)"> {{ props.item.ordenes.length >0 ? obtieneResumenFecha(props.item) : '' }}</td>
            <td class="text-xs-center" v-if="flagTipoPrensa">{{ props.item.ordenes.length > 0 ? obtieneResumenUbicacion(props.item) : '-' }}</td>
            <td class="text-xs-right" v-if="flagTipoPrensa">{{ props.item.ordenes.length > 0 ? obtieneResumenCosto(props.item) : '-' }}</td>
            <!--para TV radio -->
            <td class="text-xs-right" v-if="!flagTipoPrensa && props.item.ordenes.length > 0">
              <template v-for="resumen in obtieneResumenTarifasTipoSegundo(props.item)">
                <span>{{resumen}}<br></span>
              </template>
            </td>
            <td class="text-xs-right" v-if="!flagTipoPrensa">{{ props.item.ordenes.length > 0 ? duracionCampana : '-' }}</td>
            <td class="text-xs-right" v-if="!flagTipoPrensa && props.item.ordenes.length > 0">
              <template v-for="resumen in obtieneResumenTarifasTipoPase(props.item)">
                <span>{{resumen}}<br></span>
              </template>
            </td>
            <td class="text-xs-right" v-if="!flagTipoPrensa && props.item.ordenes.length > 0">
              <template v-for="resumen in obtieneResumenTarifasTipoPaquete(props.item)">
                <span>{{resumen}}<br></span>
              </template>
            </td>
            <td class="text-xs-right" v-if="!flagTipoPrensa && props.item.ordenes.length > 0">{{ props.item.ordenes.length > 0 ? obtieneResumenPasesDia(props.item).join('-') : '-' }}
            </td>
            <td class="text-xs-right" v-if="!flagTipoPrensa">{{ props.item.ordenes.length > 0 ? obtenerPasesTotal(props.item) : '-' }}</td>
            <td class="text-xs-right" v-if="!flagTipoPrensa && props.item.ordenes.length > 0">
              <template v-for="resumen in obtieneResumenCostoParcial(props.item)">
                <span>{{resumen}}<br></span>
              </template>
            </td>
            <td class="text-xs-right" v-if="!flagTipoPrensa">{{ props.item.ordenes.length > 0 ? obtenerCostoTotal(props.item) : '-' }}</td>
          </tr>
        </template>
        <template slot="no-data">
            No existen datos.
        </template>
      </v-data-table>
      </v-container>
    </v-card-text>
  </section>
</template>
<script>

import CrudTable from '@/common/util/crud-table/CrudTable.vue';
import validate from '@/common/mixins/validate';
import Campana from './mixins/campania.js';
import MediosSeleccionados from './mixins/mediosSeleccionados.js';

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
  data () {
    return {
      valid: true,
      idCampana: null,
      mediosSeleccionados: 11,
      duracionCampana: null,
      flagRecarga: true,
      flagTipoPrensa: false,
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
        { text: 'Medio', value: 'medio' },
        { text: 'Tarifa Segundo', value: 'tarifaSegundo' },
        { text: 'Duración Spot', value: 'duracionSpot' },
        { text: 'Costo Pase', value: 'costoPase' },
        { text: 'Costo Paquete', value: 'costoPaquete' },
        { text: 'Frecuencia', value: 'frecuencia' },
        { text: 'Pases Total', value: 'pasesTotal' },
        { text: 'Costo Parcial', value: 'costoParcial' },
        { text: 'Costo Total', value: 'costo' }
      ],
      pagination: {
        sortBy: 'medio'
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
        idDetalle: null
      },
      menu: false,
      dateFormattedPublicacion: null
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
    CrudTable
  }
};
</script>
