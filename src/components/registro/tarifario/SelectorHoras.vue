<template>
  <div>
  <span>Hora {{ esInicio ? 'Inicio' : 'Fin'}} </span>
  <v-layout align-center>
    <v-flex xs5>
      <v-select
        :items="horas"
        v-model="hh"
        label="hh"
        item-text="text"
        item-value="text"
        v-debounce="delay"
        :rules="$validate(['required'])"
        required
      ></v-select>
    </v-flex>
    <v-flex xs1>
      <span>:</span>
    </v-flex>
    <v-flex xs5>
      <v-select
        label="mm"
        :items="minutos"
        v-model="mm"
        item-value="text"
        v-debounce="delay"
        :rules="$validate(['required'])"
        required
      ></v-select>
    </v-flex>
  </v-layout>
  </div>
</template>

<script>

import debounce from 'debounce';
import validate from '@/common/mixins/validate';
import EventBus from './bus';

export default {
  mixins: [ validate ],
  props: {
    inicio: {
      type: Boolean,
      default: true
    },
    hora: {
      type: String,
      default: null
    },
    minuto: {
      type: String,
      default: null
    },
    empieza: {
      type: String,
      default: null
    },
    model: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      horas: [
        { text: '00' },
        { text: '01' },
        { text: '02' },
        { text: '03' },
        { text: '04' },
        { text: '05' },
        { text: '06' },
        { text: '07' },
        { text: '08' },
        { text: '09' },
        { text: '10' },
        { text: '11' },
        { text: '12' },
        { text: '13' },
        { text: '14' },
        { text: '15' },
        { text: '16' },
        { text: '17' },
        { text: '18' },
        { text: '19' },
        { text: '20' },
        { text: '21' },
        { text: '22' },
        { text: '23' }],
      minutos: [
        { text: '00' },
        { text: '05' },
        { text: '10' },
        { text: '15' },
        { text: '20' },
        { text: '25' },
        { text: '30' },
        { text: '35' },
        { text: '40' },
        { text: '45' },
        { text: '50' },
        { text: '55' }],
      delay: 2000,
      hh: this.hora,
      mm: this.minuto,
      esInicio: this.inicio,
      acaEmpieza: this.empieza,
      esCrea: this.create,
      horaSeleccionada: ''
    };
  },
  created () {
    this.hh = this.hora;
    this.mm = this.minuto;
    if (this.acaEmpieza) {
      this.horas = this.horas.filter((elemento) => parseInt(elemento.text) >= parseInt(this.acaEmpieza));
    }
  },
  watch: {
    'hh': function () {
      this.horaSeleccionada = this.hh + ':' + this.mm;
      EventBus.$emit(this.model, this.horaSeleccionada);
    },
    'mm': function () {
      this.horaSeleccionada = this.hh + ':' + this.mm;
      EventBus.$emit(this.model, this.horaSeleccionada);
    }
  },
  directives: {
    debounce
  }
};
</script>
