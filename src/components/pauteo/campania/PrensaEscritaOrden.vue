<template>
  <div>
    <v-card-text>
      <template v-if="haSeleccionado === false">
      <v-data-table
        v-model="selected"
        :headers="headers"
        :items="tarifarioPrensa"
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
          <tr :active="props.selected" @click="props.selected = !props.selected; completar(props.item)">
            <td class="text-xs-center">
              <v-checkbox
                :input-value="props.selected"
                primary
                hide-details
              ></v-checkbox>
            </td>
            <td>{{ props.item.descripcion }}</td>
            <td class="text-xs-center">{{ props.item.periodicidad }}</td>
            <td>{{ obtieneNombreDias(props.item.dias) }}</td>
            <td class="text-xs-center">por {{ props.item.tipo_costo }}</td>
            <td class="text-xs-right">{{ props.item.costo }}</td>
          </tr>
        </template>
        <template slot="no-data">
            No existen datos.
        </template>
      </v-data-table>
      </template>
      <template v-if="haSeleccionado === true">
        <v-form ref="form" lazy-validation @submit.prevent="guardarOrden">
          <v-container grid-list-md>
            <v-card>
              <v-card-text>
                <v-alert type="info" :value="true">
                  Por favor ingrese los detalles de la orden de publicidad.
                </v-alert>
              </v-card-text>
              <v-card-text>
                <v-layout wrap align-center>
                  <v-flex xs3>
                    <v-text-field
                      name="nombre"
                      :label = "form.tipoCosto"
                      id="nombre"
                      v-model="form.nombre"
                      maxlength="150"
                      :rules="$validate(['required'])"
                      required
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs2>
                    <v-card-text>
                      <span>Edición y/o Fecha de publicación <b class="error--text">*</b></span>
                      <v-text-field
                        name="edicion"
                        label = "Edición"
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
                  <v-flex xs4>
                    <v-card-text>
                      <v-text-field
                        name="formato"
                        label = "Formato"
                        id="formato"
                        v-model="form.formato"
                        maxlength="150"
                        :rules="$validate(['required'])"
                        required
                      ></v-text-field>
                      <v-text-field
                        name="ubicacion"
                        label = "Ubicación"
                        id="ubicacion"
                        v-model="form.ubicacion"
                        maxlength="150"
                        :rules="$validate(['required'])"
                        required
                      ></v-text-field>
                    </v-card-text>
                  </v-flex>
                  <v-flex xs2>
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
                  <v-flex xs1 align-center >
                    <v-card-actions>
                      <v-btn round dark color="info" type="submit">
                        <v-icon dark>check</v-icon>aceptar
                      </v-btn>
                    </v-card-actions>
                    <v-card-actions>
                      <v-btn round dark color="error" @click="cancelar()">
                        <v-icon dark>clear</v-icon>CANCELAR
                      </v-btn>
                    </v-card-actions>
                  </v-flex>
                </v-layout>
              </v-card-text>
            </v-card>
          </v-container>
        </v-form>
      </template>
    </v-card-text>
  </div>
</template>

<script>

import validate from '@/common/mixins/validate';
import debounce from 'debounce';

export default {
  mixins: [ validate ],
  props: {
    idMedio: {
      type: Number,
      default: 0
    },
    idTarifario: {
      type: Number,
      default: 0
    },
    idMedioTipoMedio: {
      type: Number,
      default: 0
    },
    idCampanaMedio: {
      type: Number,
      default: 0
    },
    idCampana: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      selected: [],
      headers: [
        { text: 'Elegir', value: 'elegir' },
        { text: 'Descripción', value: 'descripcion' },
        { text: 'Periodicidad', value: 'periodicidad' },
        { text: 'Día(s) Publicación', value: 'intervaloDias' },
        { text: 'Tipo Costo', value: 'tipoCosto' },
        { text: 'Costo', value: 'costo' }
      ],
      pagination: {
        sortBy: 'tipoCosto'
      },
      tarifario: null,
      idTarifarioPrensa: this.idTarifario,
      idMedioTipoMedioPrensa: this.idMedioTipoMedio,
      idMedioPrensa: this.idMedio,
      idCampanaMedioPrensa: this.idCampanaMedio,
      tarifarioPrensa: [],
      weekdayNames: [
        {label: 'Lunes', index: 1},
        {label: 'Martes', index: 2},
        {label: 'Miércoles', index: 3},
        {label: 'Jueves', index: 4},
        {label: 'Viernes', index: 5},
        {label: 'Sábado', index: 6},
        {label: 'Domingo', index: 7} ],
      haSeleccionado: false,
      form: {
        periodicidad: null,
        tipoCosto: null,
        intervaloDias: [],
        semanaCompleta: false,
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
      dateFormattedPublicacion: null,
      idCampanaPrensa: this.idCampana
    };
  },
  created () {
    this.$service.get(`medios/${this.idMedioPrensa}/tipos_medio/${this.idMedioTipoMedioPrensa}/tarifarios/${this.idTarifarioPrensa}`)
    .then((response) => {
      if (response && response.tarifario) {
        this.tarifario = response.tarifario;
        this.tarifarioPrensa = this.tarifario.data.detalles;
      } else {
        this.$message.error('No se pudo obtener el detalle');
      }
    }).catch((error) => {
      this.$message.error('No se pudo obtener el detalle ' + error);
    });
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
    obtieneNombreDia (i) {
      let nombre = this.weekdayNames.find((elemento) => {
        return elemento.index === parseInt(i);
      });
      if (nombre) {
        return nombre;
      } else {
        return null;
      }
    },
    obtieneNombreDias (diasArray) {
      let nombresArray = [];
      nombresArray = diasArray.map((elemento) => {
        if (this.obtieneNombreDia(elemento) !== null) {
          return ' ' + this.obtieneNombreDia(elemento).label;
        }
      });
      return nombresArray.toString();
    },
    completar (item) {
      this.haSeleccionado = true;
      this.form.formato = item.descripcion;
      this.form.costo = item.costo;
      this.form.tipoCosto = item.tipo_costo;
      this.form.periodicidad = item.periodicidad;
      this.form.idDetalle = item.id;
    },
    cancelar () {
      this.haSeleccionado = false;
      this.selected = [];
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
    },
    guardarOrden (form) {
      if (this.$refs.form.validate()) {
        this.$service.get(`campanas/${this.idCampanaPrensa}/medios/${this.idCampanaMedioPrensa}`)
        .then(response => {
          if (response && response.campanaMedio && response.campanaMedio.data) {
            if (response.campanaMedio.data.referencia) {
              this.$service.post(`campanas/${this.idCampanaPrensa}/medios_relacionados/${this.idCampanaMedioPrensa}/ordenes`,
                {
                  'costo': this.form.costo,
                  'fecha_publicacion': this.form.fechaPublicacion,
                  'edicion': this.form.edicion,
                  'nombre': this.form.nombre,
                  'formato': this.form.formato,
                  'ubicacion': this.form.ubicacion,
                  'id_tarifario_det': this.form.idDetalle,
                  'nro_orden': 1
                })
              .then((response) => {
                if (response) {
                  this.$message.success('La orden de publicidad fue creada correctamente.');
                  this.$router.push(`/campana/${this.idCampanaPrensa}`);
                }
              }).catch((error) => {
                this.$message.error('No se pudo crear la orden de publicidad ' + error);
              });
            } else {
              this.$message.error('Por favor elija el contacto del medio.');
            }
          }
        });
      } else {
        this.$message.error('Por favor verifique que la información haya sido llenada correctamente.');
      }
    }
  },
  directives: {
    debounce
  },
  watch: {
    'form.fechaPublicacion' (val) {
      this.dateFormattedPublicacion = this.formatDate(this.form.fechaPublicacion);
    }
  }
};
</script>
