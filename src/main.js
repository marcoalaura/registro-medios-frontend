// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueI18n from 'vue-i18n';
import VueProgressBar from 'vue-progressbar';

// local file
import App from './App';
import router from './router';
import store from './store';

// Plugins
import EventBus from '@/common/plugins/event-bus';
import Util from '@/common/plugins/util';
import Storage from '@/common/plugins/storage';
import Datetime from '@/common/plugins/datetime';
import Filter from '@/common/plugins/filter';
import Message from '@/common/plugins/message/message';
import Service from '@/common/plugins/service';
import Modal from '@/common/plugins/modal/modal';
import messages from '@/common/lang/';

import {
  Vuetify,
  VApp,
  VNavigationDrawer,
  VFooter,
  VList,
  VBtn,
  VIcon,
  VGrid,
  VMenu,
  VToolbar,
  VDialog,
  VAvatar,
  VDivider,
  VTooltip,
  VForm,
  VTextField,
  VRadioGroup,
  VCheckbox,
  VSelect,
  VChip,
  VSwitch,
  VDataTable,
  VCard,
  VBreadcrumbs,
  VAlert,
  VTabs,
  transitions,
  VExpansionPanel,
  VDatePicker
} from 'vuetify';
import '../node_modules/vuetify/src/stylus/app.styl';

// Config vuetify
Vue.use(Vuetify, {
  components: {
    VApp,
    VNavigationDrawer,
    VFooter,
    VList,
    VBtn,
    VIcon,
    VGrid,
    VMenu,
    VToolbar,
    VDialog,
    VAvatar,
    VDivider,
    VTooltip,
    VForm,
    VTextField,
    VRadioGroup,
    VCheckbox,
    VSelect,
    VChip,
    VSwitch,
    VDataTable,
    VCard,
    VBreadcrumbs,
    VAlert,
    VTabs,
    transitions,
    VExpansionPanel,
    VDatePicker
  },
  theme: {
    primary: '#5f5f5f',
    secondary: '#b8b8b8',
    accent: '#82B1FF',
    info: '#3493bf',   // #34bfa3
    warning: '#ffb822',
    error: '#f4516c',
    success: '#84c268'
  }
});

// Plugins config
Vue.use(EventBus);
Vue.use(Util);
Vue.use(Storage, { appName: 'base' });
Vue.use(Message, { timeout: 6000 });
Vue.use(Service, {
  apiUrl: process.env.API_URL,
  graphqlUrl: process.env.GRAPHQL_URL,
  authUrl: process.env.AUTH_URL,
  authToken: process.env.AUTH_TOKEN,
  errorFormat: 'error'
});
Vue.use(Modal);
Vue.use(Datetime);
Vue.use(Filter);

// Progressbar config
Vue.use(VueProgressBar, {
  color: '#52d1e1',
  failedColor: '#fc4b6c',
  thickness: '4px'
});

// i18n config
Vue.use(VueI18n);
const i18n = new VueI18n({
  locale: process.env.LANG,
  messages
});

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  components: { App },
  template: '<App/>'
});
