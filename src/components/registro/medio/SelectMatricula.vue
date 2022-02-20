<template>
  <v-layout column>
    <div v-if="!visibleMatriculas">
      <v-alert class="info" value="true">
        {{$t('medio.msgNoMatriculas') }} <v-btn color="info" dark @click="paraRaiz"> &lt; Volver</v-btn>
      </v-alert>
      <v-flex xs12>
        <v-card>
          <v-card-title primary-title>
            <div class="headline">¿Institución no comercial?</div>
          </v-card-title>
          <v-card-text>
            Su institución no se encuentra registrada en Fundempresa, debido a que se trata de una Fundación, Asociación o Entidad Estatal.<br>
            Debe adjuntar un documento de respaldo.
            <v-btn v-if="!esNoComercial" color="primary" dark @click="habilitaNoComercial()"> Continuar</v-btn>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex v-if="esNoComercial" xs12>
        <div v-show="rutaNoComercial === null">
          <file-upload
          :url = "urlNoComercial"
          name = 'archivo'
          label = "Por favor adjunte el documento de respaldo de su institución"
          types = "application/pdf,.jpg,.jpeg,.png "
          :on-success="onSuccessNoComercial"
          ></file-upload>
        </div>
        <div v-show="rutaNoComercial !== null">
          <v-flex xs12>
            <v-alert type="info" :value="true">Documento de respaldo de la institución</v-alert>
          </v-flex>
          <v-flex xs12>
            <v-layout wrap>
              <v-flex xs6>
                <v-btn color="primary" outline tab block dark v-on:click="habilitaCargaNoComercial()"><v-icon>autorenew</v-icon>
                  Reemplazar
                </v-btn>
              </v-flex>
              <v-flex xs6>
                <v-btn color="primary" tab block dark @click.stop="mostrarAdjuntoNoComercial()"><v-icon>visibility</v-icon>
                  Ver
                </v-btn>
              </v-flex>
            </v-layout>
            <v-dialog v-model="dialogNoComercial" max-width="700px" persistent scrollable>
              <v-card>
                <v-toolbar card dark color="primary">
                  <v-toolbar-title>Respaldo de la institución</v-toolbar-title>
                  <v-spacer></v-spacer>
                  <v-btn color="info" @click.stop="dialogNoComercial=false"><v-icon>cancel</v-icon>Cerrar</v-btn>
                </v-toolbar>
                <v-card-text>
                  <div class="pdf-container" v-if="pdfNoComercial">
                    <pdf-view :data="pdfNoComercial" :url="urlPdfNoComercial"></pdf-view>
                  </div>
                  <div class="image-container" v-if="imageNoComercial">
                    <img :src="imageNoComercial" />
                  </div>
                </v-card-text>
              </v-card>
            </v-dialog>
          </v-flex>
          <br>
          <v-flex xs12>
            <v-btn color="primary" dark block @click="$router.push('/registro')"><v-icon>done_outline</v-icon> Continuar</v-btn>
          </v-flex>
        </div>
      </v-flex>
    </div>
    <div v-if="visibleMatriculas">
      <v-alert icon="info" color="info" value="true">
        {{$t('medio.msgElegirMatricula') }}
      </v-alert>
      <v-container fluid grid-list-md class="grey lighten-4">
        <v-layout row wrap justify-center>
          <v-flex xs12 sm6 v-for="matricula in matriculas" :key="matricula.RazonSocial">
            <v-card>
              <v-card-title primary-title>
                <div class="headline">{{matricula.razon_social}}</div>
              </v-card-title>
              <v-card-text>
                N° de matrícula: {{matricula.matricula}}
              </v-card-text>
              <v-card-actions>
                <v-btn block dark @click="seleccionarMatricula(matricula.matricula)">
                  <v-icon>check</v-icon> Seleccionar</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </div>
  </v-layout>
</template>

<script>
import FileUpload from '@/common/util/FileUpload.vue';
import PdfView from '@/common/util/pdf/PdfView';

export default {
  data: () => ({
    matriculas: [],
    visibleMatriculas: true,
    urlNoComercial: `${process.env.API_URL}medios/0/no_comercial`,
    rutaNoComercial: null,
    pdfNoComercial: null,
    imageNoComercial: null,
    dialogNoComercial: false,
    esNoComercial: false,
    form: {
      matricula: {
        matricula: '',
        razonSocial: ''
      }
    }
  }),
  created () {
    let redireccion = '/';
    if (this.$storage.getUser().id_rol === 5 && !this.$storage.getUser().id_medio) {
      redireccion = '/seleccionarMatricula';
    } else {
      if (this.$storage.getUser().id_medio) {
        redireccion = '/registro';
      } else {
        redireccion = '/';
      }
      this.$router.push(redireccion);
    };
    this.visibleMatriculas = true;
    if (this.$storage.getUser().nit) {
      this.$service.get(this.$storage.getUser().nit, 'matriculas')
      .then(response => {
        this.matriculas = response.matriculas.data;
        if (response.matriculas.data.length === 0) {
          this.visibleMatriculas = false;
        }
      }).catch(() => {
        this.visibleMatriculas = false;
        // Caso de que no cuente con matricula
        // .. Comprobar si se trata de una empresa de tipo no comercial como Fundación u Asociación sino debe solucionar en Fundempresa
      });
    }
  },
  methods: {
    seleccionarMatricula (idMatricula) {
      if (this.$storage.getUser().nit) {
        this.$service.get(this.$storage.getUser().nit, 'matriculas/' + idMatricula)
        .then(response => {
          // Crea el objeto medio
          if (response.medio.message === 'OK' && response.medio.data.id) {
            this.$service.get('medios/' + response.medio.data.id)
            .then(response => {
              if (response.medio && response.medio.data) {
                this.$storage.set('medio', response.medio.data);
                this.$router.push('/registro');
              }
            }).catch(() => {
              this.message.error('No se obtuvieron los valores del Medio');
              this.$router.push('/registro');
            });
          }
        }).catch(() => {
          this.message.error('No se pudo procesar la matrícula seleccionada');
        });
      }
    },
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
    habilitaCargaNoComercial () {
      this.rutaNoComercial = null;
    },
    onSuccessNoComercial (file, response) {
      // Método que se ejecuta después de subir archivo att
      if (response.error) {
        this.rutaNocomercial = null;
        this.$message.error('El archivo no pudo ser adjuntado, por favor inténtelo más tarde');
      } else {
        if (response.medio) {
          this.$message.success('¡La operación se realizó correctamente!');
          this.rutaNoComercial = response.medio.ruta_no_comercial;
          this.actualizaMedio();
        }
      }
    },
    mostrarAdjuntoNoComercial () {
      this.dialogNoComercial = true;
      this.urlPdfNoComercial = `${process.env.API_URL}medios/${this.$storage.get('medio').id}/adjuntos?tipo=no_comercial`;
      this.$service.get(`medios/${this.$storage.get('medio').id}/adjuntos?tipo=no_comercial`)
      .then((response) => {
        if (response.adjunto.data) {
          if (response.adjunto.data.formato === 'pdf') {
            this.pdfNoComercial = response.adjunto.data.base64;
            this.imageNoComercial = null;
          } else {
            this.pdfNocomercial = null;
            this.imageNoComercial = `data:image/${response.adjunto.data.formato};base64, ${response.adjunto.data.base64}`;
          }
        }
      }).catch(() => {
        this.$message.error('No se pudo mostrar el archivo.');
      });
    },
    habilitaNoComercial () {
      if (this.$storage.getUser().nit) {
        this.$service.get(this.$storage.getUser().nit, 'matriculas/0000?matricula=false')
        .then(response => {
          // Crea el objeto medio
          if (response.medio.message === 'OK' && response.medio.data.id) {
            this.$service.get('medios/' + response.medio.data.id)
            .then(response => {
              if (response.medio && response.medio.data) {
                this.$storage.set('medio', response.medio.data);
                this.urlNoComercial = `${process.env.API_URL}medios/${this.$storage.get('medio').id}/no_comercial`;
                this.rutaNocomercial = this.$storage.get('medio') ? this.$storage.get('medio').ruta_no_comercial : null;
                this.$nextTick(() => {
                  this.esNoComercial = true;
                });
              }
            }).catch(() => {
              this.message.error('No se obtuvieron los valores del Medio');
              this.$router.push('/registro');
            });
          }
        }).catch(() => {
          this.message.error('No se pudo procesar la operación');
        });
      }
    },
    paraRaiz () {
      this.$storage.set('registro', '/');
      this.$router.push('/');
    }
  },
  components: {
    FileUpload,
    PdfView
  }
};
</script>

