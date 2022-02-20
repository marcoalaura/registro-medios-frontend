<template>
  <section>
    <v-btn flat round color="primary" @click="aRegistro()">
      <v-icon>arrow_back</v-icon> Volver al registro
    </v-btn>
    <v-flex xs12>
      <template v-if="flagCreacion">
        <prensa v-if="idTipoMedioParametrica === 3" :idTarifario="idTarifario" :idMedioTipoMedio="idMedioTipoMedio"></prensa>
        <tv-radio v-if="idTipoMedioParametrica === 1 || idTipoMedioParametrica === 2 || idTipoMedioParametrica === 4 || idTipoMedioParametrica === 5" :idTarifario="idTarifario" :idMedioTipoMedio="idMedioTipoMedio"></tv-radio>
        <productor-ind-tv-radio v-if="idTipoMedioParametrica === 6 || idTipoMedioParametrica === 7 || idTipoMedioParametrica === 8" :idTarifario="idTarifario" :idMedioTipoMedio="idMedioTipoMedio"></productor-ind-tv-radio>
      </template>
    </v-flex>  
    </section>
</template>
<script>

import validate from '@/common/mixins/validate';
import Prensa from './Prensa.vue';
import TvRadio from './TvRadio.vue';
import ProductorIndTvRadio from './ProductorIndTvRadio.vue';
import Tarifario from './mixins/tarifario.js';

export default {
  mixins: [validate, Tarifario],
  created () {
    if (this.$route.params.tipo) {
      this.idTipoMedioParametrica = parseInt(this.$route.params.tipo);
      if (this.$storage.get('medio')) {
        if (this.$storage.get('medio').tipos_medio) {
          let tiposMediosRecuperados = this.$storage.get('medio').tipos_medio;
          let tipoMedioEncontrado = tiposMediosRecuperados.find((elemento) => {
            return elemento.id_tipo_medio === this.idTipoMedioParametrica;
          });
          if (tipoMedioEncontrado) {
            this.idMedioTipoMedio = tipoMedioEncontrado.id;
            this.$service.post(`medios/${this.$storage.get('medio').id}/tipos_medio/${this.idMedioTipoMedio}/tarifarios/`)
            .then((response) => {
              if (response && response.tarifario) {
                this.idTarifario = response.tarifario.data.id;
                this.actualizaMedio();
                this.flagCreacion = false;
                this.$nextTick(() => {
                  this.flagCreacion = true;
                });
              }
            }).catch((error) => {
              this.$message.error('No se pudo crear el tarifario ' + error);
            });
          } else {
            this.$router.push('/registro');
            this.$message.error('No se puede cargar tarifarios para tipos de medio no existentes.');
          }
        }
      }
    }
  },
  mounted () {
    if (this.$route.params.tipo) {
      this.idTipoMedioParametrica = parseInt(this.$route.params.tipo);
      if (this.$storage.get('medio')) {
        if (this.$storage.get('medio').tipos_medio) {
          let tiposMediosRecuperados = this.$storage.get('medio').tipos_medio;
          let tipoMedioEncontrado = tiposMediosRecuperados.find((elemento) => {
            return elemento.id_tipo_medio === this.idTipoMedioParametrica;
          });
          if (tipoMedioEncontrado) {
            this.idMedioTipoMedio = tipoMedioEncontrado.id;
            if (tipoMedioEncontrado.tarifario) {
              let idTarifarioEncontrado = tipoMedioEncontrado.tarifario.id;
              this.$service.get(`medios/${this.$storage.get('medio').id}/tipos_medio/${this.idMedioTipoMedio}/tarifarios/${idTarifarioEncontrado}`)
              .then((response) => {
                if (response && response.tarifario) {
                  this.idTarifario = response.tarifario.data.id;
                  this.actualizaMedio();
                }
              }).catch((error) => {
                this.$message.error('No se encontró el tarifario ' + error);
              });
            }
          } else {
            this.$router.push('/registro');
            this.$message.error('No se encontró el tarifario.');
          }
        }
      }
    }
  },
  data () {
    return {
      idTarifario: null,
      idTipoMedio: null,
      idTipoMedioParametrica: null,
      tipos_medio: this.tipos_medio,
      flagCreacion: false
    };
  },
  components: {
    Prensa,
    TvRadio,
    ProductorIndTvRadio
  },
  methods: {
    aRegistro () {
      this.$router.push('/registro');
    }
  }
};
</script>