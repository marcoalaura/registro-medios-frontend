/* eslint no-useless-escape: 0 */

'use strict';

export default {
  methods: {
    $validate (rules = []) {
      let validations = [];
      for (var i in rules) {
        if (rules[i] === 'required') {
          validations.push(this.$validateRequired);
        }
        if (rules[i] === 'email') {
          validations.push(this.$validateEmail);
        }
        if (rules[i] === 'url') {
          validations.push(this.$validateUrl);
        }
      }
      return validations;
    },
    $validateRequired (v) {
      return !!v || this.$t('validate.required');
    },
    $validateEmail (v) {
      return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v) || this.$t('validate.email');
    },
    $validateUrl (v) {
      return /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/.test(v) || this.$t('validate.url');
    }
  }
};
