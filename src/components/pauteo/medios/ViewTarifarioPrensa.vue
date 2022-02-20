<template>
  <div>
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
          </tr>
        </template>
        <template slot="no-data">
            No existen datos.
        </template>
      </v-data-table>
    </v-card-text>
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
        { text: 'Costo', value: 'costo' }
      ],
      pagination: {
        sortBy: 'tipoCosto'
      },
      weekdayNames: [
        {label: 'Lunes', index: 1},
        {label: 'Martes', index: 2},
        {label: 'Miércoles', index: 3},
        {label: 'Jueves', index: 4},
        {label: 'Viernes', index: 5},
        {label: 'Sábado', index: 6},
        {label: 'Domingo', index: 7} ],
      tarifarioPrensa: [],
      tarifario: null
    };
  },
  mounted () {
    if (this.idMedio !== null && this.idMedioTipoMedio !== null && this.idTarifario !== null) {
      this.$service.get(`medios/${this.idMedio}/tipos_medio/${this.idMedioTipoMedio}/tarifarios/${this.idTarifario}`)
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
    }
  }
};
</script>
