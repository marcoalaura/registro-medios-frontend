<template>
  <section>
    <div class="login-container">
      <div class="logo-app"></div>
      <v-card class="login-form">
        <v-form
          @submit.prevent="submit"
          v-model="valid"
          ref="form"
          lazy-validation
        >
          <v-card-title primary-title>
            <h4>{{ $t('olvido.title') }}</h4>
            <v-container fluid>
              <v-alert type="info" :value="true">
                {{ $t('olvido.info') }}
              </v-alert>
              <v-layout row wrap>
                <v-flex xs12>
                  <v-text-field
                    name="mail"
                    :label="$t('olvido.mail')"
                    id="mail"
                    append-icon="mail"
                    v-model="form.username"
                    autofocus
                    maxlength="25"
                    :rules="$validate(['required'])"
                    required
                  ></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-title>
           <v-card-actions>
            <v-btn
              color="secundary"
              large
              type="button"
              href="#/loginAdmin"
            ><v-icon >home</v-icon>
            {{ $t('olvido.inicio') }}</v-btn>
            <div class="spacer"></div>
            <v-btn
              color="primary"
              large
              :disabled="!valid"
              type="submit"
            ><v-icon >send</v-icon>
            {{ $t('olvido.send') }}
            </v-btn>
          </v-card-actions>
          <!-- <v-card-title class="info">
            <a href="">{{ $t('login.signUp') }}</a>
          </v-card-title> -->
        </v-form>
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
        username: '',
        password: ''
      },
      hidePass: true,
      remember: false
    };
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

<style src="./olvido.scss" lang="scss"></style>
