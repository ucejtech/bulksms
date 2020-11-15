import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#e22726',
        secondary: '#f7c7c7',
        accent: '#F1F5FF',
        error: '#b71c1c'
      },
      dark: {
        primary: '#e22726',
        secondary: '#f7c7c7',
        accent: '#F1F5FF',
        error: '#b71c1c'
      }
    }
  }
});
