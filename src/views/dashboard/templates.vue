<template>
  <div class="mt-5">
    <v-row>
      <v-col cols="12" md="3">
        <v-text-field placeholder="Search Contact" background-color="#f2f3fc" hide-details="auto" :required="true" flat append-icon="icon-magnify" solo></v-text-field>
        <div class="mt-6 pt-3 pr-3 import--csv text-12">
          <div class="ml-4">Create Template</div>
          <div class="mt-4 d-flex">
            <img src="@/assets/images/illustrations/hand-thumbs-up.svg" alt="" />
            <div class="d-flex justify-center align-end full-width flex-column text-center">
              You can create reusable messae template
            </div>
          </div>
        </div>
        <v-btn class="mt-6" color="primary" height="46" @click="importContactDialog = !importContactDialog" block>Create</v-btn>
      </v-col>
      <v-col cols="12" md="9">
        <div class="colored--accent--box contact--list d-flex align-center pl-3 mb-4">
          <v-checkbox v-model="checkbox.all" :value="checkbox" label="#" hide-details required></v-checkbox>
          <span class="ml-7">Templates</span>
        </div>

        <div class="d-flex align-center full-width full-height justify-center" v-if="true">
          <div class="text-center mb-4"><img class="mb-4" src="@/assets/images/illustrations/contacts_search.svg" alt="no contact image" width="300px" /><br />No Template Available</div>
        </div>
        <div class="mt-2 contact--display--list d-flex align-center pl-3" v-for="(contact, index) in getContacts.data" :key="index" v-else>
          <v-checkbox v-model="model.sendMessage.recipients" :label="`${index + 1}`" :value="contact" hide-details required></v-checkbox>
          <span class="ml-3 d-flex justify-space-between align-center full-width pa-2">
            <div class="text-13 d-flex align-center justify-space-between">
              <v-btn class="mx-2 no-shadow" width="30px" height="30px" fab dark small color="rgba(228, 88, 88, 0.2)">
                <v-icon color="#000" size="15">mdi-account-outline</v-icon>
              </v-btn>
              <div>
                <span> {{ contact.name }}</span>
                <span class="ml-4"> {{ contact.phoneNumber }}</span>
              </div>
            </div>
            <div class="delete">
              <i class="icon-bin"></i>
            </div>
          </span>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { AuthStateType } from '@/store/modules/auth';
import jsonReader from '@/utils/jsonReader';
import { UserStateType } from '@/store/modules/user';
import uuid from '@/utils/uuid';
import ChipsGroup from '../../components/dashboard/chips-groups.vue';

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
  name: 'Templates',
  components: {
    ChipsGroup
  }
})
export default class Templates extends Vue {
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
  getContacts!: UserStateType['contacts'];

  get firstname(): string {
    if (this.getLoggedInUser && this.getLoggedInUser.name) {
      return this.getLoggedInUser.name.split(' ')[0];
    }
    return '';
  }

  handleFilechanged(e: Event & { target: { files: FileList } }) {
    this.model.contactImport.importedJson = [];
    this.importJsonParsed = false;
    if (e.target.files.length > 0) {
      jsonReader(e.target.files[0]).then((jsonResult: UserStateType['contacts']['data']) => {
        this.model.contactImport.importedJson = jsonResult;
        this.importJsonParsed = true;
      });
    } else {
      this.model.contactImport.importedJson = [];
      this.importJsonParsed = false;
    }
  }

  importContacts() {
    const { group } = this.model.contactImport;
    const { importedJson } = this.model.contactImport;

    if (importedJson.length < 1) {
      return this.$toast.error('No Contact Selected', 'Error', 'topRight');
    }

    this.addContactLoading = true;
    if (group.name) {
      this.model.contactImport.group.id = uuid();
      this.addGroup({ group, importedJson })
        .then(() => {
          this.$toast.success('Contacts Group Added', 'Success', 'topRight');
        })
        .catch(err => {
          console.log(err);
          this.$toast.error(err, 'Error', 'topRight');
        });
    }

    this.addContacts(importedJson)
      .then(() => {
        this.$toast.success('Contacts Added', 'Success', 'topRight');
        this.addContactLoading = false;
        this.importContactDialog = false;
      })
      .catch(err => {
        this.$toast.error(err, 'Error', 'topRight');
        this.addContactLoading = false;
      });

    return true;
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
  private addContacts!: (contacts: Model['contactImport']['importedJson']) => Promise<void>;

  @user.Action
  private addGroup!: ({ group, importedJson }: Model['contactImport']) => Promise<void>;

  @user.Action
  private sendBulkSMS!: (sendMessageModel: object) => Promise<void>;
}
</script>
