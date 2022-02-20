<template>
  <div>
    <v-layout row wrap>
      <v-flex xs4>
        <v-select
          :items="tiposDoc"
          v-model="tipo_documento"
          label="Tipo de documento"
          item-text="text"
          item-value="value"
          :rules="$validate(['required'])"
          required
          :disabled="!!persona"
          ></v-select>
      </v-flex>
      <v-flex xs3>
        <v-text-field
          label="Número de documento"
          v-model="nro_documento"
          maxlength="20"
          @keydown.native="$filter.numeric($event)"
          :rules="$validate(['required'])"
          required
          :disabled="!!persona"
          ></v-text-field>
      </v-flex>
      <v-flex xs3>
        <select-date
          model="form.fecha_nacimiento"
          store="usuario/"
          :required="true"
          :disabled="!!persona"
        >
        </select-date>
      </v-flex>
      <v-flex xs4>
        <v-text-field
          label="Nombre(s)"
          v-model="nombres"
          maxlength="100"
          :rules="$validate(['required'])"
          required
          :disabled="!!persona"
          ></v-text-field>
      </v-flex>

      <v-flex xs3>
        <v-text-field
          label="Primer apellido"
          v-model="primer_apellido"
          maxlength="100"
          :disabled="!!persona"
          ></v-text-field>
      </v-flex>

      <v-flex xs3>
        <v-text-field
          label="Segundo apellido"
          v-model="segundo_apellido"
          maxlength="100"
          :disabled="!!persona"
          ></v-text-field>
      </v-flex>
      <v-flex xs2>
        <v-btn
          v-if="persona"
          @click="cambiar"><v-icon>compare_arrows</v-icon> Cambiar</v-btn>
        <v-btn
          color="info"
          v-if="!persona"
          :disabled="$filter.empty(tipo_documento) || $filter.empty(nro_documento) || $filter.empty(fecha_nacimiento)"
          @click="buscarPersona"><v-icon>search</v-icon> Buscar</v-btn>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import SelectDate from '@/common/util/SelectDate';
import validate from '@/common/mixins/validate';
import { mapFields } from 'vuex-map-fields';

export default {
  mixins: [ validate ],
  props: {
    store: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      tiposDoc: [
        { value: 'CI', text: 'CÉDULA DE IDENTIDAD' },
        { value: 'PASAPORTE', text: 'PASAPORTE' }
      ]
    };
  },
  beforeCreate () {
    // Creando campos del formulario en el store definido en props
    let store = this.$options.propsData.store || '';
    this.$options.computed = {
      ...mapFields([
        'form.tipo_documento',
        'form.tipo_documentoOtro',
        'form.nro_documento',
        'form.persona',
        'form.fecha_nacimiento',
        'form.nombres',
        'form.primer_apellido',
        'form.segundo_apellido'
      ], `${store}getField`, `${store}updateField`)
    };
  },
  methods: {
    buscarPersona () {
      let url = `../system/persona-segip/${this.nro_documento}?fechaNacimiento=${this.$datetime.format(this.fecha_nacimiento)}`;
      url += `&nombres=${this.nombres}&primerApellido=${this.primer_apellido}&segundoApellido=${this.segundo_apellido}&tipoDoc=${this.tipo_documento}`;
      this.$service.get(url)
      .then(response => {
        if (response) {
          const persona = response;
          this.$store.commit('usuario/setForm', {
            primer_apellido: persona.primer_apellido,
            segundo_apellido: persona.segundo_apellido,
            nombres: persona.nombres,
            nacionalidad: persona.nacionalidad,
            persona: persona
          });
        }
      });
    },
    cambiar () {
      this.$store.commit('usuario/setForm', {
        primer_apellido: '',
        segundo_apellido: '',
        nombres: '',
        nacionalidad: '',
        tipo_documento: '',
        tipo_documentoOtro: '',
        nro_documento: '',
        fecha_nacimiento: '',
        persona: null
      });
      this.$store.commit('cleanDate', 'form.fecha_nacimiento');
    }
  },
  components: {
    SelectDate
  }
};
</script>
