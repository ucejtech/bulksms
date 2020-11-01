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
</style>
