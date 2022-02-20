<template>
  <v-layout row>
    <v-flex xs12 v-if="estaRegistrado">
      <v-card>
        <v-card-title>
          <h3 class="primary--text"><v-icon color="info">note</v-icon> {{ $store.state.user.id_rol !== 2 ? $t('medio.noadeudo.title') : 'Registro' }} </h3>
        </v-card-title>
        <v-card-text>
          <v-form 
            ref="form"
            lazy-validation 
            @submit.prevent="agregarAfps">
            <v-layout wrap>
              <v-flex xs3> <br><p style="white-space: pre-line;">{{ $t('medio.noadeudo.seleccione') }}</p>
              </v-flex>
              <v-flex xs2>
                <v-select 
                  v-model="form.anio"
                  :label="$t('medio.noadeudo.anio')"
                  id="anio"
                  :items="gestiones"
                  item-value="value"
                  item-text="text"                  
                  :required="true"
                  :disabled="adjuntarAfps"
                ></v-select>
              </v-flex>
              <v-flex xs1></v-flex>
              <v-flex xs2>
                <v-select 
                  v-model="form.mes"
                  :label="$t('medio.noadeudo.mes')"
                  id="mes"
                  :items="meses"
                  item-value="value"
                  item-text="text"
                  :required="true"
                  :disabled="adjuntarAfps"
                ></v-select>
              </v-flex>
              <v-flex xs1></v-flex>
              <v-flex xs3>
                <v-btn color="primary" tab block dark @click.stop="guardarAfp()"><v-icon>search</v-icon>
                  Seleccionar
                </v-btn>
              </v-flex>
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
              <v-flex xs12 v-if="adjuntarAfps">
                <v-layout wrap>
                  <v-flex xs4>
                    <div v-show="rutaAfp1 === null">
                      <file-upload
                      :url = "urlAfp1"
                      name = 'archivo'
                      label = "Por favor adjunte el informe de no Adeudo de AFP Futuro"
                      types = "application/pdf"
                      :on-success="onSuccessAfp1"
                      ></file-upload>
                    </div>
                    <div v-show="rutaAfp1 !== null">
                      <v-flex xs12>
                        <v-alert type="info" :value="true">Certificado de la AFP Futuro cargada</v-alert>
                      </v-flex>
                      <v-flex xs12>
                        <v-layout wrap>
                          <v-flex xs6>
                            <v-btn color="primary" outline tab block dark v-on:click="habilitaCargaAfp1()"><v-icon>autorenew</v-icon>
                              Reemplazar
                            </v-btn>
                          </v-flex>
                          <v-flex xs6>
                            <v-btn color="primary" tab block dark @click.stop="mostrarAdjuntoAfp1()"><v-icon>visibility</v-icon>
                              Ver
                            </v-btn>
                          </v-flex>
                        </v-layout>
                        <v-dialog v-model="dialogAfp1" max-width="700px" persistent scrollable>
                          <v-card>
                            <v-toolbar card dark color="primary">
                              <v-toolbar-title>Certificado de la AFP</v-toolbar-title>
                              <v-spacer></v-spacer>
                              <v-btn color="info" @click.stop="dialogAfp1=false"><v-icon>cancel</v-icon>Cerrar</v-btn>
                            </v-toolbar>
                            <v-card-text>
                              <div class="pdf-container" v-if="pdfAfp1">
                                <pdf-view :data="pdfAfp1" :url="urlPdfAfp1"></pdf-view>
                              </div>
                              <div class="image-container" v-if="imageAfp1">
                                <img :src="imageAfp1" />
                              </div>
                            </v-card-text>
                          </v-card>
                        </v-dialog>
                      </v-flex>
                    </div>
                  </v-flex>
                  <v-flex xs1></v-flex>
                  <v-flex xs4>
                    <div v-show="rutaAfp2 === null">
                      <file-upload
                      :url = "urlAfp2"
                      name = 'archivo'
                      label = "Por favor adjunte el informe de no Adeudo de AFP Previsión"
                      types = "application/pdf"
                      :on-success="onSuccessAfp2"
                      ></file-upload>
                    </div>
                    <div v-show="rutaAfp2 !== null">
                      <v-flex xs12>
                        <v-alert type="info" :value="true">Certificado de la AFP Futuro cargada</v-alert>
                      </v-flex>
                      <v-flex xs12>
                        <v-layout wrap>
                          <v-flex xs6>
                            <v-btn color="primary" outline tab block dark v-on:click="habilitaCargaAfp2()"><v-icon>autorenew</v-icon>
                              Reemplazar
                            </v-btn>
                          </v-flex>
                          <v-flex xs6>
                            <v-btn color="primary" tab block dark @click.stop="mostrarAdjuntoAfp2()"><v-icon>visibility</v-icon>
                              Ver
                            </v-btn>
                          </v-flex>
                        </v-layout>
                        <v-dialog v-model="dialogAfp2" max-width="700px" persistent scrollable>
                          <v-card>
                            <v-toolbar card dark color="primary">
                              <v-toolbar-title>Autorización de la AFP</v-toolbar-title>
                              <v-spacer></v-spacer>
                              <v-btn color="info" @click.stop="dialogAfp2=false"><v-icon>cancel</v-icon>Cerrar</v-btn>
                            </v-toolbar>
                            <v-card-text>
                              <div class="pdf-container" v-if="pdfAfp2">
                                <pdf-view :data="pdfAfp2" :url="urlPdfAfp2"></pdf-view>
                              </div>
                              <div class="image-container" v-if="imageAfp2">
                                <img :src="imageAfp2" />
                              </div>
                            </v-card-text>
                          </v-card>
                        </v-dialog>
                      </v-flex>
                    </div>
                  </v-flex>
                  <v-flex xs1></v-flex>
                  <v-flex xs2>
                    <br>
                    <v-btn color="primary" outline tab block dark @click.stop="cancelarAfps()"><v-icon dark>cancel</v-icon>Cancelar</v-btn>
                    <v-btn color="info" block type="submit" ><v-icon dark>arrow_downward</v-icon>Adjuntar certificados</v-btn>
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-form>
          
          <v-data-table 
            v-bind:headers="headers"
            :items="items"
            v-bind:pagination.sync="pagination"
            class="elevation-1"
            no-results-text="Sin resultados"
            no-data-text="Sin AFP's registrados"
            rows-per-page-text="Ítems por página"
            :rowsPerPageItems="[12, 25, 50, { text: ' * ', value: -1 }]"
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
                <td class="text-xs-center">{{ props.item.gestion }} <b class="error--text">{{ props.item.estado === 'RECHAZADO' ? ' - ' + props.item.estado : '' }}</b></td>
                <td class="text-xs-center"><b>{{ props.item.afp1_nombre }}</b>
                  <v-btn icon color="primary" dark small @click.native="mostrarAdjuntoAfp(props.item.afp1_id)">
                    <v-icon>description</v-icon>
                  </v-btn>
                </td>
                <td class="text-xs-center"><b>{{ props.item.afp2_nombre }}</b>
                  <v-btn icon color="primary" dark small @click.native="mostrarAdjuntoAfp(props.item.afp2_id)">
                    <v-icon>description</v-icon>
                  </v-btn>
                </td>
                <td class="text-xs-center">{{ props.item.fecha }}</td>
              </tr>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-flex>
    <v-flex xs12 v-if="!estaRegistrado">
      <p>DEBE REALIZAR PRIMERO SU REGISTRO!</p>
    </v-flex>
  </v-layout>
</template>

<script>
  /* eslint-disable semi */
  import FileUpload from '@/common/util/FileUpload.vue';
  import validate from '@/common/mixins/validate';
  import crud from '@/common/util/crud-table/mixins/crud-table';
  import PdfView from '@/common/util/pdf/PdfView';
  import dateFormat from 'dateformat';

  export default {
    mixins: [ crud, validate ],
    data () {
      return {
        pagination: {
          sortBy: 'name'
        },
        selected: [],
        headers: [
          {text: 'Gestión', align: 'center', value: 'gestion'},
          {text: 'AFP 1', value: 'afp1', align: 'center'},
          {text: 'AFP 2', value: 'afp2', align: 'center'},
          {text: 'Fecha y hora', value: 'fecha'}
        ],
        gestiones: [
          { value: 2018, text: '2018' },
          { value: 2019, text: '2019' },
          { value: 2020, text: '2020' }
        ],
        meses: [
          { value: 1, text: 'Enero' },
          { value: 2, text: 'Febrero' },
          { value: 3, text: 'Marzo' },
          { value: 4, text: 'Abril' },
          { value: 5, text: 'Mayo' },
          { value: 6, text: 'Junio' },
          { value: 7, text: 'Julio' },
          { value: 8, text: 'Agosto' },
          { value: 9, text: 'Septiembre' },
          { value: 10, text: 'Octubre' },
          { value: 11, text: 'Noviembre' },
          { value: 12, text: 'Diciembre' }
        ],
        form: {
          anio: null,
          mes: null
        },
        estaRegistrado: false,
        items: [],
        afps: [],
        idUsuarioDestion: null,
        estado: null,
        rol: null,
        show: false,
        pdfAfp: null,
        pdfAfp1: null,
        pdfAfp2: null,
        imageAfp: null,
        imageAfp1: null,
        imageAfp2: null,
        dialogAfp: false,
        dialogAfp1: false,
        dialogAfp2: false,
        adjuntarAfps: false,
        urlPdfAfp1: null,
        urlPdfAfp2: null,
        urlAfp1: `${process.env.API_URL}medios/${this.$storage.get('medio') ? this.$storage.get('medio').id : 0}/afps/0/adjuntos`,
        urlAfp2: `${process.env.API_URL}medios/${this.$storage.get('medio') ? this.$storage.get('medio').id : 0}/afps/0/adjuntos`,
        rutaAfp1: this.$storage.get('medio') ? this.$storage.get('medio').ruta_afp1 ? this.$storage.get('medio').ruta_afp1 : null : null,
        rutaAfp2: this.$storage.get('medio') ? this.$storage.get('medio').ruta_afp2 ? this.$storage.get('medio').ruta_afp2 : null : null
      }
    },
    created () {
      this.rol = this.$storage.getUser().rol.id_rol;
    },
    mounted () {
      this.actualizarAfps();
    },
    methods: {
      agregarAfps () {
        if (this.rutaAfp1 && this.rutaAfp2) {
          this.$confirm('<div style="text-align: justify;">En cumplimiento del Artículo 1322° del Código Civil y Art. 157° Parágrafo IV del Código Procesal Civil, sujeto en caso de inexactitud o falsedad a la cancelación del trámite de constitución y, a las penalidades establecidas en el Art. 169° del Código Penal como falso testimonio, DECLARO que la información adjunta es fidedigna. <br><br> Por tanto: <br><br> Acepto y declaro la veracidad de la información presentada.</div>', () => {
            this.$service.put(`medios/${this.$storage.get('medio').id}/afps?gestion=${this.form.anio}&mes=${this.form.mes}`)
            .then(response => {
              this.afps = [];
              this.adjuntarAfps = false;
              this.rutaAfp1 = null;
              this.rutaAfp2 = null;
              this.actualizarAfps();
            })
          }, () => {
            this.adjuntarAfps = true;
          });
        } else {
          this.$message.error('Debe seleccionar los archivos PDF\'s correspondientes.');
        }
      },
      cancelarAfps () {
        this.adjuntarAfps = false;
        this.rutaAfp1 = null;
        this.rutaAfp2 = null;
      },
      actualizarAfps () {
        if (this.$storage.get('medio')) {
          this.$service.get(`medios/${this.$storage.get('medio').id}/afps/`)
          .then(response => {
            this.items = response.afp.data.rows.map((elemento) => {
              return ({'gestion': elemento.mes + '/' + elemento.gestion, 'afp1_id': elemento.afps[0].id, 'afp1_sigla': elemento.afps[0]['tipo.sigla'], 'afp1_nombre': elemento.afps[0]['tipo.nombre'], 'afp1_ruta': elemento.afps[0].ruta_adjunto, 'afp2_id': elemento.afps[1].id, 'afp2_sigla': elemento.afps[1]['tipo.sigla'], 'afp2_nombre': elemento.afps[1]['tipo.nombre'], 'afp2_ruta': elemento.afps[1].ruta_adjunto, 'fecha': dateFormat(elemento.afps[0]._updated_at, 'dd/mm/yyyy - HH:MM'), 'estado': elemento.afps[0].estado});
            }).filter((elemento) => elemento.estado === 'ACTIVO' || elemento.estado === 'RECHAZADO');
          });
          this.estaRegistrado = true;
        }
      },
      obtenerGestion (valor) {
        for (var i = 0; i < this.items.length; i++) {
          if (this.items[i].gestion === valor && this.items[i].estado === 'ACTIVO') {
            return true;
          }
        }
        return false;
      },
      guardarAfp () {
        if (this.form.mes === null || this.form.anio === null) {
          this.$message.error('Seleccione el año y mes de la gestión que quiere registrar.');
        } else {
          if (this.obtenerGestion(this.form.mes + '/' + this.form.anio)) {
            this.$message.error('Ya se ha registrado la gestión seleccionada.');
          } else {
            this.$service.post(`medios/${this.$storage.get('medio').id}/afps/`, {gestion: this.form.anio, mes: this.form.mes}).then(response => {
              this.afps = response.afp.data;
              this.adjuntarAfps = true;

              this.rutaAfp1 = this.afps[0].ruta_adjunto;
              this.rutaAfp2 = this.afps[1].ruta_adjunto;

              this.urlAfp1 = `${process.env.API_URL}medios/${this.$storage.get('medio').id}/afps/${this.afps[0].id}/adjuntos`;
              this.urlAfp2 = `${process.env.API_URL}medios/${this.$storage.get('medio').id}/afps/${this.afps[1].id}/adjuntos`;
            }).catch(() => {
              this.$message.error('Ya se ha registrado la gestión seleccionada.');
            });
          }
        }
      },
      mostrarAdjuntoAfp (afpId) {
        this.dialogAfp = true;
        this.urlPdfAfp = `${process.env.API_URL}medios/${this.$storage.get('medio').id}/afps/${afpId}/adjuntos`;
        this.$service.get(`medios/${this.$storage.get('medio').id}/afps/${afpId}/adjuntos`)
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
      },
      mostrarAdjuntoAfp1 () {
        this.dialogAfp1 = true;
        this.urlPdfAfp1 = `${process.env.API_URL}medios/${this.$storage.get('medio').id}/afps/${this.afps[0].id}/adjuntos`;
        this.$service.get(`medios/${this.$storage.get('medio').id}/afps/${this.afps[0].id}/adjuntos`)
        .then((response) => {
          if (response.adjunto.data) {
            if (response.adjunto.data.formato === 'pdf') {
              this.pdfAfp1 = response.adjunto.data.base64;
              this.imageAfp1 = null;
            } else {
              this.pdfAfp1 = null;
              this.imageAfp1 = `data:image/${response.adjunto.data.formato};base64, ${response.adjunto.data.base64}`;
            }
          }
        }).catch(() => {
          this.$message.error('No se pudo mostrar el archivo.');
        });
      },
      mostrarAdjuntoAfp2 () {
        this.dialogAfp2 = true;
        this.urlPdfAfp2 = `${process.env.API_URL}medios/${this.$storage.get('medio').id}/afps/${this.afps[1].id}/adjuntos`;
        this.$service.get(`medios/${this.$storage.get('medio').id}/afps/${this.afps[1].id}/adjuntos`)
        .then((response) => {
          if (response.adjunto.data) {
            if (response.adjunto.data.formato === 'pdf') {
              this.pdfAfp2 = response.adjunto.data.base64;
              this.imageAfp2 = null;
            } else {
              this.pdfAfp2 = null;
              this.imageAfp2 = `data:image/${response.adjunto.data.formato};base64, ${response.adjunto.data.base64}`;
            }
          }
        }).catch(() => {
          this.$message.error('No se pudo mostrar el archivo.');
        });
      },
      habilitaCargaAfp1 () {
        this.rutaAfp1 = null;
      },
      habilitaCargaAfp2 () {
        this.rutaAfp2 = null;
      },
      dialogRegistrar (idSegimientoTramite, valor) {
        if (!valor) {
          this.$confirm('¿Está seguro de registrar las afp\'s?', () => {
            this.agregarAfps(this.idUsuarioDestion, idSegimientoTramite)
          });
        }
        if (valor) {
          this.dialogAsigTecnico = true;
          this.idSegimientoTramite = idSegimientoTramite;
        }
      },
      cerrarDialog () {
        this.dialogAfp = false;
        this.pdfAfp = null;
        this.imageAfp = null;
        this.actualizarAfps();
      },
      onSuccessAfp1 (file, response) {
        // Método que se ejecuta después de subir archivo afp1
        if (response.error) {
          this.rutaAfp1 = null;
          this.$message.error('El archivo no pudo ser adjuntado, por favor inténtelo más tarde');
        } else {
          if (response.afp) {
            this.$message.success('¡La operación se realizó correctamente!');
            this.rutaAfp1 = response.afp.data.ruta_adjunto;
          }
        }
      },
      onSuccessAfp2 (file, response) {
        // Método que se ejecuta después de subir archivo afp2
        if (response.error) {
          this.rutaAfp2 = null;
          this.$message.error('El archivo no pudo ser adjuntado, por favor inténtelo más tarde');
        } else {
          if (response.afp) {
            this.$message.success('¡La operación se realizó correctamente!');
            this.rutaAfp2 = response.afp.data.ruta_adjunto;
          }
        }
      },
      changeSort (column) {
        if (this.pagination.sortBy === column) {
          this.pagination.descending = !this.pagination.descending;
        } else {
          this.pagination.sortBy = column;
          this.pagination.descending = false;
        }
      }
    },
    components: {
      FileUpload,
      PdfView
    }
  }
</script>