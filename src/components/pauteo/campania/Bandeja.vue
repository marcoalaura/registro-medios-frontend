<template>
  <section>
    <h3 class="primary--text"><v-icon info>perm_camera_mic</v-icon> Campañas </h3>
    <v-card>
      <v-card-text>
        <v-layout wrap row>
          <v-flex xs1>
          </v-flex>
          <v-flex xs5>
            <v-tooltip bottom v-if="rol===3">
              <v-btn slot="activator" dark round large color="primary" @click="modalCreate = true">
                <v-icon dark>add</v-icon>
              </v-btn>
              <span>CREAR CAMPAÑA</span>
            </v-tooltip>
          </v-flex>
          <v-flex xs2>
          </v-flex>
          <v-flex xs4>
            <v-toolbar>
              <v-text-field single-line v-model="filtroCampana" hint="Realizar la búsqueda por nombre y/o descripción de la Campaña."></v-text-field>
              <v-btn icon @click="filtrarCampanas()">
                <v-icon>search</v-icon>
              </v-btn>
            </v-toolbar>
          </v-flex>
        </v-layout>
      </v-card-text>
      <v-card-text>
        <v-data-table
          v-model="campanasFiltradas"
          :headers="headers"
          :items="campanasFiltradas"
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
                <v-icon v-if="header.value !== 'numero' && header.value !== 'acciones'" small>arrow_upward</v-icon>
                {{ header.text }}
              </th>
            </tr>
          </template>
          <template slot="items" slot-scope="props">
            <tr>
              <td class="text-xs-center">{{ props.item.codigo }}</td>
              <td>{{ props.item.nombre }}</td>
              <td>{{ props.item.descripcion }}</td>
              <td class="text-xs-center">{{ obtieneFechaString(props.item.fecha_inicio) }} - {{ obtieneFechaString(props.item.fecha_fin) }}</td>
              <td class="text-xs-center">{{ props.item.tipo_campana.nombre }}</td>
              <td class="text-xs-center">{{ props.item.estado }}</td>
              <td class="text-xs-center">
                <v-btn flat icon color="success" @click="verCampana(props.item.id)">
                  <v-icon>visibility</v-icon>
                </v-btn>
                <v-btn v-if="rol===3 && (props.item.estado==='NUEVO' || props.item.estado==='OBSERVADO')" flat icon color="info" @click.stop="editarCampanaCompleta(props.item.id)">
                  <v-icon>edit</v-icon>
                </v-btn>
                <v-btn v-if="rol===3 && (props.item.estado==='NUEVO' || props.item.estado==='OBSERVADO')" flat icon color="error" @click.stop="eliminarCampana(props.item.id)">
                  <v-icon>delete</v-icon>
                </v-btn>
                <v-btn v-if="rol===3 && (props.item.estado==='APROBADO' || props.item.estado==='GENERADO')" flat icon color="secondary" @click.stop="obtieneCorrelativos(props.item)">
                  <v-icon>picture_as_pdf</v-icon>
                </v-btn>
              </td>
            </tr>
          </template>
          <template slot="no-data">
              Aún no existen campañas.
          </template>
        </v-data-table>
      </v-card-text>
      <v-dialog v-model="modalCreate" max-width="500px" persistent>
        <v-card>
          <v-card-title>
            <b>Crear campaña</b>
          </v-card-title>
          <v-form ref="form" lazy-validation @submit.prevent="crearCampana">
            <v-card-text>
              <v-layout wrap align-center>
                <v-flex xs1>
                </v-flex>
                <v-flex xs10>
                  <v-text-field
                    name="nombre"
                    id="nombre"
                    v-model="form.nombre"
                    maxlength="150"
                    :rules="$validate(['required'])"
                    label="Nombre"
                    required
                  ></v-text-field>
                </v-flex>
                <v-flex xs1>
                </v-flex>
              </v-layout>
              <v-layout wrap align-center>
                <v-flex xs1>
                </v-flex>
                <v-flex xs10>
                  <v-text-field
                    name="descripcion"
                    id="descripcion"
                    v-model="form.descripcion"
                    maxlength="150"
                    :rules="$validate(['required'])"
                    label="Descripción"
                    multi-line
                    required
                    counter="150"
                  ></v-text-field>
                </v-flex>
                <v-flex xs1>
                </v-flex>
              </v-layout>
              <v-layout wrap>
                <v-flex xs1>
                </v-flex>
                <v-flex xs5>
                  <v-select
                    :items="tiposMedio"
                    v-model="form.tipoMedioEscogido"
                    label="Tipo de Campaña"
                    single-line
                    item-text="nombre"
                    item-value="id"
                    :rules="$validate(['required'])"
                    required
                  ></v-select>
                </v-flex>
                <v-flex xs1>
                </v-flex>
                <v-flex xs4>
                  <v-text-field
                    name="duracion"
                    id="duracion"
                    v-model="form.duracion"
                    maxlength="150"
                    hint="Duración en segundos"
                    persistent-hint
                    :rules="$validate(['required'])"
                    type="Integer"
                    required
                    @keydown.native="$filter.numeric($event)"
                    v-if="form.tipoMedioEscogido !== 3"
                  ></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout wrap align-center>
                <v-flex xs1>
                </v-flex>
                <v-flex xs5>
                  <v-menu
                    ref="menu1"
                    :close-on-content-click="false"
                    v-model="menu1"
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
                      v-model="dateFormattedInicio"
                      label="Fecha de Inicio"
                      prepend-icon="event"
                      @blur="form.fechaInicio = parseDate(dateFormattedInicio)"
                      :rules="$validate(['required'])"
                      required
                    ></v-text-field>
                    <v-date-picker
                      v-model="form.fechaInicio"
                      no-title
                      @input="menu1 = false"
                      locale="es-bo"
                    ></v-date-picker>
                  </v-menu>
                </v-flex>
                <v-flex xs5>
                  <v-menu
                    ref="menu2"
                    :close-on-content-click="false"
                    v-model="menu2"
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
                      v-model="dateFormattedFin"
                      label="Fecha Fin"
                      prepend-icon="event"
                      @blur="form.fechaFin = parseDate(dateFormattedFin)"
                      :rules="$validate(['required'])"
                      required
                    ></v-text-field>
                    <v-date-picker
                      v-model="form.fechaFin"
                      no-title
                      @input="menu2 = false"
                      locale="es-bo"
                    ></v-date-picker>
                  </v-menu>
                </v-flex>
                <v-flex xs1>
                </v-flex>
              </v-layout>
            </v-card-text>
            <v-card-actions>
              <v-btn color="primary" @click.stop="modalCreate=false">Cancelar</v-btn>
              <v-spacer></v-spacer>
              <v-btn color="info" type="submit">
                Crear campaña
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-dialog>
      <v-dialog v-model="modalDocumentacion" max-width="600px" persistent>
        <v-card v-if='!verDocumentos'>
          <v-card-title>
            <b>GENERAR DOCUMENTACIÓN</b>
          </v-card-title>
          <v-form
            ref="formD"
            lazy-validation
            @submit.prevent="generarDocumentacion()">
            <v-card-text>
              <v-layout wrap>
                <v-flex xs6>
                  <br><p>Número de CITE:</p>
                </v-flex>
                <v-flex xs6>
                  <v-text-field
                    name="cite"
                    id="cite"
                    v-model="formD.cite"
                    maxlength="20"
                    :rules="$validate(['required'])"
                    required
                    auto-grow
                  ></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout wrap>
                <v-flex xs6>
                  <br><p>Correlativo de la visual/resumen:</p>
                </v-flex>
                <v-flex xs6>
                  <v-text-field
                    name="correlativoVisual"
                    id="correlativoVisual"
                    v-model="formD.correlativoVisual"
                    maxlength="20"
                    :rules="$validate(['required'])"
                    required
                  ></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout wrap>
                <v-flex xs6>
                  <br><p>Correlativo de INICIO de las órdenes de publicidad:</p>
                </v-flex>
                <v-flex xs6>
                  <v-text-field
                    name="correlativoInicioOrden"
                    id="correlativoInicioOrden"
                    v-model="formD.correlativoInicioOrden"
                    maxlength="20"
                    :rules="$validate(['required'])"
                    required
                  ></v-text-field>
                </v-flex>
              </v-layout>
            </v-card-text>
            <v-card-actions>
              <v-btn color="primary" @click.stop="modalDocumentacion = false">Cerrar</v-btn>
              <v-spacer></v-spacer>
              <v-btn color="info" type="submit" ><v-icon dark>check</v-icon>GENERAR DOCUMENTACIÓN</v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
        <v-card v-if='verDocumentos'>
          <v-card-title>
            <b>DOCUMENTACIÓN GENERADA</b>
          </v-card-title>
          <v-card-text>
            <v-layout wrap>
              <v-flex xs12>
                <p>Se ha generado los siguientes documentos:</p>
              </v-flex>
              <v-flex xs12>
                <v-btn color="info" tab block dark @click.stop="mostrarAdjuntoOrdenes()"><v-icon>documents</v-icon>
                  Ordenes publicitarias
                </v-btn>
                <v-btn 
                  v-if='this.tipoCampana==="TV" || this.tipoCampana==="Radio"' 
                  color="info" 
                  tab 
                  block 
                  dark 
                  @click.stop="mostrarAdjuntoVisual()"><v-icon>documents</v-icon>
                  Resumen visual
                </v-btn>
                <v-btn 
                  v-if='this.tipoCampana==="Prensa"' color="info" 
                  tab 
                  block 
                  dark 
                  @click.stop="mostrarAdjuntoPrensa()"><v-icon>documents</v-icon>
                  Resumen prensa
                </v-btn>
                <v-btn color="info" tab block dark @click.stop="mostrarAdjuntoFSC()"><v-icon>documents</v-icon>
                  Formuario de Solicitud de Contratación (FSC)
                </v-btn>
              </v-flex>
            </v-layout>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click.stop="modalDocumentacion = false">Cerrar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="dialogOrden" max-width="1200px" persistent scrollable>
        <v-card>
          <v-toolbar card dark color="primary">
            <v-toolbar-title>Ordenes Publicitarias</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn color="info" @click.stop="dialogOrden=false; pdfOrden=null"><v-icon>cancel</v-icon>Cerrar</v-btn>
          </v-toolbar>
          <v-card-text>
            <div class="pdf-container" v-if="pdfOrden">
              <pdf-view :data="pdfOrden" :url="urlPdfOrden" nombre="OrdenPublicidad"></pdf-view>
            </div>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialogVisual" max-width="1200px" persistent scrollable>
        <v-card>
          <v-toolbar card dark color="primary">
            <v-toolbar-title>Resumen Visual</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn color="info" @click.stop="dialogVisual=false; pdfVisual=null"><v-icon>cancel</v-icon>Cerrar</v-btn>
          </v-toolbar>
          <v-card-text>
            <div class="pdf-container" v-if="pdfVisual">
              <pdf-view :data="pdfVisual" :url="urlPdfVisual"></pdf-view>
            </div>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialogFSC" max-width="1200px" persistent scrollable>
        <v-card>
          <v-toolbar card dark color="primary">
            <v-toolbar-title>Formulario de Solicitud de Contratación</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn color="info" @click.stop="dialogFSC=false; ; pdfFSC=null"><v-icon>cancel</v-icon>Cerrar</v-btn>
          </v-toolbar>
          <v-card-text>
            <div class="pdf-container" v-if="pdfFSC">
              <pdf-view :data="pdfFSC" :url="urlPdfFSC"></pdf-view>
            </div>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-card>
  </section>
</template>
<script>

import CrudTable from '@/common/util/crud-table/CrudTable.vue';
import validate from '@/common/mixins/validate';
import Campana from './mixins/campania.js';
import dateFormat from 'dateformat';
import PdfView from '@/common/util/pdf/PdfView';

export default {
  mixins: [ validate, Campana ],
  created () {
    this.rol = this.$storage.getUser().id_rol;
    if (this.rol === 5) {
      this.$router.push('/');
    } else {
      this.$service.get('parametros?grupo=TIPO_MEDIO')
      .then(response => {
        if (response && response.rows.length > 0) {
          this.tiposMedio = response.rows.map((elemento) => {
            return ({'id': elemento.id, 'nombre': elemento.nombre, 'estado': elemento.estado});
          }).filter((elemento) => elemento.estado === 'ACTIVO' && !elemento.nombre.includes('Productor') && !elemento.nombre.includes('FM') && !elemento.nombre.includes('AM'));
        }
      });
      this.recargaCampanas();
    }
  },
  data () {
    return {
      headers: [
        { text: 'Código', value: 'codigo' },
        { text: 'Nombre', value: 'nombre' },
        { text: 'Descripción', value: 'descripcion' },
        { text: 'Duración', value: 'duracion' },
        { text: 'Tipo', value: 'tipo' },
        { text: 'Estado', value: 'estado' },
        { text: 'Acciones', value: 'acciones', sortable: false }
      ],
      pagination: {
        sortBy: 'nombre'
      },
      filtroCampana: '',
      valid: true,
      campanas: [],
      campanasFiltradas: [],
      campanaSeleccionada: null,
      form: {
        nombre: '',
        descripcion: '',
        fechaInicio: null,
        fechaFin: null,
        tipoMedioEscogido: 3,
        duracion: null
      },
      rol: null,
      modalCreate: false,
      dateFormattedInicio: null,
      dateFormattedFin: null,
      tiposMedio: [],
      menu1: false,
      menu2: false,
      modalDocumentacion: false,
      verDocumentos: false,
      dialogOrden: false,
      pdfOrden: null,
      urlPdfOrden: '',
      dialogVisual: false,
      pdfVisual: false,
      urlPdfVisual: '',
      dialogFSC: false,
      pdfFSC: false,
      urlPdfFSC: '',
      formD: {
        cite: null,
        correlativoVisual: null,
        correlativoInicioOrden: null,
        idCampanaAprobada: null
      },
      tipoCampana: ''
    };
  },
  computed: {
  },
  methods: {
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
    obtieneFechaString (fecha) {
      return dateFormat(fecha, 'dd/mm/yyyy', true);
    },
    changeSort (column) {
      if (this.pagination.sortBy === column) {
        this.pagination.descending = !this.pagination.descending;
      } else {
        this.pagination.sortBy = column;
        this.pagination.descending = false;
      }
    },
    obtieneCorrelativos (campana) {
      const idCampana = campana.id;
      this.obtieneCampana(idCampana);
      if (campana.estado === 'GENERADO') {
        this.verDocumentos = true;
      } else {
        this.verDocumentos = false;
        this.formD.cite = null;
        this.formD.correlativoVisual = null;
        this.formD.correlativoInicioOrden = null;
      }
      this.formD.idCampanaAprobada = idCampana;
      this.modalDocumentacion = true;
    },
    obtieneCampana (idCampana) {
      this.campanaSeleccionada = this.campanas.filter(elemento => elemento.id === idCampana);
      this.tipoCampana = this.campanaSeleccionada[0].tipo_campana.sigla;
    },
    generarDocumentacion () {
      // generar pdfs
      if (this.$refs.formD.validate()) {
        this.$confirm('¿Está seguro de GENERAR la DOCUMENTACIÓN de la campaña?', () => {
          this.$service.put(`campanas/${this.formD.idCampanaAprobada}/correlativos`, {
            'cite': this.formD.cite,
            'inicio_correlativo': this.formD.correlativoInicioOrden,
            'visual_correlativo': this.formD.correlativoVisual
          })
          .then((response) => {
            if (response && response.campana) {
              this.$message.success('La documentación de la campaña fue generada correctamente.');
              // this.$router.push('/bandejaPauteo');
              this.verDocumentos = true;
              this.recargaCampanas();
            }
          }).catch((error) => {
            this.$message.error('No se puede generar la documentacion.' + error);
          });
          // DEBES CERRAR EL MODAL AL FINALIZAR
        });
      }
    },
    mostrarAdjuntoOrdenes () {
      this.dialogOrden = true;
      // this.urlPdfOrden = `${process.env.API_URL}campanas/${this.formD.idCampanaAprobada}/medios_relacionados/${this.campanaSeleccionada[0].id}/reportes/ordenes`;
      this.urlPdfOrden = `${process.env.API_URL}campanas/${this.formD.idCampanaAprobada}/reportes/ordenes`;
      // this.$service.get(`campanas/${this.formD.idCampanaAprobada}/medios_relacionados/${this.campanaSeleccionada[0].id}/reportes/ordenes`)
      this.$service.get(`campanas/${this.formD.idCampanaAprobada}/reportes/ordenes`)
      .then((response) => {
        if (response.reporte) {
          this.pdfOrden = response.reporte.data;
          console.log('*** this.pdfOrden: ', this.pdfOrden);
        }
      }).catch(() => {
        this.$message.error('No se pudo mostrar el archivo.');
      });
    },
    mostrarAdjuntoVisual () {
      this.dialogVisual = true;
      this.urlPdfVisual = `${process.env.API_URL}campanas/${this.formD.idCampanaAprobada}/reportes/visual`;
      this.$service.get(`campanas/${this.formD.idCampanaAprobada}/reportes/visual`)
      // this.$service.get(`campanas/${this.formD.idCampanaAprobada}/costoCampanaTV`)
      .then((response) => {
        if (response.reporte) {
          this.pdfVisual = response.reporte.data;
        }
      }).catch(() => {
        this.$message.error('No se pudo mostrar el archivo.');
      });
    },
    mostrarAdjuntoFSC () {
      this.dialogFSC = true;
      this.urlPdfFSC = `${process.env.API_URL}campanas/${this.formD.idCampanaAprobada}/reportes/fsc`;
      this.$service.get(`campanas/${this.formD.idCampanaAprobada}/reportes/fsc`)
      .then((response) => {
        if (response.reporte) {
          this.pdfFSC = response.reporte.data;
        }
      }).catch(() => {
        this.$message.error('No se pudo mostrar el archivo.');
      });
    },
    mostrarAdjuntoPrensa () {
      this.dialogOPP = true;
      this.urlPdfOPP = `${process.env.API_URL}campanas/${this.formD.idCampanaAprobada}/reportes/fsc`;
      this.$service.get(`campanas/${this.formD.idCampanaAprobada}/reportes/opp`)
      .then((response) => {
        if (response.reporte) {
          this.pdfFSC = response.reporte.data;
        }
      }).catch(() => {
        this.$message.error('No se pudo mostrar el archivo.');
      });
    }
  },
  components: {
    CrudTable,
    PdfView
  },
  watch: {
    'form.fechaInicio' (val) {
      this.dateFormattedInicio = this.formatDate(this.form.fechaInicio);
    },
    'form.fechaFin' (val) {
      this.dateFormattedFin = this.formatDate(this.form.fechaFin);
    }

  }
};
</script>
