<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'App',
  data: () => ({
    //
  })
});
</script>

<style>
@import url(assets/styles/global.css);
@import url(assets/styles/icomoon.css);

.v-text-field--single-line .v-input__slot {
  background-color: #fff2f2 !important;
  border-color: #fff2f2 !important;
}
</style>
