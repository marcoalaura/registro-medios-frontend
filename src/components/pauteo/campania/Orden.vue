<template>
  <section>
    <v-btn flat round color="primary" @click="aCampana()">
      <v-icon>arrow_back</v-icon> Volver a la campaña
    </v-btn>
    <v-card>
    <v-container>
      <v-layout row>
        <v-flex xs4>
          <v-card-text>
            Campaña: {{ nombreCampana }}
          </v-card-text>
        </v-flex>
        <v-flex xs4>
          <v-card-text>
            Medio: {{ razonSocialMedio }}
          </v-card-text>
        </v-flex>          
        <v-flex xs2>
          <v-card-text>
            <v-select
              label="Tipo Medio"
              :items="tiposMediosPosibles"
              v-model="idMedioTipoMedio"          
            >
            </v-select>
          </v-card-text>
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex xs10>
          <v-card-text>
            <v-select
              :items="contactos"
              v-model="contactoElegido"
              hint="Representante o Contacto"
              persistent-hint
              single-line
              item-text="persona.nombre_completo"
              item-value="id"
              required
            ></v-select>
          </v-card-text>
        </v-flex>
      </v-layout>
    </v-container>
    <v-flex xs12>
      <template>
        <prensa-escrita-orden
          v-if="idTipoCampanaParam === 3 && flagCreacion"
          :idTarifario="idTarifario"
          :idCampanaMedio="idCampanaMedio"
          :idMedio="idMedio"
          :idCampana="idCampana"
          :idMedioTipoMedio="idMedioTipoMedio"
        ></prensa-escrita-orden>
        <tv-radio-orden
          v-if="idTipoCampanaParam !== 3 && flagCreacion"
          :idTarifario="idTarifario"
          :idCampanaMedio="idCampanaMedio"
          :idMedio="idMedio"
          :idCampana="idCampana"
          :idMedioTipoMedio="idMedioTipoMedio"
        ></tv-radio-orden>
      </template>
    </v-flex>
    <v-container>
      <v-layout row>
        <v-flex xs10>
          <v-card-text>
            <v-text-field
              label="Observaciones"
              name="observacion"
              id="observacion"
              v-model="observacion"
              maxlength="250"
              textarea
              multi-line
              auto-grow
              :counter="250"
            ></v-text-field>
          </v-card-text>
        </v-flex>
      </v-layout>
    </v-container>
    </v-card>
  </section>
</template>
<script>

import PrensaEscritaOrden from './PrensaEscritaOrden.vue';
import TvRadioOrden from './TvRadioOrden.vue';
import Campania from './mixins/campania.js';

export default {
  mixins: [Campania],
  created () {
    if (this.$route.params.idCampanaMedio && this.$route.params.idCampanaMedio) {
      this.idCampanaMedio = parseInt(this.$route.params.idCampanaMedio);
      this.idCampana = parseInt(this.$route.params.idCampana);
      this.$service.get(`campanas/${this.idCampana}`)
      .then(response => {
        if (response && response.campana && response.campana.data) {
          let campanaEncontrada = response.campana.data;
          this.nombreCampana = campanaEncontrada.nombre;
          this.idTipoCampanaParam = campanaEncontrada.tipo_campana.id;
        }
      });
      this.$service.get(`campanas/${this.idCampana}/medios/${this.idCampanaMedio}`)
        .then(response => {
          if (response && response.campanaMedio && response.campanaMedio.data) {
            this.idMedio = response.campanaMedio.data.id_medio;
            this.contactoElegido = response.campanaMedio.data.id_referencia;
            this.observacion = response.campanaMedio.data.observacion;
            this.$service.get(`medios/${this.idMedio}`)
            .then((response) => {
              if (response && response.medio) {
                let medioEncontrado = response.medio.data;
                this.razonSocialMedio = medioEncontrado.razon_social;
                this.contactos = medioEncontrado.referencias;
                this.contactos.push(medioEncontrado.representante_legal);
                if (medioEncontrado.tipos_medio.length > 0) {
                  let tiposMediosRecuperados = medioEncontrado.tipos_medio;
                  let tipoMedioEncontrado = tiposMediosRecuperados.find((elemento) => {
                    if (elemento.id_tipo_medio === 1 && this.idTipoCampanaParam === 1) {
                      return elemento;
                    }
                    if (elemento.id_tipo_medio === 4 && this.idTipoCampanaParam === 2) {
                      return elemento;
                    }
                    if (elemento.id_tipo_medio === 5 && this.idTipoCampanaParam === 2) {
                      return elemento;
                    }
                    if (elemento.id_tipo_medio === 6 && this.idTipoCampanaParam === 1) {
                      return elemento;
                    }
                    if (elemento.id_tipo_medio === 7 && this.idTipoCampanaParam === 2) {
                      return elemento;
                    }
                    if (elemento.id_tipo_medio === 8 && this.idTipoCampanaParam === 2) {
                      return elemento;
                    }
                    return elemento.id_tipo_medio === this.idTipoCampanaParam;
                  });
                  // Se puede tener dos tipos de tarifarios en Radio
                  if (this.idTipoCampanaParam === 2) {
                    this.tiposMediosPosibles = tiposMediosRecuperados.map((elemento) => {
                      return ({'value': elemento.id, 'text': elemento.nombre, 'id_tipo_medio': elemento.id_tipo_medio, 'id_tarifario': elemento.tarifario.id});
                    }).filter((elemento) => (elemento.id_tipo_medio === 4 || elemento.id_tipo_medio === 5 || elemento.id_tipo_medio === 7 || elemento.id_tipo_medio === 8));
                  } else {
                    this.tiposMediosPosibles = tiposMediosRecuperados.map((elemento) => {
                      return ({'value': elemento.id, 'text': elemento.nombre, 'id_tipo_medio': elemento.id_tipo_medio, 'id_tarifario': elemento.tarifario.id});
                    }).filter((elemento) => (elemento.id_tipo_medio === this.idTipoCampanaParam));
                  }
                  if (tipoMedioEncontrado) {
                    this.idMedioTipoMedio = tipoMedioEncontrado.id;
                    if (tipoMedioEncontrado.tarifario) {
                      this.idTarifario = tipoMedioEncontrado.tarifario.id;
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
        }).catch((error) => {
          this.$message.error('No se pudo obtener la información solicitada. ' + error);
        });
      // termina la asignación de datos
    }
  },
  mounted () {
  },
  data () {
    return {
      idTarifario: null,
      idTipoCampanaParam: null,
      flagCreacion: false,
      idCampanaMedio: null,
      idCampana: null,
      idMedio: null,
      idMedioTipoMedio: null,
      nombreCampana: null,
      razonSocialMedio: null,
      fechaActual: null,
      contactoElegido: null,
      contactos: [],
      observacion: null,
      tiposMediosPosibles: [],
      listadoOrdenes: [
        { value: 1, text: 'Orden #1' },
        { value: 2, text: 'Orden #2' }
      ]
    };
  },
  components: {
    PrensaEscritaOrden,
    TvRadioOrden
  },
  methods: {
    aCampana () {
      this.$router.push(`/campana/${this.idCampana}`);
    }
  },
  watch: {
    'contactoElegido': function (nuevoValor, antiguoValor) {
      if (this.contactoElegido === null) {
        this.$message.error('Debe elegir a un Representanto o contacto.');
      } else {
        nuevoValor = this.contactoElegido;
        this.$service.get(`campanas/${this.idCampana}/medios/${this.idCampanaMedio}`)
        .then(response => {
          if (response && response.campanaMedio && response.campanaMedio.data) {
            antiguoValor = response.campanaMedio.data.id_referencia;
            if (parseInt(antiguoValor) !== parseInt(nuevoValor)) {
              this.$service.put(`campanas/${this.idCampana}/medios/${this.idCampanaMedio}`,
                {
                  'id_referencia': nuevoValor
                })
              .then((response) => {
                if (response && response.campanaMedio) {
                  this.$message.success('El contacto de coordinación fue elegido correctamente.');
                }
              }).catch((error) => {
                this.$message.error('Problemas al almacenar al contacto comercial ' + error);
              });
            }
          }
        }).catch((error) => {
          this.$message.error('No se pudo obtener la información solicitada.' + error);
        });
      }
    },
    'observacion': function (nuevoValor, antiguoValor) {
      nuevoValor = this.observacion;
      this.$service.get(`campanas/${this.idCampana}/medios/${this.idCampanaMedio}`)
      .then(response => {
        if (response && response.campanaMedio && response.campanaMedio.data) {
          antiguoValor = response.campanaMedio.data.observacion;
          if (antiguoValor !== nuevoValor) {
            this.$service.put(`campanas/${this.idCampana}/medios/${this.idCampanaMedio}`,
              {
                'observacion': nuevoValor
              })
            .then((response) => {
              if (response && response.campanaMedio) {
              }
            }).catch((error) => {
              this.$message.error('Problemas al almacenar la observación ' + error);
            });
          }
        }
      }).catch((error) => {
        this.$message.error('No se pudo obtener la información solicitada.' + error);
      });
    },
    'idMedioTipoMedio': function (nuevoValor, antiguoValor) {
      if (antiguoValor !== nuevoValor) {
        let idTarifarioEncontrado = this.tiposMediosPosibles.find((elemento) => {
          if (elemento.value === this.idMedioTipoMedio) {
            return elemento;
          }
        });
        if (idTarifarioEncontrado) {
          this.idTarifario = idTarifarioEncontrado.id_tarifario;
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