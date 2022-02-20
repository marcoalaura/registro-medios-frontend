<template>
  <v-container fluid px-0>
    <template v-if="!estaRegistrado">
      <v-container fluid px-0>
        <v-form
          ref="form"
          lazy-validation
          @submit.prevent="guardarCobertura">
          <v-layout row wrap align-center>
            <v-flex xs6>
              <v-radio-group v-model="tipoCobertura">
                <v-radio
                  label="Nacional (Cobertura en los 9 departamentos)"
                  value="NACIONAL"
                ></v-radio>
                <v-radio
                  label="Departamental"
                  value="DEPARTAMENTAL"
                ></v-radio>
                <v-radio
                  label="Provincial"
                  value="PROVINCIAL"
                ></v-radio>
                <v-radio
                  label="Municipal"
                  value="MUNICIPAL"
                ></v-radio>
              </v-radio-group>
              <!-- seleccionar departamento cuando es cobertura departamental -->
              <v-layout row wrap v-if="tipoCobertura === 'DEPARTAMENTAL'">
                <v-flex xs1 >
                </v-flex>
                <v-flex xs12 sm6>
                  <v-select
                    label="Selecione el/los departamento(s)"
                    :items="departamentos"
                    item-text="nombre"
                    item-value="id"
                    v-model="departamentosSeleccionados"
                    multiple
                    close
                    persistent-hint
                    required
                  >
                    <template slot="selection" slot-scope="data">
                      <v-chip
                        close
                        @input="remove(data.item)"
                        :selected="data.selected"
                      >
                        <span>{{ data.item.nombre }}</span>&nbsp;
                      </v-chip>
                    </template>
                  </v-select>
                </v-flex>
              </v-layout>
              <!-- seleccionar departamento y provincia cuando es cobertura provincial -->
              <v-layout row wrap v-if="tipoCobertura === 'PROVINCIAL'">
                <v-flex xs1 >
                </v-flex>
                <v-flex xs4>
                  <v-select
                    :items="departamentos"
                    v-model="departamentoSeleccionado"
                    label="Departamento"
                    class="input-group--focused"
                    item-text="nombre"
                    item-value="id"
                    hint="Departamento en el cual se encuentra(n) su(s) provincia(s)"
                    persistent-hint
                    required
                  ></v-select>
                </v-flex>
                <v-flex xs1 >
                </v-flex>
                <v-flex xs5>
                  <v-select
                    v-if="provincias && departamentoSeleccionado"
                    :items="provincias"
                    v-model="provinciasSeleccionadas"
                    label="Provincia(s)"
                    class="input-group--focused"
                    item-text="nombre"
                    item-value="id"
                    autocomplete
                    multiple
                    chips
                    required
                  ></v-select>
                </v-flex>
                <v-flex xs1 >
                </v-flex>
              </v-layout>
              <!-- seleccionar departamento, provincia y municipios cuando es cobertura municipal -->
              <v-layout row wrap v-if="tipoCobertura === 'MUNICIPAL'">
                <v-flex xs1 >
                </v-flex>
                <v-flex xs3>
                  <v-select
                    :items="departamentos"
                    v-model="departamentoSeleccionado"
                    label="Departamento"
                    class="input-group--focused"
                    item-text="nombre"
                    item-value="id"
                    hint="Departamento en el cual se encuentra la provincia"
                    persistent-hint
                    required
                  ></v-select>
                </v-flex>
                <v-flex xs4>
                  <v-select
                    v-if="provincias && departamentoSeleccionado"
                    :items="provincias"
                    v-model="provinciaSeleccionada"
                    label="Provincia"
                    class="input-group--focused"
                    item-text="nombre"
                    item-value="id"
                    hint="Provincia en la cual se encuentra(n) su(s) municipio(s)"
                    persistent-hint
                    required
                  ></v-select>
                </v-flex>
                <v-flex xs4>
                  <v-select
                    v-if="municipios && provinciaSeleccionada && departamentoSeleccionado"
                    :items="municipios"
                    v-model="municipiosSeleccionados"
                    label="Municipio"
                    class="input-group--focused"
                    item-text="nombre"
                    item-value="id"
                    required
                    autocomplete
                    multiple
                    chips
                  ></v-select>
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex xs2>
            </v-flex>
            <v-flex xs4>
              <v-btn color="info" block type="submit" :disabled="!(tipoCobertura === 'NACIONAL' || (tipoCobertura === 'DEPARTAMENTAL' && departamentosSeleccionados.length > 0) || (tipoCobertura === 'PROVINCIAL' && provinciasSeleccionadas.length > 0) || (tipoCobertura === 'MUNICIPAL' && municipiosSeleccionados.length > 0))" ><v-icon dark>check</v-icon>Guardar cobertura</v-btn>
            </v-flex>
          </v-layout>
        </v-form>
      </v-container>
    </template>
    <template v-if="estaRegistrado">
      <v-container fluid px-0>
        <v-layout row wrap>
          <v-flex xs6> 
            <b>Cobertura:</b> {{ cobertura }} 
          </v-flex>
          <v-flex xs6> 
            <v-btn color="info" @click="estaRegistrado=false" v-show="estadoMedio === 'PENDIENTE'"><v-icon dark>autorenew</v-icon>Cambiar cobertura</v-btn>
          </v-flex>
          <v-flex xs12 v-if="cobertura === 'DEPARTAMENTAL'"> 
            <b>Departamentos:</b> {{ nombresDpas ? nombresDpas.join(', ') : '' }} 
          </v-flex>
          <v-flex xs12 v-if="cobertura === 'PROVINCIAL'"> 
            <b>Provincias:</b> {{ nombresDpas ? nombresDpas.join(', ') : '' }} 
          </v-flex>
          <v-flex xs12 v-if="cobertura === 'MUNICIPAL'"> 
            <b>Municipios:</b> {{ nombresDpas ? nombresDpas.join(', ') : '' }} 
          </v-flex>
        </v-layout>
      </v-container>
    </template>
  </v-container>
</template>
<script>
import Registro from './mixins/registro';

export default {
  mixins: [ Registro ],
  props: {
    tipoMedio: {
      type: Number,
      default: 0
    },
    otro: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      nombresDpas: [],
      cobertura: '',
      idMedioTipoMedio: null,
      tipoMedioRegistrado: [],
      estaRegistrado: false,
      estadoMedio: '',
      tipoCobertura: null,
      departamentos: null,
      provincias: null,
      municipios: null,
      departamentosSeleccionados: [],
      provinciasSeleccionadas: [],
      departamentoSeleccionado: null,
      provinciaSeleccionada: null,
      municipiosSeleccionados: [],
      municipioSeleccionado: null
    };
  },
  created () {
    this.cargarDepartamentos();

    // Consulta si ya se ha registrado la cobertura
    let tiposMediosGenerados = this.$storage.get('medio').tipos_medio;
    if (this.$storage.get('medio').tipos_medio.length > 0) {
      this.estadoMedio = this.$storage.get('medio').estado;
      this.tipoMedioRegistrado = tiposMediosGenerados.find((elemento) => {
        return elemento.id_tipo_medio === this.tipoMedio;
      });

      if (this.tipoMedioRegistrado) {
        if (this.tipoMedioRegistrado.coberturas.length > 0) {
          this.estaRegistrado = true;
          this.cobertura = this.tipoMedioRegistrado.tipo_cobertura;
          this.tipoMedioRegistrado.coberturas.forEach((item, index) => {
            this.nombresDpas.push(item.dpa.nombre);
          });
        };
      };
    }
  },
  methods: {
    actualizaMedio () {
      this.$service.get('medios/' + this.$storage.get('medio').id)
      .then(response => {
        if (response.medio && response.medio.data) {
          this.$storage.set('medio', response.medio.data);
        }
      }).catch(() => {
        this.message.error('No se pudo actualizar los valores del Medio');
      });
    },
    guardarCobertura () {
      const medio = this.$storage.get('medio');
      if (this.tipoMedio) {
        if (this.$storage.get('medio')) {
          if (this.$storage.get('medio').tipos_medio.length > 0) {
            let tiposMediosRecuperados = this.$storage.get('medio').tipos_medio;
            let tipoMedioEncontrado = tiposMediosRecuperados.find((elemento) => {
              return elemento.id_tipo_medio === this.tipoMedio;
            });
            if (tipoMedioEncontrado) {
              this.idMedioTipoMedio = tipoMedioEncontrado.id;
            } else {
              this.$router.push('/registro');
              this.$message.error('No se puede cargar coberturas para tipos de medio no existentes.');
            }
          }
        }
      };
      const urlCoberturas = `medios/${medio.id}/tipos_medio/${this.idMedioTipoMedio}/coberturas`;
      let dataCoberturas = {};
      // enviar el tipo de cobertura, el arreglo de dpas y los dás superiores si corresponde
      if (this.tipoCobertura === 'NACIONAL') {
        dataCoberturas = {
          tipo: this.tipoCobertura
        };
      } else if (this.tipoCobertura === 'DEPARTAMENTAL') {
        dataCoberturas = {
          tipo: this.tipoCobertura,
          dpas: this.departamentosSeleccionados
        };
      } else if (this.tipoCobertura === 'PROVINCIAL') {
        dataCoberturas = {
          tipo: this.tipoCobertura,
          dpas: this.provinciasSeleccionadas
        };
      } else {
        dataCoberturas = {
          tipo: this.tipoCobertura,
          dpas: this.municipiosSeleccionados
        };
      }
      this.$service.post(urlCoberturas, dataCoberturas)
      .then(response => {
        if (response && response.cobertura) {
          this.actualizaMedio();
          this.$message.success('Cobertura guardada con éxito.');
          this.estaRegistrado = true;
          // Recupera información guardada de la cobertura seleccionada
          this.cobertura = this.tipoCobertura;
          if (this.tipoCobertura === 'DEPARTAMENTAL') {
            this.nombresDpas = [];
            this.departamentosSeleccionados.forEach((item, index) => {
              this.nombresDpas.push(this.departamentos.find((elemento) => {
                return elemento.id === item;
              }).nombre);
            });
          } else if (this.tipoCobertura === 'PROVINCIAL') {
            this.nombresDpas = [];
            this.provinciasSeleccionadas.forEach((item, index) => {
              this.nombresDpas.push(this.provincias.find((elemento) => {
                return elemento.id === item;
              }).nombre);
            });
          } else if (this.tipoCobertura === 'MUNICIPAL') {
            this.nombresDpas = [];
            this.municipiosSeleccionados.forEach((item, index) => {
              this.nombresDpas.push(this.municipios.find((elemento) => {
                return elemento.id === item;
              }).nombre);
            });
          }
        } else {
          this.$message.error('No se pudo guardar la cobertura.');
        }
      }).catch((error) => {
        this.$message.error('No se pudo guardar la cobertura.' + error);
      });
    },
    cargarDepartamentos () {
      this.$service.get('dpas/departamentos/')
      .then(response => {
        if (response && response.departamentos) {
          this.departamentos = response.departamentos.data.rows;
        }
      });
    },
    cargarProvincias (idDepartamento) {
      if (idDepartamento) {
        this.$service.get('dpas/departamentos/' + idDepartamento + '/provincias')
        .then(response => {
          if (response && response.provincias) {
            this.provincias = response.provincias.data.rows;
          }
        });
      }
    },
    cargarMunicipios (idProvincia) {
      if (idProvincia) {
        this.$service.get('dpas/provincias/' + idProvincia + '/municipios/')
        .then(response => {
          if (response && response.municipios) {
            this.municipios = response.municipios.data.rows;
          }
        });
      }
    },
    remove (item) {
      this.provinciasSeleccionadas.splice(this.provinciasSeleccionadas.indexOf(item), 1);
      this.provinciasSeleccionadas = [...this.provinciasSeleccionadas];
    }
  },
  watch: {
    'departamentoSeleccionado': function () {
      this.cargarProvincias(this.departamentoSeleccionado);
    },
    'provinciaSeleccionada': function () {
      this.cargarMunicipios(this.provinciaSeleccionada);
    }
  }
};
</script>
