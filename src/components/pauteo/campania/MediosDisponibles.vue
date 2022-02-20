<template>
  <section>
    <v-card-text>
      <v-container grid-list-md text-xs-center>
        <v-layout row wrap>
          <v-flex v-for="item in mediosDisponibles" :key="`${item.id}`" xs4>
            <v-tooltip top>
              <v-checkbox
                :label="`${item.razon_social}`"
                v-model="mediosPreseleccionados"
                :value="item.id"
                :color="obtieneColor(item)"
                :style="obtieneEstiloColor(item)"
                hide-details
                slot="activator"
                :disabled="!item.cumple_afps"
              ></v-checkbox>
              <span>Observaciones: <b>- {{!item.cumple_afps ? 'No tiene AFPs al día' : 'Tiene APFs'}}
                <br> - Clasificación -> {{item.clasificacion !== 'EN_EVALUACION' ? item.clasificacion : 'EVALUACIÓN'}}
                <br> - Cobertura -> {{item.misma_cobertura ? 'Cobertura exacta' : 'Cobertura parcial'}} </b>
              </span>
            </v-tooltip>
          </v-flex> 
        </v-layout>
      </v-container>
    </v-card-text>
    <v-card-actions v-if="mediosDisponibles.length > 0">
      <v-spacer></v-spacer>
      <v-btn color="info" @click="seleccionarMedios()">
        Finalizar la selección
      </v-btn>
    </v-card-actions>
    <span v-if="mediosDisponibles.length <= 0">
      No existen medios activos
    </span>
  </section>
</template>
<script>

import CrudTable from '@/common/util/crud-table/CrudTable.vue';
import validate from '@/common/mixins/validate';
import Campana from './mixins/campania.js';
import dateFormat from 'dateformat';
import EventBus from '../../registro/tarifario/bus';

export default {
  mixins: [ validate, Campana ],
  created () {
    if (this.$route.params.idCampana) {
      this.idCampana = this.$route.params.idCampana;
      this.$service.get(`campanas/${this.idCampana}/medios_habilitados`)
      .then(response => {
        if (response && response.medios && response.medios.data) {
          this.mediosDisponibles = response.medios.data;
          this.mediosPreseleccionados = this.encuentraPreSeleccionados();
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
      habilitadoEditar: false,
      mediosDisponibles: [],
      mediosPreseleccionados: [],
      flagRecarga: true,
      tieneMedios: false
    };
  },
  methods: {
    encuentraPreSeleccionados () {
      let arrayPreSeleccionado = [];
      this.mediosDisponibles.forEach((elemento) => {
        if (elemento.misma_cobertura && elemento.cumple_afps && elemento.clasificacion === 'REGULAR') {
          arrayPreSeleccionado.push(elemento.id);
        }
      });
      return arrayPreSeleccionado;
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
          this.form.fechaInicio = dateFormat(campanaEncontrada.fecha_inicio, 'yyyy-mm-dd');
          this.form.fechaFin = dateFormat(campanaEncontrada.fecha_fin, 'yyyy-mm-dd');
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
    seleccionarMedios () {
      this.$confirm('¿Está seguro de finalizar la selección de medios? A partir de este momento no podrá adicionar más medios ni cambiar la cobertura de su campaña.', () => {
        this.$service.post(`campanas/${this.idCampana}/medios`,
          {
            'medios': this.mediosPreseleccionados
          })
        .then(response => {
          if (response.medios) {
            this.$message.success('Selección completada correctamente');
            this.tieneMedios = true;
          }
        }).catch((error) => {
          this.$message.error('No se pudo finalizar la selección de medios, inténtelo otra vez ' + error);
        });
      });
    },
    ordenServicio (item) {
      this.$router.push(`/ordenes/${item}`);
    },
    obtieneColor (item) {
      if (!item.cumple_afps) {
        return 'error';
      }
      if (item.cumple_afps && item.clasificacion === 'REGULAR' && item.misma_cobertura) {
        return 'info';
      }
      if (item.clasificacion === 'EVENTUAL') {
        return 'warning';
      }
      if (item.clasificacion === 'EN_EVALUACION') {
        return 'success';
      }
      return 'secondary';
    },
    obtieneEstiloColor (item) {
      if (!item.cumple_afps) {
        return 'background-color: lightpink;';
      }
      if (item.clasificacion === 'REGULAR') {
        return 'background-color: lightblue;';
      }
      if (item.clasificacion === 'EVENTUAL') {
        return 'background-color: khaki;';
      }
      if (item.clasificacion === 'EN_EVALUACION') {
        return 'background-color: lightgreen;';
      }
      return 'background-color: gainsboro;';
    }
  },
  components: {
    CrudTable
  },
  watch: {
    'tieneMedios': function () {
      EventBus.$emit('tieneMedios', this.tieneMedios);
    }
  }
};
</script>
