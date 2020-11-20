import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#e22726',
        secondary: '#f7c7c7',
        accent: '#fff2f2',
        error: '#b71c1c'
      },
      dark: {
        primary: '#e22726',
        secondary: '#f7c7c7',
        accent: '#fff2f2',
        error: '#b71c1c'
      }
    }
  }
});
