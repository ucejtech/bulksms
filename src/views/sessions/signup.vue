<template>
  <v-form ref="registerForm" @submit.prevent="signup">
    <label>Sign Up</label>
    <!-- <custom-input :required="true" /> -->
    <v-text-field class="mt-5" background-color="#f2f3fc" placeholder="Enter Display Name" :required="true" v-model="model.displayName" :rules="rules.displayName" flat hide-details="auto" solo></v-text-field>
    <v-text-field class="mt-5" background-color="#f2f3fc" placeholder="Enter Email" :required="true" v-model="model.email" :rules="rules.email" flat hide-details="auto" solo></v-text-field>
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
    <label class="text-left other--links mt-3" @click="$emit('change-component-id', 'signin')">Login</label>
    <br />
    <v-btn class="mt-6" type="submit" block color="primary" :loading="authLoading">Register</v-btn>
  </v-form>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { FirebaseError } from 'firebase';
import CustomInput from '../../components/custom-input.vue';
import { AuthenticationModel } from '../../types';

const auth = namespace('auth');

@Component({
  name: 'Signin',
  components: {
    CustomInput
  }
})
export default class Home extends Vue {
  authLoading = false;

  passwordState = 'password';

  rules = {
    email: [(v: string | null) => !!v || 'E-mail is required', (v: string) => /[\w|.|-]*@\w*\.[\w|.]*\w/.test(v) || 'E-mail must be valid'],
    password: [(v: string | null) => !!v || 'Password is required'],
    displayName: [(v: string | null) => !!v || 'Name is Required']
  };

  model = {
    displayName: '',
    email: '',
    password: ''
  };

  get inputState() {
    return this.passwordState === 'password' ? { icon: 'mdi-eye-off-outline', type: 'password' } : { icon: 'mdi-eye-outline', type: 'text' };
  }

  changePasswordState() {
    if (this.passwordState === 'password') {
      this.passwordState = 'text';
    } else {
      this.passwordState = 'password';
    }
  }

  signup() {
    if ((this.$refs.registerForm as Vue & { validate: () => boolean }).validate()) {
      this.authLoading = true;
      this.register(this.model)
        .then(() => {
          this.$toast.success('Success', 'Registration successful', this.$vuetify.breakpoint.mdAndUp ? 'topCenter' : 'bottomCenter');
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
  private register!: (model: AuthenticationModel) => Promise<FirebaseError>;
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
