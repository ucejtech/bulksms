import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#6246EA',
        secondary: '#D1D1E9',
        accent: '#F1F5FF',
        error: '#b71c1c'
      },
      dark: {
        primary: '#6246EA',
        secondary: '#D1D1E9',
        accent: '#F1F5FF',
        error: '#b71c1c'
      }
    }
  }
});
