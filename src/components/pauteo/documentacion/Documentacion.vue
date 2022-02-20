<template>
  <v-layout row>
    <v-flex xs12>
      <v-card>
        <v-card-title>
          <h3 class="primary--text"><v-icon info>description</v-icon> Documentación de medios de comunicación</h3>
        </v-card-title>
        <v-card-text>
          <v-form 
            ref="form"
            lazy-validation 
            @submit.prevent="agregarAfps">
            <v-layout wrap>
              <v-flex xs3> <br><p style="white-space: pre-line;">Seleccione la gestión: </p>
              </v-flex>
              <v-flex xs2>
                <v-select 
                  label="Gestión"
                  :items="gestiones"
                  v-model="gestion"
                  item-value="value"
                  item-text="text"                  
                  autocomplete
                ></v-select>
              </v-flex>
              <v-flex xs1></v-flex>
              <v-flex xs6>
                <v-select
                  label="Tipo de medio de comunicación"
                  :items="listadoMedio"
                  v-model.lazy="listaMedio"
                  item-text="nombre"
                  item-value="nombre"
                >
                </v-select>
              </v-flex>
            </v-layout>
          </v-form>
        </v-card-text>
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
                <td class="text-xs-center">{{ props.item.coberturas }}</td>
                <td class="text-xs-center">{{ props.item.nit }}<br><strong>{{ props.item.razon_social }}</strong></td>                
                <td class="text-xs-center">{{ props.item.referencias }}</td>                
                <td class="text-xs-center">{{ props.item.ultima_actualizacion }}</td>
                <td class="text-xs-center">
                  <v-flex xl12>
                    <span title="Ver Detalles">
                      <v-btn icon color="info" dark small @click.native="abreFormAFPs(props.item.id)">
                        <v-icon>visibility</v-icon>
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

    <v-dialog v-model="modalAFPs" max-width="800px" persistent>
      <v-card>
        <v-card-title>
          <b>Listado de AFP's registrados</b>
        </v-card-title>
        <v-card-text>
          <v-data-table 
            v-bind:headers="headersAFP"
            :items="itemsAFP"
            v-bind:pagination.sync="pagination"
            class="elevation-1"
            no-results-text="Sin resultados"
            no-data-text="Sin AFP's registrados"
            rows-per-page-text="Ítems por página"
          >
            <template slot="headers" slot-scope="props">
              <tr>
                <th v-for="(header,key) in props.headers" :key="key" :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']" @click="changeSort(header.value)">
                  <v-icon>arrow_upward</v-icon>
                  {{ header.text }}
                </th>
              </tr>
            </template>
            <template slot="items" slot-scope="props">
              <tr :active="props.selected" @click="props.selected = !props.selected">
                <td class="text-xs-center">{{ props.item.gestion }}</td>
                <td class="text-xs-center">{{ props.item.fecha }}</td>
                <td class="text-xs-center"><b>Ver</b>
                  <v-btn icon color="primary" dark small @click.native="mostrarAdjuntoAfp(props.item.afp1_id)">
                    <v-icon>description</v-icon>
                  </v-btn>
                </td>
                <td class="text-xs-center"><b>Ver</b>
                  <v-btn icon color="primary" dark small @click.native="mostrarAdjuntoAfp(props.item.afp2_id)">
                    <v-icon>description</v-icon>
                  </v-btn>
                </td>
                <td class="text-xs-center">
                  <v-btn color="error" block @click.native="rechazarAFPs(props.item.afp1_id, props.item.afp2_id)"><v-icon dark>close</v-icon>Rechazar</v-btn>
                </td>
              </tr>
            </template>
          </v-data-table>
          <v-card-actions>
            <v-btn color="primary" @click.stop="modalAFPs=false">Cerrar</v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogAfp" max-width="700px" persistent scrollable>
      <v-card>
        <v-toolbar card dark color="primary">
          <v-toolbar-title>Certificado de la AFP</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn color="info" @click.stop="cerrarDialog()"><v-icon>cancel</v-icon>Cerrar</v-btn>
        </v-toolbar>
        <v-card-text>
          <div class="pdf-container" v-if="pdfAfp">
            <pdf-view :data="pdfAfp" :url="urlPdfAfp"></pdf-view>
          </div>
          <div class="image-container" v-if="imageAfp">
            <img :src="imageAfp" />
          </div>
        </v-card-text>
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
  import PdfView from '@/common/util/pdf/PdfView';
  import dateFormat from 'dateformat';

  export default {
    data () {
      return {
        boton1: false,
        boton2: true,
        boton3: true,
        boton4: true,
        modalAFPs: false,
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
          {text: 'Cobertura', value: 'cobertura', align: 'center'},
          {text: 'Nombre', value: 'nombre', align: 'center'},
          {text: 'Contactos', value: 'contactos'},
          {text: 'Fundempresa', value: 'fundempresa'},
          {text: 'AFPs', value: 'afp', align: 'center', sortable: false}
        ],
        headersAFP: [
          {text: 'Gestión', align: 'center', value: 'gestion'},
          {text: 'Fecha y hora', value: 'fecha'},
          {text: 'Futuro de Bolivia', value: 'afp1', align: 'center'},
          {text: 'Previsión', value: 'afp2', align: 'center'},
          {text: 'Opción', value: 'opcion'}
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
        itemsAFP: [],
        listadoMedios: [],
        gestiones: [
          { value: 2018, text: '2018' },
          { value: 2019, text: '2019' }
        ],
        gestion: 2018,
        listaMedio: null,
        listadoMedio: [],
        pdfAfp: null,
        dialogAfp: false,
        urlPdfAfp: null,
        imageAfp: null
      }
    },
    created () {
      this.rol = this.$storage.getUser().id_rol;

      this.$service.get('parametros?grupo=TIPO_MEDIO')
      .then(response => {
        if (response && response.rows.length > 0) {
          this.listadoMedio = response.rows.map((elemento) => {
            return ({'id': elemento.id, 'nombre': elemento.nombre, 'estado': elemento.estado});
          }).filter((elemento) => (elemento.estado === 'ACTIVO' && elemento.id !== 2));
        }
      });

      this.cargarLista();
    },
    methods: {
      cargarLista () {
        this.$service.get(`pauteo/medios/documentacion`)
        .then(response => {
          this.listadoMedios = response.medios.data.rows;
          this.$nextTick(function () {
            this.cargarListaFiltrada();
          });
        });
      },
      clasificar (objeto) {
        this.modalAFPs = true;
      },
      cargarListaFiltrada () {
        if (this.listadoMedios.length > 0) {
          this.items = this.listadoMedios;
          if (this.listaMedio) {
            this.items = this.items.map((elemento) => {
              return ({'id': elemento.id, 'nit': elemento.nit, 'matricula': elemento.matricula, 'razon_social': elemento.razon_social, 'tipo_societario': elemento.tipo_societario, 'coberturas': elemento.coberturas, 'estado': elemento.estado, 'fecha_envio': this.$datetime.format(elemento.fecha_envio, 'dd/MM/YYYY'), 'clasificacion': elemento.clasificacion, 'tipos_medio': elemento.tipos_medio, 'ultima_actualizacion': elemento.ultima_actualizacion, 'referencias': elemento.referencias});
            }).filter((elemento) => elemento.tipos_medio.includes(this.listaMedio));
          };
        } else {
          this.items = [];
        }
      },
      consultaClasificacion (idMedio) {
        this.idMedioSeleccionado = idMedio;
        this.modalAFPs = true;
      },
      rechazarAFPs (afp1, afp2) {
        let mensaje = 'Si procede con rechazar, al medio de comunicación se le habilitará la opción de volver a enviar su documentación ¿Desea continuar?';
        this.$confirm(mensaje, () => {
          this.$service.put(`medios/${this.formRech.id}/afps/${afp1}/rechazar`)
          .then(response => {
            this.$service.put(`medios/${this.formRech.id}/afps/${afp2}/rechazar`)
            .then(response => {
              this.$nextTick(function () {
                this.actualizarAfps(this.formRech.id);
              });
            });
          });
          this.modalRechazar = false;
        });
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
      abreFormAFPs (idMedio) {
        // this.$router.push(`/vermedio/${idMedio}`);
        this.formRech.id = idMedio;
        this.actualizarAfps(idMedio);
        this.modalAFPs = true;
      },
      actualizarAfps (idMedio) {
        this.$service.get(`medios/${idMedio}/afps/`)
        .then(response => {
          this.itemsAFP = response.afp.data.rows.map((elemento) => {
            return ({'gestion': elemento.mes + '/' + elemento.gestion, 'afp1_id': elemento.afps[0].id, 'afp1_sigla': elemento.afps[0]['tipo.sigla'], 'afp1_nombre': elemento.afps[0]['tipo.nombre'], 'afp1_ruta': elemento.afps[0].ruta_adjunto, 'afp2_id': elemento.afps[1].id, 'afp2_sigla': elemento.afps[1]['tipo.sigla'], 'afp2_nombre': elemento.afps[1]['tipo.nombre'], 'afp2_ruta': elemento.afps[1].ruta_adjunto, 'fecha': dateFormat(elemento.afps[0]._updated_at, 'dd/mm/yyyy - HH:MM'), 'estado': elemento.afps[0].estado});
          }).filter((elemento) => elemento.estado === 'ACTIVO');
        });
        this.estaRegistrado = true;
      },
      cerrarDialog () {
        this.dialogAfp = false;
        this.pdfAfp = null;
        this.imageAfp = null;
      },
      mostrarAdjuntoAfp (afpId) {
        this.dialogAfp = true;
        this.urlPdfAfp = `${process.env.API_URL}medios/${this.formRech.id}/afps/${afpId}/adjuntos`;
        this.$service.get(`medios/${this.formRech.id}/afps/${afpId}/adjuntos`)
        .then((response) => {
          if (response.adjunto.data) {
            if (response.adjunto.data.formato === 'pdf') {
              this.pdfAfp = response.adjunto.data.base64;
              this.imageAfp = null;
            } else {
              this.pdfAfp = null;
              this.imageAfp = `data:image/${response.adjunto.data.formato};base64, ${response.adjunto.data.base64}`;
            }
          }
        }).catch(() => {
          this.$message.error('No se pudo mostrar el archivo.');
        });
      }
    },
    components: {
      PdfView
    },
    watch: {
      'listaMedio': function (nuevoValor, antiguoValor) {
        this.cargarListaFiltrada();
      }
    }
  }
</script>