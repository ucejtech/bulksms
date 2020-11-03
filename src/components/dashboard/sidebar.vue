<template>
  <v-navigation-drawer class="app--drawer px-5" color="secondary" width="225px" app>
    <div class="d-flex justify-space-between mt-5">
      <div class="text-primary app--name text-lowercase">{{ appConstants.appTitle }}</div>
      <img src="@/assets/images/icons/paper-plane.svg" alt="" />
    </div>
    <div class="mt-8 d-flex align-center">
      <img src="@/assets/images/avatar/user.svg" width="49px" height="49px" />
      <div class="ml-2">
        <div class="display--name">{{ firstname }}</div>
        <div class="display--contact colored--text">{{ getLoggedInUser ? getLoggedInUser.email : '' }}</div>
      </div>
    </div>
    <div class="sidebar--navigation pt-7">
      <div
        :class="[isCurrentRoute(item.link) ? 'active' : '', 'sidebar--link mb-4 d-flex align-center pa-4']"
        v-for="(item, index) in sidenavLinks"
        :key="index"
        @click="!isCurrentRoute(item.link) ? $router.push(item.link) : ''"
      >
        <i :class="item.icon"></i>
        <span class="ml-4 d-flex align-center justify-space-between">
          <label> {{ item.title }}</label>
          <i class="icon-exit"></i>
        </span>
      </div>
    </div>
    <sidebar-abstract-svg />
  </v-navigation-drawer>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import appConstants from '@/app/constants';
import { namespace } from 'vuex-class';
import { AuthStateType } from '@/store/modules/auth';
import SidebarAbstractSvg from '@/components/dashboard/sidebar-abstract-svg.vue';

const auth = namespace('auth');

@Component({
  name: 'Sidebar',
  components: {
    SidebarAbstractSvg
  }
})
export default class Sidebar extends Vue {
  appConstants = appConstants;

  sidenavLinks = [
    { title: 'Dashboard', icon: 'icon-home', link: '/dashboard/' },
    { title: 'Contacts', icon: 'icon-contact', link: '/dashboard/contacts' },
    { title: 'Saved Templates', icon: 'icon-dashboard', link: '/dashboard/templates' },
    { title: 'History', icon: 'icon-history', link: '/dashboard/history' },
    { title: 'Account', icon: 'mdi mdi-account-outline', link: '/dashboard/account' }
  ];

  @auth.Getter
  getLoggedInUser!: AuthStateType['currentUser'];

  isCurrentRoute(link: string) {
    return link === '/dashboard/' ? this.$route.fullPath === link || this.$route.fullPath === '/dashboard' : this.$route.fullPath === link;
  }

  get firstname(): string {
    return this.getLoggedInUser ? this.getLoggedInUser.displayName.split(' ')[0] : '';
  }
}
</script>

<style scoped>
.app--drawer {
  /* background-image: url(../../assets/images/background/sidebar-abstract.svg); */
  background-position: bottom;
  border-right: none !important;
}
.display--name {
  font-size: 15px;
  line-height: 18px;
}
.display--contact {
  font-size: 10px;
  line-height: 12px;
}

.sidebar--link {
  width: 185px;
  height: 35px;
  left: 20px;
  font-size: 13px;
  line-height: 16px;
  cursor: pointer;
}

.sidebar--link span {
  width: 100%;
  cursor: pointer;
}
.sidebar--link span label {
  cursor: pointer;
}

.sidebar--link span i {
  cursor: pointer;
  visibility: hidden;
}
.sidebar--link.active span i,
.sidebar--link:hover span i {
  visibility: visible !important;
}

.sidebar--link.active,
.sidebar--link:hover {
  cursor: pointer;
  background: var(--primary);
  border-radius: 5px !important;
  color: #fff;
}

.sidebar--link.active [class^='icon-']::before,
.sidebar--link.active [class*=' icon-']::before,
.sidebar--link:hover [class^='icon-']::before,
.sidebar--link:hover [class*=' icon-']::before {
  cursor: pointer;
  color: #fff;
}

[class^='icon-']::before,
[class*=' icon-']::before {
  color: #2b2c34;
  font-size: 11px;
}
[class^='mdi-']::before,
[class*=' mdi-']::before {
  font-size: 14px;
}
</style>
