<template>
  <div>
    <home-abstract-svg v-show="$vuetify.breakpoint.mdAndUp" />
    <div id="home" :class="!$vuetify.breakpoint.mdAndUp ? 'abstract' : ''">
      <nav class="nav d-flex align-center my-4 mx-md-16 mx-7">
        <div class="app--name mr-md-16 text-lowercase">
          <!-- {{ appConstants.appTitle }} -->
          <img src="@/assets/images/logo.png" alt="logo" width="150px">
        </div>
        <div class="nav--links ml-md-16">
          <span class="links mx-7">About</span>
          <span class="links mx-7">Contact</span>
          <span class="links mx-7">FAQs</span>
        </div>
      </nav>
      <main class="d-sm-flex pa-md-16 pa-7 mx-md-8">
        <section class="content mt-md-16 pt-9 d-flex">
          <div class="app--intro">
            <label class="main--text"> {{ pageTexts.main }}</label>
            <p class="sub--text mt-5">
              <label>
                {{ pageTexts.sub }}
                <span class="colored--text" @click="changeComponent()">
                  {{ pageTexts.link }}
                </span>
              </label>
            </p>
          </div>
          <div class="illustrations" v-show="$vuetify.breakpoint.mdAndUp">
            <img src="../assets/images/illustrations/mark.svg" alt="" srcset="" />
            <img src="../assets/images/illustrations/richie.svg" alt="" srcset="" />
          </div>
        </section>
        <section class="columns mt-xs-16 mt-md-16 pt-3 d-flex justify-center text-center">
          <transition name="slide-left" mode="out-in" @enter="enter" @afterEnter="afterEnter">
            <component @change-component-id="handleChangeComponent" :is="componentId"></component>
          </transition>
        </section>
      </main>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import animation from '@/utils/animation';
import Signin from '@/views/sessions/signin.vue';
import Signup from '@/views/sessions/signup.vue';
import ForgotPassword from '@/views/sessions/forgotpass.vue';
import appConstants from '../app/constants';

@Component({
  name: 'Home',
  components: {
    signin: Signin,
    signup: Signup,
    forgotPass: ForgotPassword
  }
})
export default class Home extends Vue {
  prevHeight = '180px';

  animation = animation;

  appConstants = appConstants;

  componentId = 'signin';

  mounted() {
    this.animation.drawSvg('path', 600);
  }

  get pageTexts() {
    if (this.componentId === 'signin') {
      return {
        main: `Sign in to your ${appConstants.appTitle} Dashboard`,
        sub: `If you don't have a ${appConstants.appTitle} account`,
        link: 'Create one'
      };
    }
    if (this.componentId === 'signup') {
      return {
        main: `Register to own a ${appConstants.appTitle} Account`,
        sub: `Already have a ${appConstants.appTitle} account?`,
        link: 'Log In'
      };
    }

    return {
      main: `Reset password for ${appConstants.appTitle} Account`,
      sub: `Already have a ${appConstants.appTitle} account?`,
      link: 'Log In'
    };
  }

  handleChangeComponent(val: string) {
    this.componentId = val;
  }

  enter(element: HTMLDivElement) {
    const { height } = getComputedStyle(element);

    element.style.height = this.prevHeight;

    setTimeout(() => {
      element.style.height = height;
    });
  }

  afterEnter(element: HTMLDivElement) {
    element.style.height = 'auto';
    this.prevHeight = '0';
  }

  changeComponent() {
    if (this.componentId === 'signin') {
      this.handleChangeComponent('signup');
    } else {
      this.handleChangeComponent('signin');
    }
  }
}
</script>

<style>
.abstract {
  z-index: -1;
  background-image: url(../assets/images/background/abstract.svg);
}
#home {
  z-index: 9999 !important;
}
.nav--links .links {
  font-size: 12px;
  line-height: 15px;
}
.links:hover {
  color: coral;
  text-decoration: underline;
  cursor: pointer;
}
.content .illustrations img:nth-child(2) {
  position: absolute;
  left: 230px;
}
.app--intro {
  width: 318px;
  line-height: 24px;
  font-size: 20px;
}
.app--intro .main--text {
  font-weight: bold;
  font-size: 40px;
  line-height: 49px;
}
.app--intro .sub--text {
  width: 289px;
}
.columns {
  width: 100%;
}
.colored--text {
  color: #e45858;
  cursor: pointer;
}
.other--links {
  font-size: 12px !important;
  line-height: 15px !important;
  color: #828282 !important;
  font-weight: normal !important;
  cursor: pointer;
}
.other--links:hover {
  color: #e45858 !important;
}

.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition-duration: 0.5s;
  transition-property: height, opacity, transform;
  transition-timing-function: cubic-bezier(0.55, 0, 0.1, 1);
  overflow: hidden;
}

.slide-left-enter,
.slide-right-leave-active {
  opacity: 0;
  transform: translateY(2em);
}

.slide-left-leave-active,
.slide-right-enter {
  opacity: 0;
  transform: translateY(-2em);
}
</style>
