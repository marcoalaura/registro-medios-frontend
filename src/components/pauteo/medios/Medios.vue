<template>
  <v-layout row>
    <v-flex xs12>
      <v-card>
        <v-card-title>
          <h3 class="primary--text"><v-icon info>view_list</v-icon> Listado de medios </h3>
        </v-card-title>
        <v-card-actions>
          <v-btn color="primary" :flat="boton1" @click.native="cargarListado('PENDIENTE')">Pendientes de revisión</v-btn>
          <v-btn color="primary" :flat="boton2" @click.native="cargarListado('REGULAR')">Medios Regulares</v-btn>
          <v-btn color="primary" :flat="boton3" @click.native="cargarListado('EVENTUAL')">Medios Eventuales</v-btn>
          <v-btn color="primary" :flat="boton4" @click.native="cargarListado('EN_EVALUACION')">Medios en evaluación</v-btn>
        </v-card-actions>
        <hr class="tab-boton-header" >
        <v-card-text>
          <v-data-table v-model="selected" v-bind:headers="headers" v-bind:items="items" select-all v-bind:pagination.sync="pagination" item-key="id" class="elevation-1" rows-per-page-text="Registros por página" no-results-text="Sin registro" no-data-text="Sin registros">
            <template slot="headers" slot-scope="props">
              <tr>
                <th v-for="(header,key) in props.headers" :key="key" :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']" @click="changeSort(header.value)">
                  <v-icon  v-if="header.value !== 'acciones'">arrow_upward</v-icon>
                  {{ header.text }}
                </th>
              </tr>
            </template>
            <template slot="items" slot-scope="props">
              <tr :active="props.selected" @click="props.selected = !props.selected">
                <td class="text-xs-center">{{ props.item.tipos_medio }}</td>
                <td class="text-xs-center">{{ props.item.nit }}</td>
                <td class="text-xs-center">{{ props.item.matricula }}</td>
                <td class="text-xs-center">{{ props.item.tipo_societario}}</td>
                <td class="text-xs-center"><b>{{ props.item.razon_social }}</b></td>                
                <td class="text-xs-center">{{ props.item.fecha_envio }}</td>
                <td class="text-xs-center">
                  <v-flex xl12>
                    <span title="Clasificación">
                      <v-btn v-if="rol===4" icon color="info" dark small @click.native="consultaClasificacion(props.item.id)">
                        <v-icon>local_offer</v-icon>
                      </v-btn>
                    </span>
                    <span title="Ver Detalles">
                      <v-btn icon color="info" dark small @click.native="abreFormVerMedio(props.item.id)">
                        <v-icon>visibility</v-icon>
                      </v-btn>
                    </span>
                    <span title="Rechazar Registro" v-show="props.item.estado === 'POR_CLASIFICAR'">
                      <v-btn icon color="info" dark small @click.native="abreFormRechazarMedio(props.item.id)">
                        <v-icon>close</v-icon>
                      </v-btn>
                    </span>
                  </v-flex>
                </td>
              </tr>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-flex>

    <v-dialog v-model="modalEditar" max-width="800px" persistent>
      <v-card>
        <v-card-title>
          <b v-if="boton1">Editar la clasificación del Medio de Comunicación</b>
          <b v-if="!boton1">Clasificación del Medio de Comunicación</b>
        </v-card-title>
        <v-form 
          ref="formEdit"
          lazy-validation 
          @submit.prevent="modificaClasificacion">
          <v-card-text>
            <v-layout wrap>
              <v-flex xs12>
                <v-select
                  label='Seleccione la clasificación del medio'
                  prepend-icon="list"
                  :items="tiposClasificacion"
                  v-model="tipoClasificacion"
                  required
                >
                </v-select>
              </v-flex>
            </v-layout>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click.stop="modalEditar=false">Cerrar</v-btn>
            <v-spacer></v-spacer>
            <v-btn color="info" block type="submit" ><v-icon dark>local_offer</v-icon>Clasificar</v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>

    <v-dialog v-model="modalRechazar" max-width="800px" persistent>
      <v-card>
        <v-card-title>
          <b>Rechazar registro de medio de comunicación <b class="error--text">*</b></b>
        </v-card-title>
        <v-form 
          ref="formRech"
          lazy-validation 
          @submit.prevent="rechazarMedio">
          <v-card-text>
            <v-layout wrap>
              <v-flex xs12>
                <v-text-field
                  name="observaion"
                  id="observacion"
                  v-model="formRech.observacion"
                  maxlength="250"
                  hint="Motivo de la observación"
                  persistent-hint
                  multi-line
                  required
                  auto-grow
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click.stop="modalRechazar=false">Cerrar</v-btn>
            <v-spacer></v-spacer>
            <v-btn color="info" block type="submit" ><v-icon dark>close</v-icon>Rechazar</v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
  /* eslint-disable semi */
  
  export default {
    data () {
      return {
        boton1: false,
        boton2: true,
        boton3: true,
        boton4: true,
        modalEditar: false,
        modalRechazar: false,
        rol: null,
        tipoClasificacion: false,
        observacionRechazo: 'Observado por wey',
        tiposClasificacion: [
          {text: 'Regular', value: 'REGULAR'},
          {text: 'Eventual', value: 'EVENTUAL'},
          {text: 'En evaluación', value: 'EN_EVALUACION'}
        ],
        headers: [
          {text: 'Tipo de medio', value: 'tipo', align: 'center'},
          {text: 'N.I.T.', value: 'nit'},
          {text: 'Matrícula', value: 'matricula_comercio'},
          {text: 'Tipo Empresa', value: 'tipo_societario'},
          {text: 'Razón Social', value: 'razon_social', align: 'center'},
          {text: 'Fecha de envío', value: 'fecha'},
          {text: 'Acciones', value: 'acciones', align: 'center', sortable: false}
        ],
        formEdit: {
          id: '',
          fecha_nacimiento: '',
          referencia: ''
        },
        formRech: {
          id: '',
          observacion: ''
        },
        selected: [],
        pagination: {
          sortBy: 'name'
        },
        items: [],
        listadoMedios: []
      }
    },
    created () {
      this.rol = this.$storage.getUser().id_rol;
      this.cargarLista();
    },
    methods: {
      cargarListado (valor) {
        if (valor === 'PENDIENTE') {
          this.tipoClasificacion = null;
          this.boton1 = false;
          this.boton2 = true;
          this.boton3 = true;
          this.boton4 = true;
        }
        if (valor === 'REGULAR') {
          this.tipoClasificacion = 'REGULAR';
          this.boton1 = true;
          this.boton2 = false;
          this.boton3 = true;
          this.boton4 = true;
        }
        if (valor === 'EVENTUAL') {
          this.tipoClasificacion = 'EVENTUAL';
          this.boton1 = true;
          this.boton2 = true;
          this.boton3 = false;
          this.boton4 = true;
        }
        if (valor === 'EN_EVALUACION') {
          this.tipoClasificacion = 'EN_EVALUACION';
          this.boton1 = true;
          this.boton2 = true;
          this.boton3 = true;
          this.boton4 = false;
        }
        this.cargarListaClasificacion();
      },
      cargarLista () {
        this.$service.get(`pauteo/medios/clasificar`)
        .then(response => {
          this.listadoMedios = response.medios.data.rows;
          this.$nextTick(function () {
            this.cargarListaClasificacion();
          });
        });
      },
      clasificar (objeto) {
        this.modalEditar = true;
      },
      cargarListaClasificacion () {
        if (this.listadoMedios.length > 0) {
          if (!this.boton1) {
            this.items = this.listadoMedios.map((elemento) => {
              return ({'id': elemento.id, 'nit': elemento.nit, 'matricula': elemento.matricula, 'razon_social': elemento.razon_social, 'tipo_societario': elemento.tipo_societario, 'estado': elemento.estado, 'fecha_envio': this.$datetime.format(elemento.fecha_envio, 'dd/MM/YYYY'), 'clasificacion': elemento.clasificacion, 'tipos_medio': elemento.tipos_medio});
            }).filter((elemento) => elemento.estado === 'POR_CLASIFICAR');
          };
          if (!this.boton2) {
            this.items = this.listadoMedios.map((elemento) => {
              return ({'id': elemento.id, 'nit': elemento.nit, 'matricula': elemento.matricula, 'razon_social': elemento.razon_social, 'tipo_societario': elemento.tipo_societario, 'estado': elemento.estado, 'fecha_envio': this.$datetime.format(elemento.fecha_envio, 'dd/MM/YYYY'), 'clasificacion': elemento.clasificacion, 'tipos_medio': elemento.tipos_medio});
            }).filter((elemento) => elemento.clasificacion === 'REGULAR');
          };
          if (!this.boton3) {
            this.items = this.listadoMedios.map((elemento) => {
              return ({'id': elemento.id, 'nit': elemento.nit, 'matricula': elemento.matricula, 'razon_social': elemento.razon_social, 'tipo_societario': elemento.tipo_societario, 'estado': elemento.estado, 'fecha_envio': this.$datetime.format(elemento.fecha_envio, 'dd/MM/YYYY'), 'clasificacion': elemento.clasificacion, 'tipos_medio': elemento.tipos_medio});
            }).filter((elemento) => elemento.clasificacion === 'EVENTUAL');
          };
          if (!this.boton4) {
            this.items = this.listadoMedios.map((elemento) => {
              return ({'id': elemento.id, 'nit': elemento.nit, 'matricula': elemento.matricula, 'razon_social': elemento.razon_social, 'tipo_societario': elemento.tipo_societario, 'estado': elemento.estado, 'fecha_envio': this.$datetime.format(elemento.fecha_envio, 'dd/MM/YYYY'), 'clasificacion': elemento.clasificacion, 'tipos_medio': elemento.tipos_medio});
            }).filter((elemento) => elemento.clasificacion === 'EN_EVALUACION');
          };
        } else {
          this.items = [];
        }
      },
      consultaClasificacion (idMedio) {
        this.idMedioSeleccionado = idMedio;
        this.modalEditar = true;
      },
      modificaClasificacion () {
        let mensaje = '';
        if (this.boton1) {
          mensaje = '¿Está seguro de cambiar la clasificación del Medio de Comunicación?';
        } else {
          mensaje = '¿Está seguro de la clasificación del Medio de Comunicación?';
        }
        this.$confirm(mensaje, () => {
          this.$service.put(`pauteo/medios/${this.idMedioSeleccionado}/clasificar`, {
            clasificacion: this.tipoClasificacion
          })
          .then(response => {
            this.modalEditar = false;
            this.$nextTick(function () {
              this.cargarLista();
            });
          });
        });
      },
      abreFormRechazarMedio (idMedio) {
        this.formRech.observacion = '';
        this.formRech.id = idMedio;
        this.modalRechazar = true;
      },
      rechazarMedio () {
        if (this.formRech.observacion) {
          let mensaje = '¿Está seguro de rechazar el registro del Medio de Comunicación?';
          this.$confirm(mensaje, () => {
            this.$service.put(`pauteo/medios/${this.formRech.id}/rechazar`, {
              observacion: this.formRech.observacion
            })
            .then(response => {
              this.$nextTick(function () {
                this.cargarLista();
              });
            });
            this.modalRechazar = false;
          });
        } else {
          this.$message.warning('Debe ingresar una observación para continuar.');
        }
      },
      toggleAll () {
        if (this.selected.length) this.selected = [];
        else this.selected = this.items.slice();
      },
      changeSort (column) {
        if (this.pagination.sortBy === column) {
          this.pagination.descending = !this.pagination.descending;
        } else {
          this.pagination.sortBy = column;
          this.pagination.descending = false;
        }
      },
      abreFormVerMedio (idMedio) {
        this.$router.push(`/vermedio/${idMedio}`);
      }
    },
    components: {
    }
  }
</script>