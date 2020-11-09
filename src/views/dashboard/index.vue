<template>
  <v-row class="mt-7">
    <v-col cols="12" sm="8">
      <div class="dashboard--intro mt-6">
        <img src="@/assets/images/illustrations/hand-open.svg" alt="" />
        <div class="d-flex justify-space-between pb-3">
          <label class="dashboard--username ml-16 pl-10">
            Hola
            <span class="colored--text">{{ firstname }}</span
            >,
            <div>Welcome back</div>
          </label>
          <label class="d-flex align-end app--date">
            20th October, 2020
          </label>
        </div>
      </div>
      <div class="colored--box"></div>
      <v-row class="mt-4">
        <v-col cols="12" md="6">
          <v-card class="pl-4 pb-4 contact--card" color="#04A4E4" height="130px" flat>
            <div class="d-flex align-center pt-6">
              <div>
                <label class="value text-white">{{ getContactGroups.data.length }}</label>
                <br />
                <label class="value--desc text-white"> Groups</label>
              </div>
              <div class="ml-4">
                <label class="value text-white">{{ getContacts.data.length }}</label>
                <br />
                <label class="value--desc text-white"> Total</label>
              </div>
            </div>
            <div class="mt-6 d-flex align-center">
              <i class="text-white text-11 icon-contact"></i>
              <label class="text-white text-13 ml-3">Contacts</label>
            </div>
          </v-card>

          <v-card class="mt-4 px-4 pb-4 history--card" color="#EEEEEE" height="130px" flat>
            <div class="d-flex justify-space-between align-center pt-3">
              <label class="text-12 text-bold text-primary">Message</label>
              <v-btn text class="no-shadow" color="primary">VIEW</v-btn>
            </div>
            <div class="text-10">{{ lastMessage }}...</div>
            <div class="mt-2 d-flex align-center">
              <i class="text-primary text-11 icon-history"></i>
              <label class="text-primary text-13 ml-3">History <span class="text-black text-8">10th October, 2020</span></label>
            </div>
          </v-card>

          <v-card class="mt-4 px-4 pb-4 account--card" color="#EEEEEE" height="130px" flat>
            <div class="d-flex align-center pt-6">
              <img src="@/assets/images/avatar/richie.svg" alt="" />
              <div class="d-flex flex-column ml-3">
                <span class="no-shadow text-10 text-primary">VIEW PROFILE</span>
                <span class="text-8">Joined {{ getLoggedInUser ? getLoggedInUser.metadata.creationTime : '' }}</span>
              </div>
            </div>
            <!-- <div class="text-10">
                Mauris et scelerisque mi, ut auctor metus. Cras euismod mi vel elit molestie rutrum.
                Nunc lacinia non nibh eu auctor. Phasellus ornare ipsum lectus, et tristique ex
                aliquam sit...
              </div> -->
            <div class="mt-9 d-flex align-center">
              <i class="text-primary text-11 mdi mdi-account-outline"></i>
              <label class="text-primary text-13 ml-3">Account</label>
            </div>
          </v-card>
        </v-col>

        <v-col cols="12" md="6">
          <v-card class="pl-4 template--card" color="#C0DBCF" height="435px" flat>
            <div class="d-flex align-center pt-4 mb-4">
              <i class="icon-dashboard"></i>
              <label class="text-13 mt-1 ml-3">Saved Templates</label>
            </div>
            <div class="template--timeline-content px-2 pb-4">
              <div class="text-center mt-16 pt-16" v-if="getMessageTemplate.data.length < 1">
                No Message Template
              </div>
              <ul class="template--timeline" v-else>
                <li class="template mb-4 d-flex flex-column" v-for="(template, index) in getMessageTemplate.data" :key="index">
                  <label class="template--title text-12 text-bold">{{ template.title }}</label>
                  <label class="template--content mt-3 text-10">{{ template.content }}...</label>
                </li>
              </ul>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-col>

    <v-col cols="12" sm="4">
      <v-card flat>
        <div class="quick--sms--card pl-5 d-flex align-center">
          <label class="card--text">Send Quick SMS Here</label>
        </div>
        <div class="compose--sms mt-5">
          <v-btn class="no-shadow" width="30px" height="30px" fab dark small color="primary">
            <i class="icon-compose"></i>
          </v-btn>
          <label class="ml-3 text-bold compose--text">Compose</label>
          <v-form ref="composeSms">
            <v-text-field class="mt-4" placeholder="Search Contact" background-color="#f2f3fc" hide-details="auto" :required="true" flat append-icon="icon-magnify" solo></v-text-field>

            <v-textarea solo flat class="mt-4" background-color="#f2f3fc" name="input-7-4" hide-details="auto" placeholder="Type your message here" height="345px"></v-textarea>
            <div class="mt-4 d-flex justify-end">
              <v-btn color="primary">
                Send
                <i class="mdi mdi-send ml-2"></i>
              </v-btn>
            </div>
          </v-form>
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { AuthStateType } from '@/store/modules/auth';
import { UserStateType } from '@/store/modules/user';

const auth = namespace('auth');
const user = namespace('user');

@Component({
  name: 'DashboardIndex'
})
export default class DashboardIndex extends Vue {
  @auth.Getter
  getLoggedInUser!: AuthStateType['currentUser'];

  @user.Getter
  getContacts!: UserStateType['contacts'];

  @user.Getter
  getContactGroups!: UserStateType['contactGroups'];

  @user.Getter
  getMessageTemplate!: UserStateType['messageTemplate'];

  @user.Getter
  getMessageHistory!: UserStateType['messageTemplate'];

  get firstname(): string {
    return this.getLoggedInUser ? this.getLoggedInUser.displayName.split(' ')[0] : '';
  }

  get lastMessage(): string | undefined {
    return this.getMessageHistory.data.length < 1 ? 'No Message Sent' : this.getMessageHistory.data[this.getMessageHistory.data.length - 1].content;
  }
}
</script>

<style>
.quick--sms--card {
  background: url(../../assets/images/background/card.svg) !important;
  background-color: var(--secondary);
  background-repeat: no-repeat !important;
  background-size: cover !important;
  height: 110px;
}
.contact--card {
  background-image: url(../../assets/images/background/contact.svg);
  background-position: bottom right;
  background-position-x: 90%;
}
.contact--card .value {
  font-style: normal;
  font-weight: bold;
  font-size: 20px;
  line-height: 20px;
}
.contact--card .value--desc {
  font-style: normal;
  font-weight: normal;
  font-size: 10px;
  line-height: 12px;
}
.history--card {
  background-image: url(../../assets/images/background/history.svg);
  background-position: bottom right;
  background-position-x: 90%;
}
.account--card {
  background-image: url(../../assets/images/background/account.svg);
  background-position: bottom right;
  background-position-x: 90%;
}
.template--card {
  background-image: url(../../assets/images/background/dashboard.svg);
  background-position: bottom right;
  background-position-x: 90%;
  overflow-y: auto !important;
}

.template--card::-webkit-scrollbar {
  width: 5px;
}

/* Handle */
.template--card::-webkit-scrollbar-thumb {
  background: #99b3a7;
  width: 2px !important;
  border-radius: 4px;
}

/* Handle on hover */
.template--card::-webkit-scrollbar-thumb:hover {
  background: #555;
}
.card--text {
  width: 81px !important;
  font-weight: bold;
  font-size: 15px;
  line-height: 18px;
  color: #2b2c34;
}

.dashboard--intro img {
  position: absolute;
  top: 89px;
}

.colored--box {
  background: var(--primary) url(../../assets/images/background/card-abstract.svg) !important;
  height: 46px;
  border-radius: 5px;
  width: 100%;
}

.dashboard--username div {
  font-style: normal;
  font-weight: normal;
  font-size: 13px;
}
.dashboard--username {
  font-style: normal;
  font-weight: bold;
  font-size: 20px;
  line-height: 20px;
}

.app--date {
  font-style: normal;
  font-weight: normal;
  font-size: 10px;
  line-height: 12px;
}

.compose--text {
  font-size: 13px !important;
  line-height: 16px !important;
}

.template--timeline {
  list-style: none;
  border-left: 1px solid #99b3a7;
}

.template--timeline .template {
  line-height: 15px;
}

.template--timeline > .template:before,
.template--timeline > .template:after {
  position: absolute;
  display: block;
  border: none;
}

.template--timeline > .template:before {
  text-align: right;
  font-weight: 100;
  font-size: 0.9em;
  min-width: 120px;
}

.template--timeline > .template:after {
  /* box-shadow: 0#C0DBCF; */
  left: 10px;
  position: absolute !important;
  font-family: 'icomoon' !important;
  padding-top: 5px;
  text-align: center;
  font-size: 10px;
  background: #99b3a7;
  border-radius: 50%;
  height: 26px !important;
  width: 26px !important;
  content: '\e905';
}
</style>
