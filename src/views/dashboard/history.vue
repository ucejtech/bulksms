<template>
  <div class="mt-5">
    <v-row>
      <v-col cols="12">
        <div
          class="colored--accent--box contact--list d-flex align-center pl-3 mb-4"
        >
          <span class="text-13">#</span>
          <span class="ml-7">History</span>
        </div>
        <h3 v-if="getMessageHistory.loading" class="text-center text--accent">
          Fetching ...
        </h3>
        <div v-else>
          <div
            class="d-flex align-center full-width full-height justify-center"
            v-if="getMessageHistory.data.length < 1"
          >
            <div class="text-center mb-4">
              <img
                class="mb-4"
                src="@/assets/images/illustrations/contacts_search.svg"
                alt="no contact image"
                width="300px"
              /><br />No History Available
            </div>
          </div>
          <!-- <div class="mt-2 contact--display--list d-flex align-center pl-3" v-for="(message, index) in getMessageHistory.data" :key="index" v-else> -->
          <div
            class="mt-2 contact--display--list d-flex align-center pl-3"
            v-for="(message, index) in getMessageHistory.data"
            :key="index"
            v-else
          >
            <!-- <v-checkbox v-model="model.createTemplate.recipients" :label="`${index + 1}`" :value="contact" hide-details required></v-checkbox> -->
            <span class="text-13">{{ index + 1 }}</span>
            <span
              class="ml-3 d-flex justify-space-between align-center full-width pa-2"
            >
              <div
                class="text-13 d-flex align-center justify-space-between message-content"
              >
                <v-btn
                  class="mx-2 no-shadow"
                  width="30px"
                  height="30px"
                  fab
                  dark
                  small
                  color="rgba(228, 88, 88, 0.2)"
                >
                  <v-icon color="#000" size="15">icon-message</v-icon>
                </v-btn>
                <div class="ml-3">
                  <span class="text-bold"> {{ message.title }}</span>
                  <div>{{ message.content.slice(0, 200) }}</div>
                  <span class="text-12 text-primary">Sent to {{ message.recipients.length }} Contact(s) at Cost <h4>NGN {{ message.recipients.length * price }}</h4></span>
                  <div class="ml-2 dot" />
                  <div class="ml-2 text-12 d-inline">{{readDate(message.date)}}</div>
                </div>
              </div>
              <!-- <div class="ml-9">
                <v-btn color="primary" depressed>Use</v-btn>
              </div> -->
            </span>
          </div>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { AuthStateType } from '@/store/modules/auth';
import Dates from '@/utils/dates';

import { UserStateType } from '@/store/modules/user';
import ChipsGroup from '../../components/dashboard/chips-groups.vue';

// const pricePerSMS = 5;

interface Model {
  contactImport: {
    group: {
      name: string;
      id: string;
    };
    importedJson: UserStateType['contacts']['data'];
  };
  sendMessage: {
    recipients: Model['contactImport']['importedJson'];
    message: {
      title: string;
      content: string;
    };
    saveAsTemplate: boolean;
  };
}

const auth = namespace('auth');
const user = namespace('user');

@Component({
  name: 'History',
  components: {
    ChipsGroup
  }
})
export default class History extends Vue {
  price = 5;

  model: Model = {
    contactImport: {
      group: {
        name: '',
        id: ''
      },
      importedJson: []
    },
    sendMessage: {
      recipients: [],
      message: {
        title: '',
        content: ''
      },
      saveAsTemplate: false
    }
  };

  rules = {
    content: [(v: string) => !!v || 'Message Content is needed']
  };

  checkbox = {
    all: false,
    groups: false
  };

  addContactLoading = false;

  sendMessageLoading = false;

  importJsonParsed = false;

  importContactDialog = false;

  sendMessageDialog = false;

  @auth.Getter
  getLoggedInUser!: AuthStateType['currentUser'];

  @user.Getter
  getMessageHistory!: UserStateType['messageTemplate'];

  get firstname(): string {
    if (this.getLoggedInUser && this.getLoggedInUser.name) {
      return this.getLoggedInUser.name.split(' ')[0];
    }
    return '';
  }

  // eslint-disable-next-line class-methods-use-this
  readDate(dateString: string) {
    return Dates.readableDate(dateString);
  }

  sendMessage() {
    this.sendMessageLoading = true;
    this.sendBulkSMS(this.model.sendMessage)
      .then(() => {
        this.sendMessageLoading = false;
        this.$toast.success('Messages Sent', 'Success', 'topRight');
        this.sendMessageDialog = false;
      })
      .catch(() => {
        this.sendMessageLoading = false;
        this.$toast.success('Messages not Sent', 'Error', 'topRight');
      });
    this.sendMessageLoading = false;
  }

  @user.Action
  private sendBulkSMS!: (sendMessageModel: object) => Promise<void>;
}
</script>

<style>
.dot {
  height: 4px !important;
  width: 4px !important;
  border-radius: 50%;
  display: inline-block;
  /* border: 1px solid blue; */
  background: var(--primary) !important;
}
</style>
