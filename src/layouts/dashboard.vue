<template>
  <v-app>
    <sidebar />
    <v-main class="mx-md-16 my-md-6 ma-5">
      <header class="d-flex justify-space-between">
        <label class="page--name">{{ pageTitle }}</label>
        <v-btn class="mx-2 no-shadow" width="30px" @click="logout" height="30px" fab dark small color="rgba(228, 88, 88, 0.2)"> <i class="icon-power"></i></v-btn>
      </header>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import animation from '@/utils/animation';
import Sidebar from '../components/dashboard/sidebar.vue';

const auth = namespace('auth');

@Component({
  name: 'Dashboard',
  components: {
    Sidebar
  }
})
export default class Dashboard extends Vue {
  animation = animation;

  get pageTitle() {
    const pageTitle = this.$route.fullPath.split('/').filter(x => x !== '');
    return pageTitle[pageTitle.length - 1];
  }

  mounted() {
    this.animation.drawSvg('path', 600);
  }

  @auth.Action
  private logout!: () => void;
}
</script>

<style>
.page--name {
  color: #000;
  text-transform: capitalize;
}
</style>
