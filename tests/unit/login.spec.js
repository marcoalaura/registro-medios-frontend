import { createLocalVue, mount } from '@vue/test-utils';
import Login from '@/components/admin/auth/Login';
import Vuetify from 'vuetify';
import Message from '@/plugins/message/message';
import Storage from '@/plugins/storage';

describe('Login.vue', () => {
  const localVue = createLocalVue();
  let vuetify;
  beforeEach(() => {
    vuetify = new Vuetify();
    localVue.use(Message);
    localVue.use(Storage);
  });

  it('Verificando validaciones', async () => {
    // Renderizando el componente
    const wrapper = mount(Login, { localVue, vuetify, mocks: {
      $route: {
        query: {}
      },
      params: {},
    }});
    expect(wrapper.find('.error--text').exists()).toBe(false);
  });

  it('Verificando que al hacer submit existan el usuario y la contraseña', async () => {
    // Renderizando el componente
    const wrapper = mount(Login, { localVue, vuetify, mocks: {
      $route: {
        query: {}
      },
      params: {}
    }});
    await wrapper.find("form").trigger("submit.prevent");
    expect(wrapper.find('.error--text').exists()).toBe(true);
  });

  it('Si existe el parametro code para la restauración del bloqueo', async () => {
    // Renderizando el componente
    const wrapper = mount(Login, { localVue, vuetify, mocks: {
      $route: {
        params: {},
        query: {
          code: 'XCMFIOE73643-9864215ASFT755XYZ'
        }
      }
    }});
    expect(wrapper.vm.$route.query.code).toEqual('XCMFIOE73643-9864215ASFT755XYZ');
  });
});
