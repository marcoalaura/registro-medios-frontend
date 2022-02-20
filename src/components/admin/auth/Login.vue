<template>
  <section>
    <div class="login-container">
      <div class="title-app">
        <h1>Sistema de registro de medios de comunicación y campañas publicitarias</h1>
        <h2></h2>
      </div>
      <v-card class="login-form">
        <v-form
          @submit.prevent="submit"
          v-model="valid"
          ref="form"
          lazy-validation
        >
          <v-card-title primary-title>
            <h4>{{ $t('login.title') }}</h4>
            <v-container layout fluid>
              <v-flex xs6>
                <v-layout row wrap>
                  <v-flex xs12>
                    <v-text-field
                      name="nit"
                      :label="$t('login.nit')"
                      id="nit"
                      append-icon="picture_in_picture"
                      v-model="form.nit"
                      maxlength="25"
                      :rules="$validate(['required'])"
                      required
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12>
                    <v-text-field
                      name="username"
                      :label="$t('login.user')"
                      id="username"
                      append-icon="person"
                      v-model="form.username"
                      maxlength="25"
                      :rules="$validate(['required'])"
                      required
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12>
                    <v-text-field
                      name="password"
                      :label="$t('login.password')"
                      id="password"
                      append-icon="lock"
                      :append-icon-cb="changeIcon"
                      :type="hidePass ? 'password' : 'text'"
                      v-model="form.password"
                      maxlength="100"
                      :rules="$validate(['required'])"
                      required
                    ></v-text-field>
                  </v-flex>
                </v-layout>
              </v-flex>
              <v-flex xs6>
                <v-layout row wrap pa-4>
                  <h4>{{ $t('login.system') }}</h4>
                  <p class="text-sm-justify">{{ $t('login.detail') }}</p>                  
                </v-layout>
              </v-flex>
            </v-container>
          </v-card-title>
          <v-card-actions>
            <v-btn
              color="primary"
              block
              large
              :disabled="!valid"
              type="submit"
            >{{ $t('login.login') }}</v-btn>
          </v-card-actions>
        </v-form>
        <div class="logo-app"></div>
      </v-card>
    </div>
    <!-- <div class="login-lang">
      <app-lang></app-lang>
    </div> -->
  </section>
</template>

<script>

import Auth from './mixins/auth';
import AppLang from '@/common/layout/AppLang';
import validate from '@/common/mixins/validate';

export default {
  mixins: [ Auth, validate ],
  data () {
    return {
      valid: true,
      form: {
        nit: '',
        username: '',
        password: ''
      },
      hidePass: true,
      remember: false
    };
  },
  created () {
    this.$storage.set('id_medio', 0);
    if (this.$storage.getUser()) {
      if (this.$storage.getUser().id_rol === 5) {
        this.$router.push('/');
      } else {
        this.$router.push('/bandejaPauteo');
      }
    }
  },
  methods: {
    changeIcon () {
      if (this.form.password.length) {
        this.hidePass = !this.hidePass;
      }
    },
    submit () {
      if (this.$refs.form.validate()) {
        this.login(this.form);
      }
    }
  },
  components: { AppLang },
  computed: {
    getIcon () {
      return this.form.password.length === 0 ? 'lock' : this.hidePass ? 'visibility' : 'visibility_off';
    }
  },
  watch: {
    'form.password': function (val) {
      if (val.length === 0) {
        this.hidePass = true;
      }
    }
  }
};
</script>

<style src="./login.scss" lang="scss"></style>
