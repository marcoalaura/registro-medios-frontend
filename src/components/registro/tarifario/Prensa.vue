<template>
  <section>
    <v-card text-xs-center>
      <v-card-text v-show="estadoMedio === 'PENDIENTE'">
        <v-form ref="form" lazy-validation @submit.prevent="guardarItem">
          <h4>Agregar Ítem</h4>
          <v-container grid-list-md>
            <v-card>
              <v-card-text>
                <v-alert type="info" :value="true">
                  Por favor ingrese los detalles del ítem que será parte de su propuesta comercial.
                </v-alert>
              </v-card-text>
              <v-card-text>
                <v-layout wrap align-center>
                  <v-flex xs3>
                    <v-text-field
                      name="descripcion"
                      label = "Descripción"
                      id="descripcion"
                      v-model="form.descripcion"
                      maxlength="150"
                      :rules="$validate(['required'])"
                      hint="Ejemplo: 1 página contratapa"
                      persistent-hint
                      required
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs2>
                    <v-card-text>
                      <span>Periodicidad <b class="error--text">*</b></span>
                      <v-radio-group v-model="form.periodicidad">
                        <v-radio
                          label="Diario"
                          value="DIARIO"
                        ></v-radio>
                        <v-radio
                          label="Semanario"
                          value="SEMANARIO"
                        ></v-radio>
                        <v-radio
                          label="Quincenal"
                          value="QUINCENAL"
                        ></v-radio>
                        <v-radio
                          label="Mensual"
                          value="MENSUAL"
                        ></v-radio>
                        <v-radio
                          label="Trimestral"
                          value="TRIMESTRAL"
                        ></v-radio>
                      </v-radio-group>
                    </v-card-text>
                  </v-flex>
                  <v-flex xs4>
                    <v-card-text>
                      <span v-if="form.periodicidad === 'DIARIO'">Días de publicación <b class="error--text">*</b></span>
                      <span v-else>Día de publicación <b class="error--text">*</b></span>
                    <v-switch
                      label="Toda la semana"
                      v-model="form.semanaCompleta"
                      v-if="form.periodicidad === 'DIARIO'"
                      v-debounce="delay"
                    ></v-switch>
                    <v-layout>
                      <v-flex xs10 sm10>
                        <v-select
                          v-if="form.periodicidad === 'DIARIO'"
                          label="Días"
                          :items="weekdayNames"
                          v-model="form.intervaloDias"
                          item-text="label"
                          item-value="index"
                          multiple
                          max-height="200"
                          hint="Seleccione los días de publicación"
                          persistent-hint
                          :disabled="form.semanaCompleta === true"
                          :rules="$validate(['required'])"
                          required
                        ></v-select>
                        <v-select
                          v-else
                          item-text="label"
                          item-value="index"
                          :items="weekdayNames"
                          v-model="form.diaUnico"
                          max-height="200"
                          hint="Seleccione el día en que suele publicarse."
                          persistent-hint
                          :rules="$validate(['required'])"
                          required
                        ></v-select>
                      </v-flex>
                    </v-layout>
                    </v-card-text>
                  </v-flex>
                  <v-flex xs2>
                    <v-radio-group v-model="form.tipoCosto">
                      <v-radio
                        label="Costo Arte"
                        value="ARTE"
                      ></v-radio>
                      <v-radio
                        label="Costo Separata"
                        value="SEPARATA"
                      ></v-radio>
                    </v-radio-group>
                    <v-flex xs9>
                      <v-text-field
                        name="costo"
                        id="costo"
                        prefix="Bs"
                        maxlength="9"
                        :rules="$validate(['required'])"
                        v-model="form.costo"
                        hint="Use punto para especificar decimales. Ejemplo: 3.80"
                        persistent-hint
                        required
                      ></v-text-field>
                    </v-flex>
                  </v-flex>
                  <v-flex xs1 align-center >
                    <v-card-actions>
                      <v-btn round dark color="info" type="submit">
                        <v-icon dark >add</v-icon>
                      </v-btn>
                    </v-card-actions>
                  </v-flex>
                </v-layout>
              </v-card-text>
            </v-card>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-text>
        <v-data-table
          v-model="tarifarioPrensa"
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
            <tr>
              <td class="text-xs-center">
                {{ props.index +1 }}
              </td>
              <td>{{ props.item.descripcion }}</td>
              <td class="text-xs-center">{{ props.item.periodicidad }}</td>
              <td>{{ obtieneNombreDias(props.item.dias) }}</td>
              <td class="text-xs-center">por {{ props.item.tipo_costo }}</td>
              <td class="text-xs-right">{{ props.item.costo }}</td>
              <td class="text-xs-center">
                <v-btn flat icon color="info" @click.stop="editarDetalleCarga(props.item)">
                  <v-icon>edit</v-icon>
                </v-btn>
                <v-dialog v-model="modalEditar" max-width="600px" persistent>
                  <v-card>
                    <v-card-title>
                      <b>Editar Ítem</b>
                    </v-card-title>
                    <v-form ref="formEditar" lazy-validation @submit.prevent="editarDetalle">
                      <v-card-text>
                        <v-layout wrap align-center>
                          <v-flex xs1>
                          </v-flex>
                          <v-flex xs10>
                            <v-text-field
                              name="descripcion"
                              id="descripcion"
                              v-model="formEditar.descripcion"
                              maxlength="150"
                              :rules="$validate(['required'])"
                              hint="Descripción"
                              persistent-hint
                              required
                            ></v-text-field>
                          </v-flex>
                          <v-flex xs1>
                          </v-flex>
                        </v-layout>
                  <v-layout wrap>
                  <v-flex xs4>
                    <v-card-text>
                      <span>Periodicidad <b class="error--text">*</b></span>
                      <v-radio-group v-model="formEditar.periodicidad">
                        <v-radio
                          label="Diario"
                          value="DIARIO"
                          :disabled="estadoMedio !== 'PENDIENTE'"
                        ></v-radio>
                        <v-radio
                          label="Semanario"
                          value="SEMANARIO"
                          :disabled="estadoMedio !== 'PENDIENTE'"
                        ></v-radio>
                        <v-radio
                          label="Quincenal"
                          value="QUINCENAL"
                          :disabled="estadoMedio !== 'PENDIENTE'"
                        ></v-radio>
                        <v-radio
                          label="Mensual"
                          value="MENSUAL"
                          :disabled="estadoMedio !== 'PENDIENTE'"
                        ></v-radio>
                        <v-radio
                          label="Trimestral"
                          value="TRIMESTRAL"
                          :disabled="estadoMedio !== 'PENDIENTE'"
                        ></v-radio>
                      </v-radio-group>
                    </v-card-text>
                  </v-flex>
                  <v-flex xs8>
                    <v-card-text>
                      <span v-if="formEditar.periodicidad === 'DIARIO'">Días de publicación <b class="error--text">*</b></span>
                      <span v-else>Día de publicación <b class="error--text">*</b></span>
                    <v-layout>
                      <template v-if="modalEditar === true">
                      <v-flex xs10 sm10>
                        <v-select
                          v-if="formEditar.periodicidad === 'DIARIO'"
                          :items="weekdayNames"
                          v-model="formEditar.intervaloDias"
                          item-text="label"
                          item-value="index"
                          multiple
                          max-height="200"
                          :rules="$validate(['required'])"
                          required
                          :disabled="estadoMedio !== 'PENDIENTE'"
                        ></v-select>
                        <v-select
                          v-else
                          item-text="label"
                          item-value="index"
                          :items="weekdayNames"
                          v-model="formEditar.diaUnico"
                          max-height="200"
                          :rules="$validate(['required'])"
                          required
                          :disabled="estadoMedio !== 'PENDIENTE'"
                        ></v-select>
                      </v-flex>
                      </template>
                    </v-layout>
                    </v-card-text>
                  </v-flex>
                </v-layout>
                <v-layout wrap align-center>
                  <v-flex xs5>
                    <v-radio-group v-model="formEditar.tipoCosto">
                      <v-radio
                        label="Costo Arte"
                        value="ARTE"
                        :disabled="estadoMedio !== 'PENDIENTE'"
                      ></v-radio>
                      <v-radio
                        label="Costo Separata"
                        value="SEPARATA"
                        :disabled="estadoMedio !== 'PENDIENTE'"
                      ></v-radio>
                    </v-radio-group>
                  </v-flex>
                    <v-flex xs7>
                      <v-text-field
                        name="costo"
                        id="costo"
                        prefix="Bs"
                        maxlength="9"
                        :rules="$validate(['required'])"
                        v-model="formEditar.costo"
                        hint="Use punto para especificar decimales. Ejemplo: 3.50"
                        persistent-hint
                        required
                        :disabled="estadoMedio !== 'PENDIENTE'"
                      ></v-text-field>
                    </v-flex>
                  </v-layout>
                    </v-card-text>
                    <v-card-actions>
                      <v-btn color="primary" @click.stop="modalEditar=false">Cancelar</v-btn>
                      <v-spacer></v-spacer>
                      <v-btn color="info" type="submit">
                      <!-- <v-btn color="info" @click="editarDetalle(props.item)"> -->
                        Guardar cambios</v-btn>
                    </v-card-actions>
                    </v-form>
                  </v-card>
                </v-dialog>
                <v-btn flat icon color="error" @click="eliminarDetalle(props.item)" v-show="estadoMedio === 'PENDIENTE'">
                  <v-icon>delete</v-icon>
                </v-btn>
              </td>
            </tr>
          </template>
          <template slot="no-data">
              Aún no ha introducido ningún ítem.
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    
  </section>
</template>

<script>
import validate from '@/common/mixins/validate';
import debounce from 'debounce';
import Tarifario from './mixins/tarifario';

export default {
  mixins: [validate, Tarifario],
  props: {
    tipoMedio: {
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
    }
  },
  data () {
    return {
      weekdayNames: [
        {label: 'Lunes', index: 1},
        {label: 'Martes', index: 2},
        {label: 'Miércoles', index: 3},
        {label: 'Jueves', index: 4},
        {label: 'Viernes', index: 5},
        {label: 'Sábado', index: 6},
        {label: 'Domingo', index: 7} ],
      tarifarioPrensa: [],
      form: {
        periodicidad: 'DIARIO',
        tipoCosto: 'ARTE',
        intervaloDias: [],
        semanaCompleta: false,
        descripcion: null,
        costo: null,
        diaUnico: null
      },
      formEditar: {
        periodicidad: '',
        tipoCosto: '',
        intervaloDias: [],
        // semanaCompleta: false,
        descripcion: null,
        costo: null,
        diaUnico: null,
        id: 0
      },
      delay: 2000,
      estadoMedio: '',
      headers: [
        {
          text: 'N°',
          align: 'center',
          value: 'numero'
        },
        { text: 'Descripción', value: 'descripcion' },
        { text: 'Periodicidad', value: 'periodicidad' },
        { text: 'Día(s) Publicación', value: 'intervaloDias' },
        { text: 'Tipo Costo', value: 'tipoCosto' },
        { text: 'Costo', value: 'costo' },
        { text: 'Acciones', value: 'acciones' }
      ],
      pagination: {
        sortBy: 'tipoCosto'
      },
      tarifario: null,
      idTarifarioPrensa: this.idTarifario,
      idMedioTipoMedioPrensa: this.idMedioTipoMedio,
      modalEditar: false
    };
  },
  created () {
    if (this.$storage.get('medio')) {
      if (this.$storage.get('medio').tipos_medio) {
        this.estadoMedio = this.$storage.get('medio').estado;
        let tiposMediosRecuperados = this.$storage.get('medio').tipos_medio;
        let tipoMedioEncontrado = tiposMediosRecuperados.find((elemento) => {
          return elemento.id === this.idMedioTipoMedioPrensa;
        });
        if (tipoMedioEncontrado) {
          if (tipoMedioEncontrado.tarifario) {
            let idTarifarioEncontrado = tipoMedioEncontrado.tarifario.id;
            this.idTarifarioPrensa = idTarifarioEncontrado;
            this.$service.get(`medios/${this.$storage.get('medio').id}/tipos_medio/${this.idMedioTipoMedio}/tarifarios/${idTarifarioEncontrado}`)
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
          }
        } else {
          this.$router.push('/registro');
          this.$message.error('No se no se encontró el tarifario.');
        }
      }
    }
  },
  mounted () {
    if (this.$storage.get('medio')) {
      if (this.$storage.get('medio').tipos_medio) {
        let tiposMediosRecuperados = this.$storage.get('medio').tipos_medio;
        let tipoMedioEncontrado = tiposMediosRecuperados.find((elemento) => {
          return elemento.id === this.idMedioTipoMedioPrensa;
        });
        if (tipoMedioEncontrado) {
          this.idMedioTipoMedio = tipoMedioEncontrado.id;
          if (tipoMedioEncontrado.tarifario) {
            let idTarifarioEncontrado = tipoMedioEncontrado.tarifario.id;
            this.idTarifarioPrensa = idTarifarioEncontrado;
            this.$service.get(`medios/${this.$storage.get('medio').id}/tipos_medio/${this.idMedioTipoMedioPrensa}/tarifarios/${this.idTarifarioPrensa}`)
            .then((response) => {
              if (response && response.tarifario) {
                this.tarifario = response.tarifario;
                this.tarifarioPrensa = this.tarifario.data.detalles;
              } else {
                this.$message.error('No se pudo obtener el detalle');
              }
            }).catch((error) => {
              this.$message.error('No se pudo obtener el detalle' + error);
            });
          }
        }
      }
    }
  },
  methods: {
    guardarItem (form) {
      if (this.$refs.form.validate()) {
        if (this.form.periodicidad !== 'DIARIO') {
          let diaElegido = this.form.diaUnico;
          this.form.intervaloDias = [];
          this.form.intervaloDias.push(diaElegido);
        }
        this.$service.post(`medios/${this.$storage.get('medio').id}/tipos_medio/${this.idMedioTipoMedioPrensa}/tarifarios/${this.idTarifarioPrensa}/detalles`,
          {
            'descripcion': this.form.descripcion,
            'periodicidad': this.form.periodicidad,
            'dias': this.form.intervaloDias,
            'tipo_costo': this.form.tipoCosto,
            'costo': this.form.costo
          })
        .then((response) => {
          if (response && response.detalle) {
            this.actualizaMedio();
            this.$message.success('El ítem se ha guardado correctamente.');
            this.limpiaFormulario();
            this.recuperaDetalle();
          } else {
            this.$message.error('No se pudo guardar el ítem en el tarifario ');
          }
        }).catch((error) => {
          this.$message.error('No se pudo guardar el ítem en el tarifario ' + error);
        });
      }
    },
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
    recuperaDetalle () {
      this.$service.get(`medios/${this.$storage.get('medio').id}/tipos_medio/${this.idMedioTipoMedioPrensa}/tarifarios/${this.idTarifarioPrensa}`)
      .then((response) => {
        if (response && response.tarifario) {
          this.tarifario = response.tarifario;
          this.tarifarioPrensa = this.tarifario.data.detalles;
        } else {
          this.$message.error('No se pudo obtener el detalle');
        }
      }).catch((error) => {
        this.$message.error('No se pudo obtener el detalle' + error);
      });
    },
    obtieneArrayEnInt (arrayCadena) {
      let arrayInt = arrayCadena.map((elemento) => {
        return parseInt(elemento);
      });
      return arrayInt;
    },
    editarDetalleCarga (item) {
      this.modalEditar = true;
      this.formEditar.descripcion = item.descripcion;
      this.formEditar.intervaloDias = item.dias;
      this.formEditar.diaUnico = item.dias[0];
      this.formEditar.periodicidad = item.periodicidad;
      this.formEditar.tipoCosto = item.tipo_costo;
      this.formEditar.costo = item.costo;
      this.formEditar.id = item.id;
    },
    editarDetalle (formEditar) {
      if (this.$refs.formEditar.validate()) {
        if (this.form.periodicidad !== 'DIARIO') {
          let diaElegido = this.form.diaUnico;
          this.form.intervaloDias = [];
          this.form.intervaloDias.push(diaElegido);
        } else {
          this.formEditar.diaUnico = null;
        }
        this.$service.put(`medios/${this.$storage.get('medio').id}/tipos_medio/${this.idMedioTipoMedioPrensa}/tarifarios/${this.idTarifarioPrensa}/detalles/${this.formEditar.id}`,
          {
            'descripcion': this.formEditar.descripcion,
            'periodicidad': this.formEditar.periodicidad,
            'dias': this.formEditar.intervaloDias,
            'tipo_costo': this.formEditar.tipoCosto,
            'costo': this.formEditar.costo
          })
        .then((response) => {
          if (response && response.detalle) {
            this.actualizaMedio();
            this.$message.success('El ítem se ha actualizado correctamente.');
            this.recuperaDetalle();
            this.modalEditar = false;
          }
        }).catch((error) => {
          this.$message.error('No se pudo editar el ítem en el tarifario ' + error);
        });
      }
    },
    eliminarDetalle (item) {
      this.$confirm('¿Está seguro de eliminar el ítem?', () => {
        this.$service.delete(`medios/${this.$storage.get('medio').id}/tipos_medio/${this.idMedioTipoMedioPrensa}/tarifarios/${this.idTarifarioPrensa}/detalles/${item.id}`)
        .then(response => {
          if (response.detalle) {
            this.$message.success('Ítem eliminado correctamente');
            this.actualizaMedio();
            this.recuperaDetalle();
          }
        }).catch((error) => {
          this.$message.error('No se pudo eliminar el ítem del tarifario ' + error);
        });
      });
    },
    limpiaFormulario () {
      this.form.descripcion = null;
      this.form.costo = null;
      this.form.periodicidad = 'DIARIO';
      this.form.tipoCosto = 'ARTE';
      this.form.intervaloDias = [];
      this.form.semanaCompleta = false;
      this.form.diaUnico = null;
    }
  },
  watch: {
    'form.semanaCompleta': function () {
      if (this.form.semanaCompleta === true) {
        this.form.intervaloDias = [1, 2, 3, 4, 5, 6, 7];
      }
    }
  },
  directives: {
    debounce
  }
};
</script>