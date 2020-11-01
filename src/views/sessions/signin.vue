<template>
  <v-form ref="loginForm" @submit.prevent="signin">
    <label>Sign In</label>
    <!-- <custom-input :required="true" /> -->
    <v-text-field class="mt-5" background-color="#f2f3fc" placeholder="Enter Phone number or email" :required="true" v-model="model.email" :rules="rules.email" flat hide-details="auto" solo></v-text-field>
    <v-text-field
      class="mt-4"
      placeholder="Password"
      background-color="#f2f3fc"
      :type="inputState.type"
      :required="true"
      @click:append="changePasswordState"
      v-model="model.password"
      :rules="rules.password"
      flat
      hide-details="auto"
      :append-icon="inputState.icon"
      solo
    ></v-text-field>
    <span class="mt-3 d-flex justify-space-between"> <label class="other--links" @click="$emit('change-component-id', 'signup')">Register</label><label class="other--links">Forgot Password?</label> </span>
    <v-btn class="mt-5" type="submit" block color="primary" :loading="authLoading">Login</v-btn>
  </v-form>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { FirebaseError } from 'firebase';
import { AuthenticationModel } from '../../types';
import CustomInput from '../../components/custom-input.vue';

const auth = namespace('auth');
@Component({
  name: 'Signin',
  components: {
    CustomInput
  }
})
export default class Home extends Vue {
  passwordState = 'password';

  authLoading = false;

  rules = {
    email: [(v: string | null) => !!v || 'E-mail is required', (v: string) => /[\w|.|-]*@\w*\.[\w|.]*\w/.test(v) || 'E-mail must be valid'],
    password: [(v: string | null) => !!v || 'Password is required']
  };

  model = {
    email: '',
    password: ''
  };

  get inputState() {
    return this.passwordState === 'password' ? { icon: 'mdi-eye-outline', type: 'password' } : { icon: 'mdi-eye-off-outline', type: 'text' };
  }

  changePasswordState() {
    if (this.passwordState === 'password') {
      this.passwordState = 'text';
    } else {
      this.passwordState = 'password';
    }
  }

  signin() {
    if ((this.$refs.loginForm as Vue & { validate: () => boolean }).validate()) {
      this.authLoading = true;
      this.login(this.model)
        .then(() => {
          this.$toast.success('Success', 'Login successful', this.$vuetify.breakpoint.mdAndUp ? 'topCenter' : 'bottomCenter');
          this.authLoading = false;
          this.$router.push('/dashboard');
        })
        .catch(({ message, code }: Record<string, string>) => {
          const constantsMessage = this.$constants.authError[code];
          this.$toast.error(constantsMessage || message, 'Error', 'topCenter');
          this.authLoading = false;
        });
    }
  }

  @auth.Action
  private login!: (model: AuthenticationModel) => Promise<FirebaseError>;
}
</script>

<style scoped>
form label {
  font-size: 15px !important;
  line-height: 18px;
  font-weight: bold;
}
form {
  width: 250px;
}
</style>
