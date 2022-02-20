<template>
  <section>
    <v-layout row wrap>
      <persona-segip store="usuario/"></persona-segip>

      <v-flex xs4>
        <v-select
          :items="nacionalidades"
          v-model="nacionalidad"
          label="Nacionalidad"
          item-text="text"
          item-value="value"
          :rules="$validate(['required'])"
          required
          ></v-select>
      </v-flex>

      <!-- <v-flex xs4>
        <v-select
          :items="paises"
          v-model="pais_nacimiento"
          label="País de nacimiento"
          item-text="text"
          item-value="id"
          :rules="$validate(['required'])"
          required
          ></v-select>
      </v-flex> -->

      <v-flex xs4>
        <v-text-field
          label="Móvil"
          prepend-icon="smartphone"
          v-model="movil"
          maxlength="30"
          ></v-text-field>
      </v-flex>

      <v-flex xs4>
        <v-text-field
          label="Teléfono"
          prepend-icon="phone"
          v-model="telefono"
          maxlength="30"
          ></v-text-field>
      </v-flex>

      <v-flex xs4>
        <v-radio-group
          v-model="genero"
          row
          :rules="$validate(['required'])"
          required
        >
          <v-radio
            label="Mujer"
            value="F"
          ></v-radio>
          <v-radio
            label="Hombre"
            value="M"
          ></v-radio>
        </v-radio-group>
      </v-flex>
    </v-layout>
  </section>
</template>

<script>
import PersonaSegip from '@/components/admin/persona/PersonaSegip';
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
      paises: [
        { value: 'BOLIVIA', text: 'BOLIVIA' }
      ],
      nacionalidades: [
        { value: 'BOLIVIA', text: 'BOLIVIANA' }
      ]
    };
  },
  beforeCreate () {
    // Creando campos del formulario en el store definido
    let store = this.$options.propsData.store || '';
    this.$options.computed = {
      ...mapFields([
        'form.nombres',
        'form.primer_apellido',
        'form.segundo_apellido',
        'form.telefono',
        'form.movil',
        'form.nacionalidad',
        'form.pais_nacimiento',
        'form.tipo_documento',
        'form.genero'
      ], `${store}getField`, `${store}updateField`)
    };
  },
  components: {
    PersonaSegip
  }
};
</script>
