<template v-if="idMedio">
  <section>
    <v-btn flat round color="primary" @click="retornar()">
      <v-icon>arrow_back</v-icon> Volver
    </v-btn>
    <h3 class="primary--text"><v-icon color="info">business</v-icon> {{ $store.state.user.id_rol !== 2 ? $t('medio.title') : 'Registro' }} </h3>
    <v-card>
      <v-card-text>
        <v-container grid-list-md>
          <v-expansion-panel expand>
            <v-expansion-panel-content class="secondary" name="infoGeneral" value=true>
              <div card color="secondary" slot="header">
                <v-toolbar card color="secondary">
                  <v-toolbar-title>
                    <h3>{{ $t('medio.crud.seccion_general') }}</h3>
                  </v-toolbar-title>
                </v-toolbar>
              </div>
              <v-card>
                <v-card-text class="white">
                  <v-layout wrap>
                    <v-flex xs6>
                      <v-text-field
                        name="NIT"
                        :label="$t('medio.crud.nit')"
                        id="nit"
                        v-model="form.nit"
                        maxlength="150"
                        disabled
                      ></v-text-field>
                    </v-flex>

                    <v-flex xs6>
                      <v-text-field
                        name="matricula"
                        :label="$t('medio.crud.matricula')"
                        id="matricula"
                        v-model="form.matricula"
                        maxlength="20"
                        disabled
                      ></v-text-field>
                    </v-flex>

                    <v-flex xs6>
                      <v-text-field
                        name="razonsocial"
                        :label="$t('medio.crud.razonsocial')"
                        id="razonsocial"
                        v-model="form.razonsocial"
                        maxlength="150"
                        disabled
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs6>
                      <v-text-field
                        name="tiposocietario"
                        :label="$t('medio.crud.tiposocietario')"
                        v-show="form.matricula !== ''"
                        id="tiposocietario"
                        v-model="form.tiposocietario"
                        maxlength="150"
                        disabled
                      ></v-text-field>
                      <v-select
                        :label="$t('medio.crud.tiposocietario')"
                        v-show="form.matricula === ''"
                        :items="tiposSocietarios"
                        v-model="form.tiposocietario"
                        disabled
                      >
                      </v-select>
                    </v-flex>

                    <v-flex xs8>
                        <v-radio-group v-model="form.tipogrupo2" v-on:change="limpiarTipoMedio()" row>
                        <v-radio
                          :label="$t('medio.crud.medioComunicacion')"
                          value="MEDIO"
                          disabled>
                        </v-radio>
                        <v-radio
                          :label="$t('medio.crud.red')"
                          value="RED"
                          disabled>
                        </v-radio>
                        <v-radio
                          :label="$t('medio.crud.productor')"
                          value="PRODUCTOR"
                          disabled>
                        </v-radio>
                      </v-radio-group>
                    </v-flex>

                    <template v-if="form.tipogrupo === 'RED'">
                    <v-flex xs12>
                      <v-select
                        :label="$t('medio.crud.medios')"
                        chips
                        tags
                        prepend-icon="add_to_queue"
                        v-model="form.medios"
                        disabled
                        hint="Presione la tecla ENTER, para adicionar más medios."
                        persistent-hint
                      >
                        <template slot="selection" slot-scope="data">
                          <v-chip
                            close
                            @input="data.parent.selectItem(data.item)"
                            :selected="data.selected"
                            :key="JSON.stringify(data.item)"
                          >
                            {{ data.item }}
                          </v-chip>
                        </template>
                      </v-select>
                    </v-flex>
                    </template>

                    <template v-if="form.tipogrupo === 'MEDIO' || form.tipogrupo === 'RED'">
                    <v-flex xs6>
                      <v-select
                        :label="$t('medio.crud.tipomedio')"
                        :items="listadoMedios"
                        v-model.lazy="listaMedios"
                        item-text="nombre"
                        item-value="id"
                        multiple
                        chips
                        autocomplete
                        disabled
                      >
                        <template slot="selection" slot-scope="data">
                          <v-chip
                            close
                            @input="data.parent.selectItem(data.item)"
                            :selected="data.selected"
                            class="chip--select-multi"
                            :key="JSON.stringify(data.item)"
                          >
                            {{ data.item.nombre}}
                          </v-chip> 
                        </template>
                      </v-select>
                    </v-flex>
                    </template>
                    <template >
                    <v-flex xs6 >
                      <!-- <v-select
                        v-if="form.tipogrupo === 'PRODUCTOR'"
                        :label="$t('medio.crud.tipoproductor')"
                        :items="listadoProductor"
                        v-model.lazy="listaProductor"
                        item-text="nombre"
                        item-value="id"
                        disabled
                      >
                      </v-select> -->
                      <v-select
                        v-if="form.tipogrupo === 'PRODUCTOR'"
                        :label="$t('medio.crud.tipoproductor')"
                        :items="listadoProductor"
                        v-model.lazy="listaProductor"
                        item-text="nombre"
                        item-value="id"
                        multiple
                        chips
                        autocomplete
                        disabled
                      >
                        <template slot="selection" slot-scope="data">
                          <v-chip
                            close
                            @input="data.parent.selectItem(data.item)"
                            :selected="data.selected"
                            class="chip--select-multi"
                            :key="JSON.stringify(data.item)"
                          >
                            {{ data.item.nombre}}
                          </v-chip> 
                        </template>
                      </v-select>
                    </v-flex>
                    </template>
                    <v-flex xs6>
                      <v-select
                        :label="$t('medio.crud.telefonos')"
                        chips
                        tags
                        prepend-icon="phone"
                        v-model="form.telefonos"
                        @keydown.native="$filter.numeric($event)"
                        disabled
                        hint="Presione la tecla ENTER, para adicionar más teléfonos."
                        persistent-hint
                      >
                        <template slot="selection" slot-scope="data">
                          <v-chip
                            close
                            @input="data.parent.selectItem(data.item)"
                            :selected="data.selected"
                            :key="JSON.stringify(data.item)"
                          >
                            {{ data.item }}
                          </v-chip>
                        </template>
                      </v-select>
                    </v-flex>

                    <v-flex xs6>
                      <v-text-field
                        name="email"
                        :label="$t('medio.crud.email')"
                        prepend-icon="email"
                        id="email"
                        v-model.lazy="form.email"
                        maxlength="100"
                        disabled
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs6>
                      <v-text-field
                        name="web"
                        :label="$t('medio.crud.web')"
                        prepend-icon="public"
                        id="web"
                        v-model.lazy="form.web"
                        maxlength="100"
                        disabled
                      ></v-text-field>
                    </v-flex>

                    <v-flex xs12>
                      <v-text-field
                        name="direccion"
                        :label="$t('medio.crud.direccion')"
                        id="direccion"
                        v-model.lazy="form.direccion"
                        maxlength="500"
                        :counter="500"
                        disabled
                      ></v-text-field>
                    </v-flex>
                    
                    <v-flex xs12>
                      <!-- <div v-show="(form.tipogrupo === 'MEDIO') && (this.listaMedios.length > 0 || this.listaProductor !== null)"> -->
                      <div v-show="(form.tipogrupo === 'MEDIO' || form.tipogrupo === 'RED') && ((this.listaMedios.length === 1 && this.listaMedios.indexOf(3) === -1) || (this.listaMedios.length > 1))">
                        <p style="white-space: pre-line;">{{ $t('medio.crud.att') }} </p>
                        <div v-show="rutaAtt !== null">
                          <v-flex xs12>
                            <v-layout wrap>
                              <v-flex xs12>
                                <v-btn color="primary" tab block dark @click.stop="mostrarAdjuntoAtt()"><v-icon>visibility</v-icon>
                                  Ver
                                </v-btn>
                              </v-flex>
                            </v-layout>
                            <v-dialog v-model="dialogAtt" max-width="700px" persistent scrollable>
                              <v-card>
                                <v-toolbar card dark color="primary">
                                  <v-toolbar-title>Autorización de la ATT</v-toolbar-title>
                                  <v-spacer></v-spacer>
                                  <v-btn color="info" @click.stop="dialogAtt=false"><v-icon>cancel</v-icon>Cerrar</v-btn>
                                </v-toolbar>
                                <v-card-text>
                                  <div class="pdf-container" v-if="pdfAtt">
                                    <pdf-view :data="pdfAtt" :url="urlPdfAtt"></pdf-view>
                                  </div>
                                  <div class="image-container" v-if="imageAtt">
                                    <img :src="imageAtt" />
                                  </div>
                                </v-card-text>
                              </v-card>
                            </v-dialog>
                          </v-flex>
                        </div>
                      </div>

                      <div v-show="(form.tipogrupo === 'RED' || form.tipogrupo === 'PRODUCTOR') && (this.listaMedios.length > 0 || this.listaProductor !== null)">
                        <p style="white-space: pre-line;">{{ $t('medio.crud.contrato') }} </p>
                        <div v-show="rutaContrato !== null">
                          <v-flex xs12>
                            <v-layout wrap>
                              <v-flex xs12>
                                <v-btn color="primary" tab block dark @click.stop="mostrarAdjuntoContrato()"><v-icon>visibility</v-icon>
                                  Ver
                                </v-btn>
                              </v-flex>
                            </v-layout>
                            <v-dialog v-model="dialogContrato" max-width="700px" persistent scrollable>
                              <v-card>
                                <v-toolbar card dark color="primary">
                                  <v-toolbar-title>Contrato con el Medio</v-toolbar-title>
                                  <v-spacer></v-spacer>
                                  <v-btn color="info" @click.stop="dialogContrato=false"><v-icon>cancel</v-icon>Cerrar</v-btn>
                                </v-toolbar>
                                <v-card-text>
                                  <div class="pdf-container" v-if="pdfContrato">
                                    <pdf-view :data="pdfContrato" :url="urlPdfContrato"></pdf-view>
                                  </div>
                                  <div class="image-container" v-if="imageContrato">
                                    <img :src="imageContrato" />
                                  </div>
                                </v-card-text>
                              </v-card>
                            </v-dialog>
                          </v-flex>
                        </div>
                      </div>
                    </v-flex>

                    <v-flex v-if="esNoComercial" xs12>
                      <p style="white-space: pre-line;">Respaldo de la institución de tipo no comercial </p>
                      <div v-show="rutaNoComercial !== null">
                        <v-flex xs12>
                          <v-layout wrap>
                            <v-flex xs12>
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
                      </div>
                    </v-flex>
                  </v-layout>
                </v-card-text>
              </v-card>
            </v-expansion-panel-content>
            <v-expansion-panel-content class="secondary" name="representante" value=true>
              <div card color="secondary" slot="header">
                <v-toolbar card color="secondary">
                  <v-toolbar-title>
                    <h3>{{ $t('medio.crud.seccion_representante') }}</h3>
                  </v-toolbar-title>
                </v-toolbar>
              </div>
              <v-card>
                <v-card-text class="white">      
                  <div v-if="form.unipersonal">
                    <v-layout row wrap>
                      <v-flex xs8>
                          <v-radio-group v-model="form.representante.propietario" row>
                          <v-radio
                            :label="$t('medio.crud.representante.representante')"
                            :value="false"
                            disabled>
                          </v-radio>
                          <v-radio
                            :label="$t('medio.crud.representante.propietario')"
                            :value="true"
                            disabled>
                          </v-radio>
                        </v-radio-group>
                      </v-flex>
                    </v-layout>
                  </div>
                  
                  <v-layout wrap>
                    <v-form 
                      ref="form"
                      lazy-validation 
                      @submit.prevent="agregarRepresentante">
                      <v-layout wrap>
                        <v-flex xs6>
                          <v-text-field
                            name="ci"
                            :label="$t('medio.crud.representante.ci')"
                            id="ci"
                            v-model="form.representante.ci"
                            maxlength="15"
                            disabled
                          ></v-text-field>
                        </v-flex>
                        <v-flex xs6>
                          <select-date
                            :required="true"
                            label="Introduzca la fecha de nacimiento"                                      
                            model="fecha_nacimiento"
                            disabled
                            v-show="!tieneRepresentante"
                            v-if="!tieneRepresentante"
                            >
                          </select-date>
                        </v-flex>
                        <v-flex xs12 v-if="tieneRepresentante">
                          <v-text-field
                            name="nombre_representante"
                            :label="$t('medio.crud.representante.nombre')"
                            id="nombre_representante"
                            v-model="form.representante.nombre_completo"
                            maxlength="150"
                            disabled
                          ></v-text-field>
                        </v-flex>
                        <v-flex xs4>
                          <v-select
                            :label="$t('medio.crud.representante.telefonos')"
                            chips
                            tags
                            prepend-icon="phone"
                            v-model="form.representante.telefonos"
                            @keydown.native="$filter.numeric($event)"
                            disabled
                            :rules="[v => !!v || 'Debe ingresar números']"
                            hint="Presione la tecla ENTER, para adicionar más teléfonos."
                            persistent-hint
                          >
                            <template slot="selection" slot-scope="data">
                              <v-chip
                                close
                                @input="data.parent.selectItem(data.item)"
                                :selected="data.selected"
                                :key="JSON.stringify(data.item)"
                              >
                                {{ data.item }}
                              </v-chip>
                            </template>
                          </v-select>
                        </v-flex>
                        <v-flex xs5>
                          <v-text-field
                            name="email"
                            :label="$t('medio.crud.representante.email')"
                            id="email"
                            prepend-icon="email"
                            v-model="form.representante.email"
                            maxlength="50"
                            disabled
                          ></v-text-field>
                        </v-flex>

                        <v-flex xs3>
                          <p style="white-space: pre-line;">&nbsp;</p>
                          <v-btn color="info" block type="submit" v-if="!tieneRepresentante"><v-icon dark>add</v-icon>Registrar representante</v-btn>
                        </v-flex>
                      </v-layout>
                    </v-form>

                    <v-flex xs12 v-if="tieneRepresentante && !form.representante.propietario">
                      <p style="white-space: pre-line;">{{ $t('medio.crud.poder') }}</p>
                      <div v-show="rutaPoderLegal !== null">
                        <v-flex xs12>
                          <v-layout wrap>
                            <v-flex xs12>
                              <v-btn color="primary" tab block dark @click.stop="mostrarAdjuntoPoder()"><v-icon>visibility</v-icon>
                                Ver
                              </v-btn>
                            </v-flex>
                          </v-layout>
                          <v-dialog v-model="dialogPoder" max-width="700px" persistent scrollable>
                            <v-card>
                              <v-toolbar card dark color="primary">
                                <v-toolbar-title>Poder notariado del Representante Legal</v-toolbar-title>
                                <v-spacer></v-spacer>
                                <v-btn color="info" @click.stop="dialogPoder=false"><v-icon>cancel</v-icon>Cerrar</v-btn>
                              </v-toolbar>
                              <v-card-text>
                                <div class="pdf-container" v-if="pdfPoder">
                                  <pdf-view :data="pdfPoder" :url="urlPdfPoder"></pdf-view>
                                </div>
                                <div class="image-container" v-if="imagePoder">
                                  <img :src="imagePoder" />
                                </div>
                              </v-card-text>
                            </v-card>
                          </v-dialog>
                        </v-flex>
                      </div>
                    </v-flex>
                  </v-layout>
                </v-card-text>
              </v-card>
            </v-expansion-panel-content>
            <v-expansion-panel-content class="secondary" name="referencia" value=true>
              <div card color="secondary" slot="header">
                <v-toolbar card color="secondary">
                  <v-toolbar-title>
                    <h3>{{ $t('medio.crud.seccion_referencia') }}</h3>
                  </v-toolbar-title>
                </v-toolbar>
              </div>
              <v-card>
                <v-card-text class="white"> 
                  <div><br></div>
                  <v-layout wrap>
                    <v-flex xs12>
                      <v-data-table
                      v-bind:headers="headersReferencia"
                      :items="referenciaArray"
                      class="elevation-1"
                      no-results-text="Sin resultados"
                      no-data-text="Sin personas de referencia registradas"
                      :rows-per-page-items="filtros"
                      rows-per-page-text="Items por página"
                      >
                        <template slot="headerCell" slot-scope="props">
                          <span>
                            {{ props.header.text }}
                          </span>
                        </template>
                        <template slot="items" slot-scope="props">
                          <td class="text-xs-center">{{ props.item['persona.nombres'] }}</td>
                          <td class="text-xs-center">{{ props.item['persona.primer_apellido']}}</td>
                          <td class="text-xs-center">{{ props.item['persona.segundo_apellido']}}</td>
                          <td class="text-xs-center">{{ props.item['persona.nro_documento']}}</td>
                          <td class="text-xs-right">{{ props.item.telefonos }}</td>
                          <td class="text-xs-right">{{ props.item.email }}</td>
                          <td class="text-xs-center"></td>
                        </template>
                      </v-data-table>
                    </v-flex>
                  </v-layout> 
                </v-card-text>
              </v-card>
            </v-expansion-panel-content>
            <v-expansion-panel-content class="secondary" name="cobertura" value=true>
              <div card color="secondary" slot="header">
                <v-toolbar card color="secondary">
                  <v-toolbar-title>
                    <h3>{{ $t('medio.crud.cobertura') }}</h3>
                  </v-toolbar-title>
                </v-toolbar>
              </div>
              <v-card>
                <v-card-text class="white">
                  <div v-for="tipo in listaMedios" :key="tipo">
                    <v-flex xs12 class="primary">
                    <h5 class="white--text"> {{ tipo === 1 ? 'TELEVISIÓN' : (tipo === 3 ? 'PRENSA ESCRITA' : (tipo === 4 ? 'RADIO FM' : (tipo === 5 ? 'RADIO AM' : '')) ) }} </h5>
                    </v-flex>
                    <v-flex xs12>
                      <cobertura :tipoMedio="tipo" ></cobertura>
                    </v-flex>
                  </div>
                  <!-- <div v-if="listaProductor"> -->
                  <div v-for="tipo in listaProductor" :key="tipo">
                    <v-flex xs12 class="primary">
                    <!-- <h5 class="white--text"> {{ listadoProductor[listaProductor-6] ? listadoProductor[listaProductor-6].nombre : '' }} </h5> -->
                    <h5 class="white--text"> {{ tipo === 6 ? 'Productor Independiente TV' : (tipo === 7 ? 'Productor Independiente Radio FM' : (tipo === 8 ? 'Productor Independiente Radio AM' : '') ) }} <b class="error--text">*</b></h5>
                    </v-flex>
                    <v-flex xs12>
                      <!-- <cobertura :tipoMedio="listaProductor" ></cobertura> -->
                      <cobertura :tipoMedio="tipo" ></cobertura>
                    </v-flex>
                  </div>
                </v-card-text>
              </v-card>
            </v-expansion-panel-content>
            <v-expansion-panel-content class="secondary" name="tarifario" value=true>
              <div card color="secondary" slot="header">
                <v-toolbar card color="secondary">
                  <v-toolbar-title>
                    <h3>{{ $t('medio.tarifario.title') }}</h3>
                  </v-toolbar-title>
                </v-toolbar>
              </div>
              <v-card>
                <v-card-text class="white">
                  <div v-for="tipo in listaMedios" :key="tipo">
                    <v-flex xs12 class="primary">
                      <h5 class="white--text"> {{ tipo === 1 ? 'TELEVISIÓN' : (tipo === 3 ? 'PRENSA ESCRITA' : (tipo === 4 ? 'RADIO FM' : (tipo === 5 ? 'RADIO AM' : '')) ) }} </h5>
                    </v-flex>
                    <v-flex xs12>
                      <v-layout wrap>
                        <v-flex xs4>
                        </v-flex>
                        <v-flex xs4>
                          <v-btn color="info" round block v-on:click="abreTarifario(tipo)"><v-icon dark>aspect_ratio</v-icon>&nbsp;&nbsp;Ver Tarifario</v-btn>
                        </v-flex>
                        <v-flex xs4>
                        </v-flex>
                      </v-layout>
                    </v-flex>
                    <div>
                      <br><br>
                    </div>
                  </div>
                  <!-- <div v-if="listaProductor"> -->
                  <div v-for="tipo in listaProductor" :key="tipo">
                    <v-flex xs12 class="primary">
                      <!-- <h5 class="white--text"> {{ listadoProductor[listaProductor-6] ? listadoProductor[listaProductor-6].nombre : '' }} </h5> -->
                      <h5 class="white--text"> {{ tipo === 6 ? 'Productor Independiente TV' : (tipo === 7 ? 'Productor Independiente Radio FM' : (tipo === 8 ? 'Productor Independiente Radio AM' : '') ) }} <b class="error--text">*</b></h5>
                    </v-flex>
                    <v-flex xs12>
                      <v-layout wrap>
                        <v-flex xs4>
                        </v-flex>
                        <v-flex xs4>
                          <!-- <v-btn color="info" block v-on:click="abreTarifario(listaProductor)"><v-icon dark>aspect_ratio</v-icon>&nbsp;&nbsp;Ver detalles al tarifario</v-btn> -->
                          <v-btn color="info" block v-on:click="abreTarifario(tipo)"><v-icon dark>add</v-icon>&nbsp;&nbsp;Ver detalles al tarifario</v-btn>
                        </v-flex>
                        <v-flex xs4>
                        </v-flex>
                      </v-layout>
                    </v-flex>
                    <div>
                      <br><br>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-container>
      </v-card-text>
    </v-card>

    <v-dialog v-model="modalTarifarioTvRadio" max-width="1200px" persistent>
      <v-card>
        <v-card-title>
          <b>Tarifario de Medio de TV/Radio</b>
        </v-card-title>
          <v-card-text>
            <ViewTarifarioTvRadio v-if="modalTarifarioTvRadio" :idMedio="idMedio" :idMedioTipoMedio="idMedioTipoMedio" :idTarifario="idTarifario" ></ViewTarifarioTvRadio>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click.stop="modalTarifarioTvRadio=false">Cerrar</v-btn>
          </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="modalTarifarioPrensa" max-width="1200px" persistent>
      <v-card>
        <v-card-title>
          <b>Tarifario de Medio de Prensa</b>
        </v-card-title>
          <v-card-text>
            <ViewTarifarioPrensa v-if="modalTarifarioPrensa" :idMedio="idMedio" :idMedioTipoMedio="idMedioTipoMedio" :idTarifario="idTarifario" ></ViewTarifarioPrensa>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click.stop="modalTarifarioPrensa=false">Cerrar</v-btn>
          </v-card-actions>
      </v-card>
    </v-dialog>
  </section>
</template>
<script>
import FileUpload from '@/common/util/FileUpload.vue';
import SelectDate from '@/common/util/SelectDate';
import PdfView from '@/common/util/pdf/PdfView';
import Cobertura from './VerCobertura.vue';
import ViewTarifarioTvRadio from './ViewTarifarioTvRadio.vue';
import ViewTarifarioPrensa from './ViewTarifarioPrensa.vue';

export default {
  created () {
    // Cuando esta registrando por primera vez

    if (this.$route.params.idMedio) {
      this.idMedio = parseInt(this.$route.params.idMedio);
      // Obtenemos datos del medio
      if (this.idMedio) {
        // TODO: Revisar por que no funciona y recupera cuando se trata de productor independiente
        this.$service.get('medios/' + this.idMedio)
        .then(response => {
          if (response.medio && response.medio.data) {
            this.$storage.set('medio', response.medio.data);

            this.$service.get('parametros?grupo=TIPO_MEDIO')
            .then(response2 => {
              if (response2 && response2.rows.length > 0) {
                this.listadoMedios = response2.rows.map((elemento) => {
                  return ({'id': elemento.id, 'nombre': elemento.nombre, 'estado': elemento.estado});
                }).filter((elemento) => (elemento.estado === 'ACTIVO' && !elemento.nombre.includes('Productor') && elemento.id !== 2));

                this.listadoProductor = response2.rows.map((elemento) => {
                  return ({'id': elemento.id, 'nombre': elemento.nombre, 'estado': elemento.estado});
                }).filter((elemento) => elemento.estado === 'ACTIVO' && elemento.nombre.includes('Productor'));
              }
              if (this.$storage.get('medio')) {
                this.form.nit = this.$storage.get('medio').nit ? this.$storage.get('medio').nit : '';
                this.form.matricula = this.$storage.get('medio').matricula ? this.$storage.get('medio').matricula : '';
                this.form.razonsocial = this.$storage.get('medio').razon_social ? this.$storage.get('medio').razon_social : '';
                this.form.tiposocietario = this.$storage.get('medio').tipo_societario ? this.$storage.get('medio').tipo_societario : '';
                this.form.unipersonal = this.$storage.get('medio').tipo_societario === 'EMPRESA UNIPERSONAL';
                if (this.$storage.get('medio').telefonos) {
                  this.form.telefonos = this.$storage.get('medio').telefonos.split(',');
                } else {
                  this.form.telefonos = [];
                }
                this.form.email = this.$storage.get('medio').email ? this.$storage.get('medio').email : '';
                this.form.web = this.$storage.get('medio').web ? this.$storage.get('medio').web : '';
                this.form.direccion = this.$storage.get('medio').direccion ? this.$storage.get('medio').direccion : '';

                if (this.$storage.get('medio').representante_legal) {
                  this.rutaPoderLegal = this.$storage.get('medio').representante_legal.ruta_poder_representante ? this.$storage.get('medio').representante_legal.ruta_poder_representante : null;
                  this.representante_id = this.$storage.get('medio').representante_legal.id ? this.$storage.get('medio').representante_legal.id : 0;
                  this.urlPoderLegal = `${process.env.API_URL}medios/${this.$storage.get('medio').id}/referencias/${this.representante_id}/poder_representante`;

                  if (this.$storage.get('medio').representante_legal.telefonos) {
                    this.form.representante.telefonos = this.$storage.get('medio').representante_legal.telefonos.split(',');
                  } else {
                    this.form.representante.telefonos = [];
                  }

                  this.form.representante.email = this.$storage.get('medio').representante_legal.email;
                  if (this.$storage.get('medio').representante_legal.persona) {
                    this.form.representante.nombre_completo = `${this.$storage.get('medio').representante_legal.persona.nombres} ${this.$storage.get('medio').representante_legal.persona.primer_apellido || ''} ${this.$storage.get('medio').representante_legal.persona.segundo_apellido || ''}`;
                    this.form.representante.ci = this.$storage.get('medio').representante_legal.persona.nro_documento;
                    this.form.representante.id = this.$storage.get('medio').representante_legal.id;
                    this.tieneRepresentante = true;
                  }

                  this.form.representante.propietario = this.$storage.get('medio').representante_legal.propietario;
                }
                if (this.$storage.get('medio').tipos_medio.length > 0) {
                  const tiposMedioToArray = this.$storage.get('medio').tipos_medio.map((elemento) => {
                    return elemento.id_tipo_medio;
                  });
                  // En caso de que sea una seleccion simple como Productor independiente
                  this.form.tipogrupo = this.$storage.get('medio').tipo_grupo;
                  this.form.tipogrupo2 = this.form.tipogrupo;
                  if (this.$storage.get('medio').medios) {
                    this.form.medios = this.$storage.get('medio').medios.split(',');
                  } else {
                    this.form.medios = [];
                  }
                  if (this.$storage.get('medio').tipo_grupo === 'MEDIO' || this.$storage.get('medio').tipo_grupo === 'RED') {
                    this.listaMedios = tiposMedioToArray;
                  } else {
                    // this.listaProductor = this.$storage.get('medio').tipos_medio[0].id_tipo_medio;
                    this.listaProductor = tiposMedioToArray;
                  }
                  // if (this.$storage.get('medio').tipos_medio[0].nombre.includes('Productor')) {
                  //   this.form.tipogrupo = 'PRODUCTOR';
                  //   this.form.tipogrupo2 = 'PRODUCTOR';
                  //   this.listaProductor = this.$storage.get('medio').tipos_medio[0].id_tipo_medio;
                  // } else {
                  //   // Diferenciar de Red
                  //   this.form.tipogrupo = 'MEDIO';
                  //   this.form.tipogrupo2 = 'MEDIO';
                  //   this.listaMedios = tiposMedioToArray;
                  //   this.tiposMedio = this.$storage.get('medio').tipos_medio;
                  // }
                };
                if (this.form.matricula === '') {
                  this.esNoComercial = true;
                }
                this.cargarReferencias();
              }
            });
          }
        });
      }
    }
  },
  data () {
    return {
      filtros: [10, 15, 25, {text: 'Todos', value: -1}],
      referenciaArray: [],
      listaMedios: [],
      listaProductor: [],
      listadoMedios: [],
      listadoProductor: [],
      successAlert: false,
      representante_id: 0,
      mostrarCobertura: true,
      mostrarReferencia: true,
      modalEditar: false,
      esNoComercial: false,
      url: 'registro',
      headersReferencia: [
        { text: this.$t('referencia.crud.nombre'), sortable: false, align: 'center' },
        { text: this.$t('referencia.crud.apellidoPaterno'), sortable: false, align: 'center' },
        { text: this.$t('referencia.crud.apellidoMaterno'), sortable: false, align: 'center' },
        { text: this.$t('referencia.crud.cedulaIdentidad'), sortable: false, align: 'center' },
        { text: this.$t('referencia.crud.telefonos'), sortable: false, align: 'center' },
        { text: this.$t('referencia.crud.email'), sortable: false, align: 'center' },
        { text: 'Acciones', sortable: false, value: 'estado', align: 'center' }
      ],
      form: {
        nit: '',
        matricula: '',
        razonsocial: '',
        tiposocietario: '',
        medios: [],
        unipersonal: false,
        telefonos: [],
        email: '',
        web: '',
        direccion: '',
        tipogrupo: 'MEDIO',
        tipogrupo2: 'MEDIO',
        representante: {
          id: '',
          id_medio: '',
          propietario: false,
          ci: '',
          fecha_nacimiento: '',
          nombre_completo: '',
          nombres: '',
          apPaterno: '',
          apMaterno: '',
          celular: '',
          telefonos: [],
          email: ''
        }
      },
      formRef: {
        referencia: {
          id_medio: '',
          ci: '',
          fecha_nacimiento: '',
          nombre_completo: '',
          nombres: '',
          apPaterno: '',
          apMaterno: '',
          celular: '',
          telefonos: [],
          email: '',
          direccion: ''
        }
      },
      formEditRef: {
        referencia: {
          id: '',
          id_medio: '',
          ci: '123',
          fecha_nacimiento: '',
          nombres: '',
          apPaterno: '',
          apMaterno: '',
          celular: '',
          telefonos: [],
          email: '',
          direccion: ''
        }
      },
      tiposSocietarios: [
        { value: 'Asociación', text: 'Asociación' },
        { value: 'Fundación', text: 'Fundación' },
        { value: 'Estatal', text: 'Estatal' }
      ],
      valid: true,
      urlAtt: `${process.env.API_URL}medios/${this.$storage.get('medio') ? this.$storage.get('medio').id : 0}/autorizacion_att`,
      urlContrato: `${process.env.API_URL}medios/${this.$storage.get('medio') ? this.$storage.get('medio').id : 0}/contrato`,
      urlPoderLegal: `${process.env.API_URL}medios/${this.$storage.get('medio') ? this.$storage.get('medio').id : 0}/referencias/0/poder_representante`,
      rutaRupe: this.$storage.get('medio') ? this.$storage.get('medio').ruta_rupe : null,
      rutaAtt: this.$storage.get('medio') ? this.$storage.get('medio').ruta_att : null,
      rutaContrato: this.$storage.get('medio') ? this.$storage.get('medio').ruta_contrato_medio : null,
      rutaPoderLegal: null,
      pdfAtt: null,
      urlPdfAtt: null,
      imageAtt: null,
      pdfContrato: null,
      urlPdfContrato: null,
      imageContrato: null,
      pdfRupe: null,
      urlPdfRupe: null,
      imageRupe: null,
      pdfPoder: null,
      urlPdfPoder: null,
      imagePoder: null,
      urlNoComercial: `${process.env.API_URL}medios/${this.$storage.get('medio') ? this.$storage.get('medio').id : 0}/no_comercial`,
      rutaNoComercial: this.$storage.get('medio') ? this.$storage.get('medio').ruta_no_comercial : null,
      pdfNoComercial: null,
      imageNoComercial: null,
      dialogNoComercial: false,
      delay: 3000,
      tieneRepresentante: false,
      dialogAtt: false,
      dialogRupe: false,
      dialogContrato: false,
      dialogPoder: false,
      tiposMedio: null,
      modalTarifarioTvRadio: false,
      modalTarifarioPrensa: false
    };
  },
  methods: {
    openModal (data = {}, form = true) {
      this.valid = true;
      this.$refs.form.reset();
      if (data.id) {
        if (data.telefonos) {
          data.telefonos = data.telefonos.split(',');
        } else {
          data.telefonos = [];
        }
        this.form = data;
      } else {
        this.form = {
          nit: '',
          matricula: '',
          estado: ''
        };
      }
      if (form) {
        this.$store.commit('openModal');
      }
    },
    guardarRegistro () {
      this.$service.get(`medios/${this.$storage.get('medio').id}/validaciones`)
      .then(response => {
        this.$message.success('Se ha GUARDADO el formulario correctamente.');
      });
    },
    guardarFinalizarRegistro () {
      this.$service.get(`medios/${this.$storage.get('medio').id}/validaciones`)
      .then(response => {
        if (response) {
          this.$confirm('<div style="text-align: justify;">En cumplimiento del Artículo 1322° del Código Civil y Art. 157° Parágrafo IV del Código Procesal Civil, sujeto en caso de inexactitud o falsedad a la cancelación del trámite de constitución y, a las penalidades establecidas en el Art. 169° del Código Penal como falso testimonio, DECLARO que la información presentada es veraz y fidedigna. <br><br> Por tanto, de forma libre, voluntaria y para cumplir con los requisitos establecidos por el Ministerio de Comunicación, formulo y presento la presente Declaración Jurada.</div>', () => {
            // Llamar al servicio actualiza el estado del formulario
            this.$service.post(`medios/${this.$storage.get('medio').id}/enviar`)
            .then(response2 => {
              if (response2) {
                if (response2.medio.message === 'OK') {
                  this.actualizaMedio();
                  this.$message.success('Se ha guardado y finalizado con el registro del formulario.');
                  this.redireccion = '/';
                  this.$router.push(this.redireccion);
                } else {
                  this.$message.warning('Ha ocurrido un problema, vuelva a intentar.');
                }
              }
            });
          });
        }
      });
    },
    limpiarTipoMedio () {
      if (this.$storage.get('medio').tipos_medio.length > 0) {
        if (this.form.tipogrupo === 'PRODUCTOR' || this.form.tipogrupo2 === 'PRODUCTOR') {
          this.$confirm('¿Está seguro de cambiar los tipos de medios? Considere que los registros realizados en cobertura y tarifarios se eliminarán.', () => {
            this.form.tipogrupo = this.form.tipogrupo2;
            this.listaMedios = [];
            this.form.medios = [];
            this.listaProductor = [];
            this.guardaTiposMedio(this.listaMedios);
            this.guardaTipoProductor(this.listaProductor);
          }, () => (this.form.tipogrupo2 = this.form.tipogrupo));
        } else {
          this.form.medios = [];
          this.form.tipogrupo = this.form.tipogrupo2;
        }
      } else {
        this.form.medios = [];
        this.form.tipogrupo = this.form.tipogrupo2;
        this.listaMedios = [];
        this.listaProductor = [];
        this.guardaTiposMedio(this.listaMedios);
        this.guardaTipoProductor(this.listaProductor);
      }
    },
     /* Representante Legal */
    agregarRepresentante () {
      if (this.$refs.form.validate()) {
        if (this.form.representante.telefonos.length <= 0) {
          this.$message.warning('Debe ingresar al menos un teléfono del representante.');
          return;
        }
        this.$service.get('../system/persona-segip/' + this.form.representante.ci + '?fechaNacimiento=' + this.$datetime.format(this.$store.state.date.fecha_nacimiento, 'dd/MM/YYYY'))
        .then(response => {
          if (response) {
            if (typeof response === 'object') {
              let personaId = response.id;
              this.form.representante.id_medio = this.$storage.get('medio').id;
              this.form.representante.nombre_completo = `${response.nombres} ${response.primer_apellido || ''} ${response.segundo_apellido || ''}`;
              this.$service.post('medios/' + this.form.representante.id_medio + '/referencias', {
                id_persona: personaId,
                email: this.form.representante.email,
                telefonos: this.form.representante.telefonos.join(','),
                propietario: this.form.representante.propietario
              }).then(response => {
                if (response) {
                  this.$message.success('Se agregó correctamente a la persona: ' + this.form.representante.nombre_completo + ' como representante legal.');
                  this.actualizaMedio();
                  this.representante_id = response.referencia.data.id;
                  this.urlPoderLegal = `${process.env.API_URL}medios/${this.$storage.get('medio').id}/referencias/${this.representante_id}/poder_representante`;
                  this.actualizaMedio();
                  this.tieneRepresentante = true;
                } else {
                  this.$message.error('Verifique los datos ingresados');
                }
              }).catch(() => {
                this.$message.error('No se pudo guardar el representante');
              });
            } else {
              this.$message.error(response);
            }
          } else {
            this.$message.error('Revise los datos e intente nuevamente');
          }
        }).catch(() => {
          this.$message.error('Los valores no son correctos');
        });
      }
    },
    agregarReferencia () {
      if (this.$refs.formRef.validate()) {
        if (this.formRef.referencia.telefonos.length <= 0) {
          this.$message.warning('Debe ingresar al menos un teléfono del contacto.');
          return;
        }
        this.$service.get('../system/persona-segip/' + this.formRef.referencia.ci + '?fechaNacimiento=' + this.$datetime.format(this.$store.state.date.fecha_nacimiento, 'dd/MM/YYYY'))
        .then(response => {
          if (response) {
            if (typeof response === 'object') {
              let personaId = response.id;
              this.formRef.referencia.id_medio = this.$storage.get('medio').id;
              this.formRef.referencia.nombre_completo = `${response.nombres} ${response.primer_apellido || ''} ${response.segundo_apellido || ''}`;
              this.$service.post('medios/' + this.formRef.referencia.id_medio + '/referencias', {
                id_persona: personaId,
                email: this.formRef.referencia.email,
                telefonos: this.formRef.referencia.telefonos.join(','),
                tipo: 'CONTACTO'
              }).then(response => {
                if (response) {
                  this.$message.success('Se agregó correctamente a la persona: ' + this.formRef.referencia.nombre_completo + ' como representante legal.');
                  this.formRef.referencia.ci = null;
                  this.formRef.referencia.telefonos = [];
                  this.formRef.fecha_nacimiento = null;
                  this.formRef.referencia.email = null;
                  // Cargando referencias
                  this.cargarReferencias();
                } else {
                  this.$message.error('Verifique los datos ingresados');
                }
              }).catch(() => {
                this.$message.error('No se pudo guardar el representante');
              });
            } else {
              this.$message.error(response);
            }
          } else {
            this.$message.error('Revise los datos e intente nuevamente');
          }
        }).catch(() => {
          this.$message.error('Los valores no son correctos');
        });
      }
    },
    modificarReferencia () {
      if (this.$refs.formEditRef.validate()) {
        if (this.formEditRef.referencia.telefonos.length <= 0) {
          this.$message.warning('Debe ingresar al menos un teléfono del contacto.');
          return;
        }
        let personaId = this.formEditRef.referencia.id;
        this.$service.put('medios/' + this.$storage.get('medio').id + '/referencias/' + personaId, {
          id_persona: personaId,
          email: this.formEditRef.referencia.email,
          telefonos: this.formEditRef.referencia.telefonos.join(','),
          tipo: 'CONTACTO'
        }).then(response => {
          if (response) {
            this.$message.success('Se modifico correctamente a la persona: ' + this.formEditRef.referencia.nombre_completo + ' como contacto.');
            this.formEditRef.referencia.id = null;
            this.formEditRef.referencia.ci = null;
            this.formEditRef.referencia.telefonos = [];
            this.formEditRef.fecha_nacimiento = null;
            this.formEditRef.referencia.email = null;
            // Cargando Referencia
            this.cargarReferencias();
            this.modalEditar = false;
          } else {
            this.$message.error('Verifique los datos ingresados');
          }
        }).catch(() => {
          this.$message.error('No se pudo guardar el representante');
        });
      }
    },
    cargarReferencias () {
      this.$service.get(`medios/${this.$storage.get('medio').id}/referencias`)
      .then(response => {
        this.referenciaArray = response.referencias.data.rows.map((elemento) => {
          return ({'id': elemento.id, 'email': elemento.email, 'telefonos': elemento.telefonos, 'tipo': elemento.tipo, 'persona.nombres': elemento['persona.nombres'], 'persona.primer_apellido': elemento['persona.primer_apellido'], 'persona.segundo_apellido': elemento['persona.segundo_apellido'], 'persona.nro_documento': elemento['persona.nro_documento'], 'persona.fecha_nacimiento': this.$datetime.format(elemento['persona.fecha_nacimiento'], 'dd/MM/YYYY')});
        }).filter((elemento) => elemento.tipo === 'CONTACTO');
        this.mostrarReferencia = false;
        this.$nextTick(() => {
          this.mostrarReferencia = true;
        });
      });
    },
    editarReferencia (objeto) {
      // carga valores al formulario de referencia
      this.formEditRef.referencia.id = objeto.id;
      this.formEditRef.referencia.ci = objeto['persona.nro_documento'];
      this.formEditRef.referencia.nombre_completo = objeto['persona.nombres'] + ' ' + (objeto['persona.primer_apellido'] ? objeto['persona.primer_apellido'] : '') + ' ' + (objeto['persona.segundo_apellido'] ? objeto['persona.segundo_apellido'] : '');
      this.formEditRef.referencia.fecha_nacimiento = objeto['persona.fecha_nacimiento'];
      this.formEditRef.referencia.telefonos = objeto.telefonos.split(',');
      this.formEditRef.referencia.email = objeto.email;
      this.modalEditar = true;
    },
    eliminarReferencia (objeto) {
      this.$confirm('¿Quiere eliminar el registro?', () => {
        this.$service.delete(`medios/${this.$storage.get('medio').id}/referencias/${objeto.id}`)
        .then(response => {
          this.$message.success('Persona de referencia eliminada correctamente!');
          this.cargarReferencias();
        });
      });
    },
    save () {
      if (this.$refs.form.validate()) {
        let data = Object.assign({}, this.form);
        data.telefonos = data.telefonos.join(',');
        if (data.id) {
          delete data.id;
          this.$service.graphql({
            query: `
              mutation edit($id: Int!, $entidad: EditEntidad!) {
                entidadEdit(id: $id, entidad: $entidad) {
                  id
                }
              }
            `,
            variables: {
              id: this.form.id,
              entidad: data
            }
          }).then(response => {
            if (response) {
              this.$store.commit('closeModal');
              this.updateList();
              this.$message.success('Se actualizó el registro correctamente');
            }
          });
        } else {
          data.estado = 'ACTIVO';
          this.$service.graphql({
            query: `
              mutation add($entidad: NewEntidad!) {
                entidadAdd(entidad: $entidad) {
                  id
                }
              }
            `,
            variables: {
              entidad: data
            }
          }).then(response => {
            if (response) {
              this.$store.commit('closeModal');
              this.updateList();
              this.$message.success();
            }
          });
        }
      }
    },
    remove (item) {
      this.form.telefonos.splice(this.form.telefonos.indexOf(item), 1);
      this.form.telefonos = [...this.form.telefonos];
    },
    mostrarAdjuntoAtt () {
      this.dialogAtt = true;
      this.urlPdfAtt = `${process.env.API_URL}medios/${this.$storage.get('medio').id}/adjuntos?tipo=att`;
      this.$service.get(`medios/${this.$storage.get('medio').id}/adjuntos?tipo=att`)
      .then((response) => {
        if (response.adjunto.data) {
          if (response.adjunto.data.formato === 'pdf') {
            this.pdfAtt = response.adjunto.data.base64;
            this.imageAtt = null;
          } else {
            this.pdfAtt = null;
            this.imageAtt = `data:image/${response.adjunto.data.formato};base64, ${response.adjunto.data.base64}`;
          }
        }
      }).catch(() => {
        this.$message.error('No se pudo mostrar el archivo.');
      });
    },
    mostrarAdjuntoRupe () {
      this.dialogRupe = true;
      this.urlPdfRupe = `${process.env.API_URL}medios/${this.$storage.get('medio').id}/adjuntos?tipo=rupe`;
      this.$service.get(`medios/${this.$storage.get('medio').id}/adjuntos?tipo=rupe`)
      .then((response) => {
        if (response.adjunto.data) {
          if (response.adjunto.data.formato === 'pdf') {
            this.pdfRupe = response.adjunto.data.base64;
            this.imageRupe = null;
          } else {
            this.pdfRupe = null;
            this.imageRupe = `data:image/${response.adjunto.data.formato};base64, ${response.adjunto.data.base64}`;
          }
        }
      }).catch(() => {
        this.$message.error('No se pudo mostrar el archivo.');
      });
    },
    mostrarAdjuntoContrato () {
      this.dialogContrato = true;
      this.urlPdfContrato = `${process.env.API_URL}medios/${this.$storage.get('medio').id}/adjuntos?tipo=contrato`;
      this.$service.get(`medios/${this.$storage.get('medio').id}/adjuntos?tipo=contrato`)
      .then((response) => {
        if (response.adjunto.data) {
          if (response.adjunto.data.formato === 'pdf') {
            this.pdfContrato = response.adjunto.data.base64;
            this.imageContrato = null;
          } else {
            this.pdfContrato = null;
            this.imageContrato = `data:image/${response.adjunto.data.formato};base64, ${response.adjunto.data.base64}`;
          }
        }
      }).catch(() => {
        this.$message.error('No se pudo mostrar el archivo.');
      });
    },
    mostrarAdjuntoPoder () {
      this.dialogPoder = true;
      this.urlPdfPoder = `${process.env.API_URL}medios/${this.$storage.get('medio').id}/adjuntos?tipo=poder`;
      this.$service.get(`medios/${this.$storage.get('medio').id}/adjuntos?tipo=poder`)
      .then((response) => {
        if (response.adjunto.data) {
          if (response.adjunto.data.formato === 'pdf') {
            this.pdfPoder = response.adjunto.data.base64;
            this.imagePoder = null;
          } else {
            this.pdfPoder = null;
            this.imagePoder = `data:image/${response.adjunto.data.formato};base64, ${response.adjunto.data.base64}`;
          }
        }
      }).catch(() => {
        this.$message.error('No se pudo mostrar el archivo.');
      });
    },
    habilitaCargaAtt () {
      this.rutaAtt = null;
    },
    habilitaCargaContrato () {
      this.rutaContrato = null;
    },
    habilitaCargaRupe () {
      this.rutaRupe = null;
    },
    habilitaCargaPoder () {
      this.rutaPoderLegal = null;
    },
    onSuccessAtt (file, response) {
      // Método que se ejecuta después de subir archivo att
      if (response.error) {
        this.rutaAtt = null;
        this.$message.error('El archivo no pudo ser adjuntado, por favor inténtelo más tarde');
      } else {
        if (response.medio) {
          this.$message.success('¡La operación se realizó correctamente!');
          this.rutaAtt = response.medio.ruta_att;
          this.actualizaMedio();
        }
      }
    },
    onSuccessContrato (file, response) {
      // Método que se ejecuta después de subir archivo del contrato de medio
      if (response.error) {
        this.rutaContrato = null;
        this.$message.error('El archivo no pudo ser adjuntado, por favor inténtelo más tarde');
      } else {
        if (response.medio) {
          this.$message.success('¡La operación se realizó correctamente!');
          this.rutaContrato = response.medio.ruta_contrato_medio;
          this.actualizaMedio();
        }
      }
    },
    onSuccessRupe (file, response) {
      // Método que se ejecuta después de subir archivo rupe
      if (response.errors) {
        this.rutaRupe = null;
        this.$message.error('El archivo no pudo ser adjuntado, por favor inténtelo más tarde');
      } else {
        if (response.medio) {
          this.$message.success('¡La operación se realizó correctamente!');
          this.rutaRupe = response.medio.ruta_rupe;
          this.actualizaMedio();
        }
      }
    },
    onSuccessPoder (file, response) {
      // Método que se ejecuta después de subir archivo Poder legal
      if (response.errors) {
        this.rutaPoderLegal = null;
        this.$message.error('El archivo no pudo ser adjuntado, por favor inténtelo más tarde');
      } else {
        if (response.representante.data) {
          this.$message.success('¡La operación se realizó correctamente!');
          this.rutaPoderLegal = response.representante.data.ruta_poder_representante;
          this.actualizaMedio();
        }
      }
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
    cambiarRepresentante () {
      this.$confirm('¿Está seguro de reemplazar al representante legal?', () => {
        this.tieneRepresentante = false;
        this.$store.commit('setDate', { 'fecha_nacimiento': null });
        this.form.representante.id = '';
        this.form.representante.ci = '';
        this.form.representante.telefonos = [];
        this.form.representante.email = '';
        this.rutaPoderLegal = null;
      }, () => {
        this.tieneRepresentante = true;
      });
    },
    abreFormTarifario (idMedio) {
      this.$router.push(`/tarifarios/${idMedio}`);
    },
    abreTarifario (tipoMedio) {
      this.idTarifario = null;
      this.idMedioTipoMedio = null;
      let tiposMediosGenerados = this.$storage.get('medio').tipos_medio;
      if (this.$storage.get('medio').tipos_medio.length > 0) {
        this.tipoMedioRegistrado = tiposMediosGenerados.find((elemento) => {
          return elemento.id_tipo_medio === tipoMedio;
        });
        if (this.tipoMedioRegistrado) {
          if (this.tipoMedioRegistrado.tarifario) {
            this.idTarifario = this.tipoMedioRegistrado.tarifario.id;
          };
          this.idMedioTipoMedio = this.tipoMedioRegistrado.id;
        };
      }
      if (tipoMedio === 3) {
        // Cuando se trata de medio de Prensa
        this.$nextTick(() => {
          this.modalTarifarioPrensa = true;
        });
      } else {
        // Cuando se trata de medio de TV o Radio
        this.$nextTick(() => {
          this.modalTarifarioTvRadio = true;
        });
      }
    },
    retornar () {
      if (this.$store.state.user.id_rol === 5) {
        this.$router.push('/');
      } else {
        this.$router.push('/medios');
      }
    }
  },
  components: {
    FileUpload,
    SelectDate,
    PdfView,
    Cobertura,
    ViewTarifarioTvRadio,
    ViewTarifarioPrensa
  }
};
</script>