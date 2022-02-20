import Vue from 'vue'
import Vuetify from 'vuetify'
import Message from '@/plugins/message/message';
import Storage from '@/plugins/storage';
// import Service from '@/plugins/service';

Vue.use(Vuetify);
Vue.use(Message);
Vue.use(Storage);
// Vue.use(Service, {
//   apiUrl: process.env.VUE_APP_API_URL,
//   baseServer: process.env.VUE_APP_BASE_SERVER,
//   authToken: process.env.VUE_APP_AUTH_TOKEN,
//   filterResponse: (response, Message) => {
//     if (response.datos && response.finalizado) {
//       return response.datos;
//     }
//     if ('finalizado' in response && !response.finalizado) {
//       Message.error(response.message);
//       return response.datos;
//     }
//     return response;
//   },
//   errorFormat: 'mensaje'
// });
