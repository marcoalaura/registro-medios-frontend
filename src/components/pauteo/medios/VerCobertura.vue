<template>
  <v-container fluid px-0>
    <template v-if="estaRegistrado">
      <v-container fluid px-0>
        <v-layout row wrap>
          <v-flex xs12> 
            <b>Cobertura:</b> {{ cobertura }} 
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

export default {
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
      tipoCobertura: null,
      departamentos: null,
      provincias: null,
      municipios: null,
      modalEditar: false,
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
    }
  }
};
</script>
