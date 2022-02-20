<template>
  <div>
    <v-card-text>
      <v-container grid-list-md>
        <div class="calendar-view">
            <div style="max-height: 500px;" class="scroll-y horario">
            <div class="dayList">
              <template v-for="day in weekdayNamesColumn">
                <slot :index="day.index" :label="day.label" name="dayHeader">
                  <div class="hour" v-if="day.label === '' ">Hrs.</div>
                  <div class="day" v-if="day.label !== '' ">{{ day.label }}</div>
                </slot>
              </template>
            </div>
            <div v-for="fiveMinutes in 264" class="groupMinutes">
              <div class="daysContent">
                <template v-for="day in weekdayNamesColumn">
                  <slot :day="day" name="dayContent">
                    <div class="hour" v-if="day.label === ''">
                      <div v-if="day.label === '' && (fiveMinutes-1)%12===0 " class="minutes">{{ horarios[(fiveMinutes-1)/12].label }}</div>
                    </div>
                    <div class="days" v-if="day.label !== ''" :class="{ active: day.label !== '' && recuperaDatos(day.index, fiveMinutes) && recuperaDatos(day.index, fiveMinutes).costo }">
                      <div class="programa" v-if="day.label !== '' && recuperaDatos(day.index, fiveMinutes)">
                        <span class="white--text" v-if="recuperaDatos(day.index, fiveMinutes).primero">
                          {{ recuperaDatos(day.index, fiveMinutes).horas }}
                          <v-tooltip bottom>
                              <v-btn small icon dark slot="activator" color="info" @click="muestraDetalle(day.index, fiveMinutes)"> <v-icon> visibility </v-icon> </v-btn>
                              <span>Ver detalle</span>
                            </v-tooltip>
                        </span>
                        <span class="white--text" v-if="recuperaDatos(day.index, fiveMinutes-1) && recuperaDatos(day.index, fiveMinutes-1).primero && !recuperaDatos(day.index, fiveMinutes).primero">
                          {{ recuperaDatos(day.index, fiveMinutes).descripcion}}
                        </span>
                        <span v-else>&nbsp;</span>
                      </div>
                    </div>
                  </slot>
                </template>
              </div>
            </div>
          </div>
        </div>
      </v-container>
    </v-card-text>
    <v-dialog v-model="modalVer" max-width="500px" persistent>
      <v-card>
        <v-card-title>
          <h3>Detalles del programa</h3>
        </v-card-title>
        <v-card-text>
          <v-layout wrap align-left>
            <v-flex xs2>
              <b class="primary--text">Nombre:</b>
            </v-flex>
            <v-flex xs10>  
              <div>
                {{ descripcionVer }}
              </div>
            </v-flex>
          </v-layout>
          <div>
            <b class="primary--text">Días y Horario de difusión:</b>
          </div>
          <v-layout wrap align-left>
            <v-flex xs4>
              <div>
                {{ horasVer }}
              </div>
            </v-flex>
            <v-flex xs8>  
              <div>
                {{ obtieneNombreDias(intervaloDiasVer) }}
              </div>
            </v-flex>
          </v-layout>
          <v-layout wrap align-left>
            <v-flex xs3>
              <b class="primary--text">Tipo de Costo:</b>
            </v-flex>
            <v-flex xs9>  
              <div>
                {{ tipoCostoVer }}
              </div>
            </v-flex>
            <v-layout wrap align-left>
            <v-flex xs2>
              <b class="primary--text">Costo:</b>
            </v-flex>
            <v-flex xs10>  
              <div>
                {{ costoVer }}
              </div>
            </v-flex>
          </v-layout>
          <v-layout wrap align-left v-if="especificacionVer">
            <v-flex xs3>
              <b class="primary--text">Especificación:</b>
            </v-flex>
            <v-flex xs10>  
              <div>
                {{ especificacionVer }}
              </div>
            </v-flex>
          </v-layout>
          </v-layout>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click.stop="modalVer=false">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>

export default {
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
    }
  },
  data () {
    return {
      tarifarioProdTv: [],
      weekdayNames: [
        {label: 'Lunes', index: 1},
        {label: 'Martes', index: 2},
        {label: 'Miércoles', index: 3},
        {label: 'Jueves', index: 4},
        {label: 'Viernes', index: 5},
        {label: 'Sábado', index: 6},
        {label: 'Domingo', index: 7} ],
      weekdayNamesColumn: [
        {label: '', index: 0},
        {label: 'Lunes', index: 1},
        {label: 'Martes', index: 2},
        {label: 'Miércoles', index: 3},
        {label: 'Jueves', index: 4},
        {label: 'Viernes', index: 5},
        {label: 'Sábado', index: 6},
        {label: 'Domingo', index: 7} ],
      horarios: [
        {label: '05:00', index: 1},
        {label: '06:00', index: 2},
        {label: '07:00', index: 3},
        {label: '08:00', index: 4},
        {label: '09:00', index: 5},
        {label: '10:00', index: 6},
        {label: '11:00', index: 7},
        {label: '12:00', index: 8},
        {label: '13:00', index: 9},
        {label: '14:00', index: 10},
        {label: '15:00', index: 11},
        {label: '16:00', index: 12},
        {label: '17:00', index: 13},
        {label: '18:00', index: 14},
        {label: '19:00', index: 15},
        {label: '20:00', index: 16},
        {label: '21:00', index: 17},
        {label: '22:00', index: 18},
        {label: '23:00', index: 19},
        {label: '00:00', index: 20},
        {label: '01:00', index: 21},
        {label: '02:00', index: 22}],
      modalVer: false,
      intervaloDiasVer: [],
      semanaCompletaVer: false,
      descripcionVer: null,
      costoVer: null,
      horasVer: '',
      especificacionVer: null,
      tipoCostoVer: null
    };
  },
  mounted () {
    if (this.idMedio !== null && this.idMedioTipoMedio !== null && this.idTarifario !== null) {
      this.$service.get(`medios/${this.idMedio}/tipos_medio/${this.idMedioTipoMedio}/tarifarios/${this.idTarifario}`)
      .then((response) => {
        if (response && response.tarifario) {
          this.tarifario = response.tarifario;
          this.tarifarioProdTv = this.tarifario.data.matriz_detalles;
        } else {
          this.$message.error('No se pudo obtener el detalle');
        }
      }).catch((error) => {
        this.$message.error('No se pudo obtener el detalle ' + error);
      });
    }
  },
  methods: {
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
    recuperaDatos (dia, nIntervaloMinutos) {
      let programacionDia = null;
      let contenidoEncontrado = null;
      programacionDia = this.tarifarioProdTv.find((elemento) => {
        if (elemento.index === dia) {
          return elemento;
        }
      });
      if (programacionDia && programacionDia.programacion && nIntervaloMinutos > 0) {
        contenidoEncontrado = programacionDia.programacion.find((element) => {
          if (element.horaIndex === nIntervaloMinutos) {
            return element;
          }
          return null;
        });
      }
      return contenidoEncontrado;
    },
    muestraDetalle (dia, minutos) {
      this.modalVer = true;
      let item = this.recuperaDatos(dia, minutos);
      this.$service.get(`medios/${this.idMedio}/tipos_medio/${this.idMedioTipoMedio}/tarifarios/${this.idTarifario}/detalles/${item.id}`)
      .then(response => {
        if (response.detalle && response.detalle.data) {
          this.descripcionVer = response.detalle.data.descripcion;
          this.horasVer = response.detalle.data.hora_inicio + ' - ' + response.detalle.data.hora_fin;
          this.intervaloDiasVer = response.detalle.data.dias;
          this.tipoCostoVer = 'por ' + response.detalle.data.tipo_costo;
          this.costoVer = 'Bs' + response.detalle.data.costo;
          if (response.detalle.data.especificacion) {
            this.especificacionVer = response.detalle.data.especificacion;
          } else {
            this.especificacionVer = null;
          }
        }
      }).catch((error) => {
        this.$message.error('No se puede mostrar el programa seleccionado ' + error);
      });
    },
    obtieneHora (cadenaHora) {
      let cadenaSeparada = cadenaHora.split(':');
      return cadenaSeparada[0];
    },
    obtieneMinutos (cadenaHora) {
      let cadenaSeparada = cadenaHora.split(':');
      return cadenaSeparada[1];
    }
  }
};
</script>

<style type="text/css">

/* Position/Flex */

/* Make the calendar flex vertically */
.calendar-view {
	display: flex;
	flex-direction: column;
}

.calendar-view .header {
	display: flex;
	flex: 0 1 auto;
	flex-flow: row nowrap;
	align-items: center;
	min-height: 2.5em;
}

.calendar-view .header .periodLabel {
	display: flex;
	flex: 1 1 auto;
	flex-flow: row nowrap;
	min-height: 1.2em;
}

.calendar-view .dayList {
	display: flex;
	flex: 0 0 auto;
	flex-flow: row nowrap;
}

.calendar-view .daysContent {
	display: flex;
	flex: 0 0 auto;
	flex-flow: row nowrap;
}

.calendar-view .daysContent .days {
	display: flex;
	flex: 1 1 0;
	flex-flow: row nowrap;
	align-items: center;
	justify-content: left;
	text-align: justify;
  height: auto;
  /* border: 0px 2px 0 2px;
  border-width: 0px 2px 0 2px;
  border-color: #435f43;
  para bordessss */
}

.calendar-view .dayList .day {
	display: flex;
	flex: 1 1 0;
	flex-flow: row nowrap;
	align-items: center;
	justify-content: center;
	text-align: center;
}

/* The calendar grid should take up the remaining vertical space */
.calendar-view .weeks {
	display: flex;
	flex: 1 1 auto;
	flex-flow: column nowrap;

	/* Allow grid to scroll if there are too may weeks to fit in the view */
	overflow-y: scroll;
	-ms-overflow-style: none;
}

/* Use flex basis of 0 on week row so all weeks will be same height regardless of content */
.calendar-view .week {
	display: flex;
	flex: 1 1 0;
	flex-flow: row nowrap;
	min-height: 3em;

	/* Allow week events to scroll if they are too tall */
	position: relative;
	width: 100%;
	overflow-y: scroll;
	-ms-overflow-style: none;
}

.calendar-view .weeks::-webkit-scrollbar,
.calendar-view .week::-webkit-scrollbar {
	width: 0; /* remove scrollbar space */
	background: transparent; /* optional: just make scrollbar invisible */
}

.calendar-view .week .day {
	display: flex;
	flex: 1 1 0;
	position: relative; /* Fallback for IE11, which doesn't support sticky */
	position: sticky; /* When week's events are scrolled, keep the day content fixed */
	top: 0;
}

.calendar-view .day .content {
	position: absolute;
	left: 0;
	top: 0;
	bottom: 0;
	right: 0;
}

.calendar-view .days .content {
	position: absolute;
	left: 0;
	top: 0;
	bottom: 0;
	right: 0;
  width: auto;
}

.calendar-view .day .date {
	float: right;
	clear: both;
}

.calendar-view .hour {
	background-color: #f7f7f7;
  width: 50px;
  text-align: center;
  border-top: 1px;
}

.calendar-view .minutes {
	background-color: #ffffff;
  width: 50px;
  text-align: center;
  height: 14px;
  overflow: hidden;
  border-width: 2px 0px 0 0;
}

.calendar-view .groupMinutes {
	background-color: #f7f7f7;
  text-align: left;
}

.calendar-view .event {
	position: absolute;
	/* // white-space: nowrap; */
	overflow: hidden;
	background-color: #f7f7f7;
}
.calendar-view .sin-event {
	position: absolute;
	/* // white-space: nowrap; */
	overflow: hidden;
	background-color: #f7f7f7;

}

.calendar-view .programa {
	/* white-space: nowrap; */
	overflow: hidden;
  display: block;
  min-width: 10%;
	/* background-color: #ffc241; */
}
/* Colors */

.calendar-view .header,
.calendar-view button,
.calendar-view .dayList,
.calendar-view .weeks,
.calendar-view .week,
.calendar-view .day,
.calendar-view .event {
	border-style: solid;
	border-color: #ddd;
}

/* Event Times */

.calendar-view .event .startTime:not(.hasEndTime),
.calendar-view .event .endTime {
	margin-right: 0.4em;
}

.calendar-view .event .endTime::before {
	content: "-";
}

/* Internal Metrics */

.calendar-view,
.calendar-view div,
.calendar-view button {
	box-sizing: border-box;
	line-height: 0.8em;
	font-size: 1em;
}

.calendar-view .dayList div {
	padding: 0.2em;
}

.calendar-view .date,
.calendar-view .event {
	padding: 0.5em;
}

/* Allows emoji icons or labels (such as holidays) to be added more easily to specific dates by having the margin set already. */
.calendar-view .day .date::before {
	margin-right: 0.5em;
}

/* Borders */

.calendar-view .week {
	border-width: 0 0 0px 0px;
}

.calendar-view .header {
	border-width: 1px 1px 0 1px;
}

.calendar-view .dayList {
	border-width: 2px 0px 1px 1px;
}

.calendar-view .day {
	border-width: 1px 1px 0 0;
}
/* }  cambiar el segundo a cero para que no hayan líneas */

.calendar-view .event {
	border-width: 1px;
}

.horario .days, .horario .hour {
  position: relative;
  min-height: 12px;
  border-bottom: 1px solid #eee;
  font-size: .95rem;
}
.horario .days.active {
  background-color: #3d93c0;
  border-bottom: 1px solid #3d93c0;
  font-size: .9rem;
}
.horario .days::after, .horario .hour::after {
  content: "";
  position: absolute;
  right: 0;
  top: 0;
  bottom: -3px;
  border-right: 1px solid #aaa;
}

.horario .groupMinutes:nth-child(12n+1) {
  border-bottom: 1px solid #3593be;
}
</style>
