<template>
  <div class="mt-16 pt-5">
    <v-divider color="#f7c7c7"></v-divider>
    <v-card class="mx-auto text-center mt-n16" width="220px" flat>
      <img
        src="@/assets/images/avatar/user_1.svg"
        width="200px"
        height="200px"
      />
      <div class="text-21">
        {{ getLoggedInUser.displayName }}
      </div>
      <div class="text-15">
        {{ getLoggedInUser.email }}
      </div>
      <div class="text-primary">
        {{ getLoggedInUser.phoneNumber }}
      </div>
      <v-btn class="mt-6" block color="primary" @click="changePasswordDialog = !changePasswordDialog">Change Password</v-btn>
    </v-card>

    <v-dialog v-model="changePasswordDialog" width="400px">
      <v-card class="mx-auto pa-6 text-center">
        <div class="d-flex justify-space-between">
          <div>
            <v-btn class="no-shadow" color="primary" height="33" width="33" fab
              ><i class="icon-upload"></i
            ></v-btn>
            <label class="ml-4 text-13"
              >Change Password</label
            >
          </div>
          <v-btn
            class="no-shadow"
            height="33"
            width="33"
            @click="changePasswordDialog = !changePasswordDialog"
            color="transparent"
            fab
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>
       <v-form ref="changePasswordForm">
          <v-text-field
          class="mt-9"
          placeholder="Enter Password"
          background-color="#f2f3fc"
          v-model="model.changePassword.password"
          :rules="rules.password"
          hide-details="auto"
          type="password"
          :required="true"
          flat
          solo
        ></v-text-field>
        <v-text-field
          class="mt-5"
          placeholder="Confirm Password"
          background-color="#f2f3fc"
          v-model="model.changePassword.confirmPassword"
          :rules="rules.password"
          hide-details="auto"
          type="password"
          :required="true"
          flat
          solo
        ></v-text-field>
        <v-btn
          class="mt-6"
          color="primary"
          height="46"
          @click="changePassword"
          :loading="changePasswordLoading"
          >Change Password</v-btn
        >
       </v-form>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { AuthStateType } from '@/store/modules/auth';
import { Vue, Component } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import firebase from '@/plugins/firebase';
import { FirebaseError } from 'firebase';

const auth = namespace('auth');

@Component({
  name: 'Account'
})
export default class Account extends Vue {
    changePasswordLoading = false;

    changePasswordDialog = false;

    model = {
      changePassword: {
        password: '',
        confirmPassword: ''
      }
    }

    rules = {
      password: [(v: string) => !!v || 'Password is needed']
    }

    changePassword() {
      if ((this.$refs.changePasswordForm as Vue & { validate: () => boolean }).validate()) {
        if (this.model.changePassword.password !== this.model.changePassword.confirmPassword) {
          return this.$toast.error('Passwords do not match', 'Error', 'topCenter');
        }
        this.changePasswordLoading = true;
        const user = firebase.auth().currentUser;
        if (user) {
          user.updatePassword(this.model.changePassword.password).then(() => {
            this.$toast.success('Password Changed', 'Success', 'topCenter');
            this.changePasswordLoading = false;
          }).catch((err: FirebaseError) => {
            if (err.code === 'auth/requires-recent-login') {
              setTimeout(() => {
                this.logout();
              }, 1200);
            }
            const constantsMessage = this.$constants.authError[err.code];
            this.$toast.error(constantsMessage || err.message, 'Error', 'topCenter');
            this.changePasswordLoading = false;
          });
        }
      }
      return true;
    }

  @auth.Getter
  getLoggedInUser!: AuthStateType['currentUser'];

  @auth.Action
  private logout!: () => void;
}
</script>
