<template>
  <div class="mt-5">
    <v-row>
      <v-col cols="12" md="3">
        <v-text-field placeholder="Search Contact" background-color="#f2f3fc" hide-details="auto" :required="true" flat append-icon="icon-magnify" solo></v-text-field>
        <div class="contact--display--groups mt-6 pa-4">
          <div class="selections d-flex justify-space-between align-center">
            <v-checkbox v-model="checkbox" label="All" hide-details required></v-checkbox>
            <span>1250</span>
          </div>
          <div class="selections d-flex justify-space-between align-center mt-3">
            <v-checkbox v-model="checkbox" label="Groups" hide-details required></v-checkbox>
            <span>30</span>
          </div>
        </div>
        <div class="mt-6 pt-3 pr-3 import--csv">
          <div class="ml-4">Import Contacts</div>
          <div class="mt-4 d-flex">
            <img src="@/assets/images/illustrations/hand-right.svg" alt="" />
            <div class="d-flex justify-end full-width text-center"><img src="@/assets/images/icons/csv.svg" alt="" /> Supported Files</div>
          </div>
        </div>
      </v-col>
      <v-col cols="12" md="7">
        <div class="colored--accent--box contact--list d-flex align-center pl-3">
          <v-checkbox v-model="checkbox" label="#" hide-details required></v-checkbox>
          <span class="ml-7">Phone Numbers</span>
        </div>
      </v-col>
      <v-col cols="12" md="2"> <v-btn color="primary" height="46" block>Send Message</v-btn> </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { AuthStateType } from '@/store/modules/auth';

const auth = namespace('auth');

@Component({
  name: 'DashboardIndex'
})
export default class DashboardIndex extends Vue {
  @auth.Getter
  getLoggedInUser!: AuthStateType['currentUser'];

  get firstname(): string {
    return this.getLoggedInUser ? this.getLoggedInUser.displayName.split(' ')[0] : '';
  }
}
</script>

<style>
.contact--card {
  background-image: url(../../assets/images/background/contact.svg);
  background-position: bottom right;
  background-position-x: 90%;
}
.import--csv {
  background: #fcf4f9;
  height: 104px;
  width: 100%;
  font-size: 12px;
  line-height: 15px;
}
@media screen and (max-width: 430px) {
  .import--csv img {
    margin-top: -10% !important;
  }
}
@media screen and (max-width: 900px) {
  .import--csv img {
    margin-top: -8% !important;
  }
}
.import--csv img {
  /* position: absolute; */
  margin-top: -16%;
}
.card--text {
  width: 81px !important;
  font-weight: bold;
  font-size: 15px;
  line-height: 18px;
  color: #2b2c34;
}
.contact--display--groups {
  background: var(--accent) !important;
  border-radius: 5px;
}
.contact--display--groups .v-input--selection-controls .v-input__slot .v-label {
  font-style: normal;
  font-weight: normal;
  font-size: 12px !important;
  line-height: 15px !important;
  color: #000000;
}
.contact--display--groups .selections {
  font-size: 10px;
}
.v-input--selection-controls {
  margin: 0 !important;
}
.colored--accent--box {
  background: var(--accent);
  height: 46px;
}
.contact--list {
  font-size: 13px;
}
.contact--list .v-input--selection-controls .v-input__slot .v-label {
  font-style: normal;
  font-weight: normal;
  font-size: 13px !important;
  line-height: 15px !important;
  color: #000000;
}
</style>
