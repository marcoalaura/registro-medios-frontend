'use strict';

export default {
  methods: {
    login (data) {
      this.$http.post(this.$authUrl, {
        nit: data.nit,
        usuario: data.username,
        contrasena: data.password
      }).then(response => {
        if (response.data) {
          let menu = response.data.menu;
          let usuario = response.data.usuario;
          let permisos = response.data.permisos;
          let token = response.data.token;
          let redirect = response.data.redirect;
          let sidenav = data.sidenav === undefined ? true : data.sidenav;

          this.$storage.setUser(usuario);
          this.$storage.set('menu', menu);
          this.$storage.set('token', token);
          this.$storage.set('sidenav', sidenav);
          this.$storage.set('permissions', permisos);

          this.$store.commit('setUser', usuario);
          this.$store.commit('setMenu', menu);
          this.$store.commit('setSidenav', sidenav);
          this.$store.commit('setPermissions', permisos);
          this.$store.commit('setAuth', true);

          // Obtenemos datos del medio
          if (usuario.id_medio) {
            this.$service.get('medios/' + usuario.id_medio)
            .then(response => {
              if (response.medio && response.medio.data) {
                this.$storage.set('medio', response.medio.data);
              }
            }).catch(() => {
              this.message.error('No se obtuvieron los valores del Medio');
            });
          };
          this.timerSession();

          // Direccionamos segun sea necesario
          if (usuario.id_rol === 5) {
            this.$router.push(redirect || data.redirect || '/');
          } else {
            this.$router.push(redirect || data.redirect || '/bandejaPauteo'); // Cambiar a la principal de pauteo.
          }
        }
      }).catch((error) => {
        this.$message.error(error.response ? error.response.data.error || 'Usuario y/o contraseña inválida' : 'El sistema no pudo conectarse, revise su conexión de internet.');
      });
    },

    logout (store, router) {
      store = store || this.$store;
      router = router || this.$router;

      let redirect = '/login';
      if (this.$storage.getUser()) {
        if (this.$storage.getUser().id_rol === 5) {
          redirect = '/login';
        } else {
          redirect = '/loginAdmin';
        }
      }

      if (store.state.sessionInterval) {
        window.clearInterval(store.state.sessionInterval);
        store.state.sessionInterval = null;
      }

      this.$storage.removeUser();
      this.$storage.remove('menu');
      this.$storage.remove('token');
      this.$storage.remove('sidenav');
      this.$storage.remove('permissions');
      this.$storage.remove('medio');
      this.$storage.remove('sitioActual');

      store.commit('setDefault');

      // Debemos resetear todos los formularios que usamos con vuex-map-fields
      let route = this.$router.currentRoute.path;
      store.commit('usuario/cleanForm');
      // let redirect = '/login';
      if (['/loginAdmin', '/creacionCuenta', '/olvido'].indexOf(route) !== -1) {
        redirect = route.substring(1);
      }
      router.push(redirect);
    },

    timerSession () {
      // Definiendo el tiempo en el que dura una sesión sin actividad
      this.$store.commit('SET_TIME', process.env.TIME_SESSION_EXPIRED * 60);
      this.$store.state.sessionInterval = window.setInterval(() => {
        this.$store.commit('TIME_DECREASE');
        if (this.$store.state.time <= 0) {
          this.$message.warning('Su sesión ha sido cerrada automáticamente después de ' + process.env.TIME_SESSION_EXPIRED + ' minutos de inactividad.', '¡Sesión cerrada!', { timeout: 30000 });
          this.logout();
        }
      }, 15000);
    },

    reload () {
      this.$store.commit('setMain', false);
      this.$nextTick(function () {
        this.$store.commit('setMain', true);
      });
    }
  }
};
