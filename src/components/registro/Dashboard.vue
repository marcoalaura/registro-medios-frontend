<template>
  <section>
    <h3>{{ $t('app.welcome') }} {{ $t('app.title') }} </h3>
    <v-card>
      <v-card-text>
        <p>{{ $t('app.indicacion1') }}</p>
        <p>{{ $t('app.indicacion2') }}</p>
        <p>{{ $t('app.indicacion3') }}</p>
        <v-layout row wrap>
        <v-flex xs2>
        </v-flex>
        <v-flex xs8 align-center>
        <v-layout row wrap>
          <v-flex xs4 >
            <v-card>
              <v-card-media :src="registro_src" @click="$router.push('/registro')" height="300px">
              </v-card-media>
              <v-card-actions>
                <v-btn flat color="orange" href="#/registro">1. {{ $t('app.bpaso1') }}</v-btn>
                <v-spacer></v-spacer>
                <v-btn icon @click.native="showRegistro = !showRegistro">
                  <v-icon>{{ showRegistro ? 'keyboard_arrow_down' : 'keyboard_arrow_up' }}</v-icon>
                </v-btn>
              </v-card-actions>
              <v-slide-y-transition>
                <v-card-text v-show="showRegistro">
                  <div>
                  <div align="justify">{{ $t('app.paso1') }}</div>
                </div>
                </v-card-text>
              </v-slide-y-transition>
            </v-card>
          </v-flex>
          <v-flex xs4 >
            <v-card>
              <v-card-media :src="afps_src" @click="$router.push('/no_adeudo')" height="300px">
              </v-card-media>
              <v-card-actions>
                <v-btn flat color="orange" href="#/no_adeudo">2. {{ $t('app.bpaso2') }}</v-btn>
                <v-spacer></v-spacer>
                <v-btn icon @click.native="showAfps = !showAfps">
                  <v-icon>{{ showAfps ? 'keyboard_arrow_down' : 'keyboard_arrow_up' }}</v-icon>
                </v-btn>
              </v-card-actions>
              <v-slide-y-transition>
                <v-card-text v-show="showAfps">
                  <div>
                  <div align="justify">{{ $t('app.paso2') }}</div>
                </div>
                </v-card-text>
              </v-slide-y-transition>
            </v-card>
          </v-flex>
          <v-flex xs4 >
            <v-card>
              <v-card-media :src="manual_src" @click="descargar ()" height="300px">
              </v-card-media>
              <v-card-actions>
                <v-btn flat color="orange" @click.native="descargar ()">3. {{ $t('app.bpaso3') }}</v-btn>
                <v-spacer></v-spacer>
                <v-btn icon @click.native="showNots = !showNots">
                  <v-icon>{{ showNots ? 'keyboard_arrow_down' : 'keyboard_arrow_up' }}</v-icon>
                </v-btn>
              </v-card-actions>
              <v-slide-y-transition>
                <v-card-text v-show="showNots">
                  <div>
                  <div align="justify">{{ $t('app.paso3') }}</div>
                </div>
                </v-card-text>
              </v-slide-y-transition>
            </v-card>
          </v-flex>
        </v-layout>
        </v-flex>
        <v-flex xs2>
        </v-flex>
        </v-layout>
      </v-card-text>
    </v-card>
    <!-- <v-dialog v-model="dialogAfp" max-width="700px" persistent scrollable>
      <v-card>
        <v-toolbar card dark color="primary">
          <v-toolbar-title>Manual de usuario</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn color="info" @click.stop="cerrarDialog()"><v-icon>cancel</v-icon>Cerrar</v-btn>
        </v-toolbar>
        <v-card-text>
          <div class="pdf-container">
            <pdf-view :data="pdfAfp" :url="urlPdfAfp"></pdf-view>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog> -->
  </section>
</template>

<script>
  import registro from '@/assets/images/registro.png';
  import afps from '@/assets/images/afps.jpg';
  import notificacion from '@/assets/images/notificacion.png';
  import manual from '@/assets/images/manual.png';
  import PdfView from '@/common/util/pdf/PdfView';
  export default {
    data () {
      return {
        registro_src: registro,
        afps_src: afps,
        notificacion_src: notificacion,
        manual_src: manual,
        showRegistro: false,
        showAfps: false,
        showNots: false,
        dialogAfp: false,
        pdfAfp: null,
        urlPdfAfp: null,
        url: `${process.env.API_URL}system/manuales/1`
      };
    },
    methods: {
      showMessage (type) {
        console.log(type, this.$message);
        this.$message[type](`Mensaje tipo ${type}`);
      },
      showAlert () {
        this.$alert('Mensaje de alerta', function () {
          console.log('callback!!');
        });
      },
      showConfirm () {
        this.$confirm('Mensaje de confirmación', function () {
          console.log('ok!!');
        }, function () {
          console.log('cancel!!');
        });
      },
      consulta () {
        this.$message.success('FUNCIONA!');
      },
      cerrarDialog () {
        this.dialogAfp = false;
        this.pdfAfp = null;
        this.imageAfp = null;
      },
      mostrarAdjuntoAfp (afpId) {
        this.dialogAfp = true;
        this.urlPdfAfp = `${process.env.API_URL}system/manuales/1`;
        this.$service.get(`system/manuales/1`)
        .then((response) => {
          console.log('RESPONSE for', response.formato);
          console.log('RESPONSE for', response.base64);
          if (response) {
            this.pdfAfp = response.base64;
          }
        }).catch(() => {
          this.$message.error('No se pudo mostrar el archivo.');
        });
      },
      descargar () {
        if (this.url) {
          this.$service.get(this.url)
          .then((response) => {
            console.log('*** reporte :\n', JSON.stringify(response, null, 2));
            const url = window.URL.createObjectURL(this.b64toBlob(response.base64, 'application/pdf'));
            const link = document.createElement('a');
            link.href = url;
            const d = new Date();
            link.setAttribute('download', `doc-${d.getTime()}.pdf`);
            document.body.appendChild(link);
            link.click();
          });
        }
      },
      b64toBlob (b64Data, contentType, sliceSize) {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;

        let byteCharacters = atob(b64Data);
        let byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
          let slice = byteCharacters.slice(offset, offset + sliceSize);

          let byteNumbers = new Array(slice.length);
          for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
          }

          let byteArray = new Uint8Array(byteNumbers);

          byteArrays.push(byteArray);
        }

        let blob = new Blob(byteArrays, {type: contentType});
        return blob;
      }
    },
    components: {
      PdfView
    }
  };
</script>

