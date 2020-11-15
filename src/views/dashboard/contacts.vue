<template>
  <div class="mt-5">
    <v-row>
      <v-col cols="12" md="3">
        <v-text-field
          placeholder="Search Contact"
          background-color="#f2f3fc"
          hide-details="auto"
          :required="true"
          flat
          append-icon="icon-magnify"
          solo
        ></v-text-field>
        <div class="contact--display--groups mt-6 pa-4">
          <div class="selections d-flex justify-space-between align-center">
            <v-checkbox
              v-model="checkbox.messageRecipient"
              value="all"
              label="All"
              hide-details
              required
            ></v-checkbox>
            <span>1250</span>
          </div>
          <div
            class="selections d-flex justify-space-between align-center mt-3"
            v-for="(group, index) in getContactGroups.data"
            :key="index"
          >
            <v-checkbox
              v-model="checkbox.messageRecipient"
              :label="group.name"
              :value="group.id"
              hide-details
              required
            ></v-checkbox>
            <span>30</span>
          </div>
        </div>
        <div class="mt-6 pt-3 pr-3 import--csv text-12">
          <div class="ml-4">Import Contacts</div>
          <div class="mt-4 d-flex">
            <img src="@/assets/images/illustrations/hand-right.svg" alt="" />
            <div
              class="d-flex justify-center align-end full-width flex-column text-center"
            >
              <img class="mb-3" src="@/assets/images/icons/json.svg" alt="" />
              Supported Files
            </div>
          </div>
        </div>
        <v-btn
          class="mt-6"
          color="primary"
          height="46"
          @click="importContactDialog = !importContactDialog"
          block
          >Import Contacts</v-btn
        >
      </v-col>
      <v-col cols="12" md="7">
        <div
          class="colored--accent--box contact--list d-flex align-center pl-3 mb-4"
        >
          <v-checkbox
            v-model="checkbox.all"
            :value="checkbox.messageRecipient === 'all'"
            label="#"
            hide-details
            required
          ></v-checkbox>
          <span class="ml-7">Phone Numbers</span>
        </div>

        <div
          class="d-flex align-center full-width full-height justify-center"
          v-if="getContacts.data.length < 1"
        >
          <div class="text-center mb-4">
            <img
              class="mb-4"
              src="@/assets/images/illustrations/contacts_search.svg"
              alt="no contact image"
              width="300px"
            /><br />No Contact Available
          </div>
        </div>
        <div
          class="mt-2 contact--display--list d-flex align-center pl-3"
          v-for="(contact, index) in getContacts.data"
          :key="index"
          v-else
        >
          <v-checkbox
            v-model="model.sendMessage.recipients"
            :label="`${index + 1}`"
            :value="contact"
            hide-details
            required
          ></v-checkbox>
          <span
            class="ml-3 d-flex justify-space-between align-center full-width pa-2"
          >
            <div class="text-13 d-flex align-center justify-space-between">
              <v-btn
                class="mx-2 no-shadow"
                width="30px"
                height="30px"
                fab
                dark
                small
                color="rgba(228, 88, 88, 0.2)"
              >
                <v-icon color="#000" size="15">mdi-account-outline</v-icon>
              </v-btn>
              <div>
                <span> {{ contact.name }}</span>
                <span class="ml-4">{{ contact.phoneNumber }}</span>
              </div>
            </div>
            <div class="delete">
              <i class="icon-bin"></i>
            </div>
          </span>
        </div>
      </v-col>
      <v-col cols="12" md="2">
        <v-btn
          color="primary"
          height="46"
          @click="sendMessageDialog = !sendMessageDialog"
          block
          >Send Message</v-btn
        >
      </v-col>
    </v-row>
    <v-dialog v-model="importContactDialog" width="500px">
      <v-card class="mx-auto pa-6 text-center">
        <div class="d-flex justify-space-between">
          <div>
            <v-btn class="no-shadow" color="primary" height="33" width="33" fab
              ><i class="icon-upload"></i
            ></v-btn>
            <label for="Import Contact" class="ml-4 text-13"
              >Import Contact</label
            >
          </div>
          <v-btn
            class="no-shadow"
            height="33"
            width="33"
            @click="importContactDialog = !importContactDialog"
            color="transparent"
            fab
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>
        <v-text-field
          class="mt-9"
          placeholder="Group Name (Optional)"
          background-color="#f2f3fc"
          v-model="model.contactImport.group.name"
          hide-details="auto"
          :required="true"
          flat
          solo
        ></v-text-field>
        <label for="importContact" class="mt-5 input d-flex align-center"
          >Choose file</label
        >
        <chips-group
          class="mt-5"
          v-if="importJsonParsed"
          :chipData="model.contactImport.importedJson.map((x) => x.phoneNumber)"
        ></chips-group>
        <input
          type="file"
          id="importContact"
          class="visibility-hidden"
          @change="handleFilechanged"
          accept=".json"
        />
        <v-btn
          class="mt-6"
          color="primary"
          height="46"
          @click="importContacts"
          :loading="addContactLoading"
          >Import Contacts</v-btn
        >
      </v-card>
    </v-dialog>
    <v-dialog v-model="sendMessageDialog" width="500px">
      <v-card class="mx-auto pa-6 text-center">
        <div class="d-flex justify-space-between">
          <div>
            <v-btn class="no-shadow" color="primary" height="33" width="33" fab
              ><i class="icon-edit"></i
            ></v-btn>
            <label for="Import Contact" class="ml-4 text-13">Compose</label>
          </div>
          <v-btn
            class="no-shadow"
            height="33"
            width="33"
            @click="sendMessageDialog = !sendMessageDialog"
            color="transparent"
            fab
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>
        <v-form ref="sendMessageForm">
          <chips-group
            class="mt-9"
            v-if="model.sendMessage.recipients.length > 0"
            :chipData="model.sendMessage.recipients.map((x) => x.phoneNumber)"
          ></chips-group>
          <v-text-field
            class="mt-4"
            placeholder="Title"
            background-color="#f2f3fc"
            v-model="model.sendMessage.message.title"
            hide-details="auto"
            :required="true"
            flat
            solo
          ></v-text-field>
          <v-textarea
            solo
            flat
            class="mt-4"
            background-color="#f2f3fc"
            name="input-7-4"
            :rules="rules.content"
            v-model="model.sendMessage.message.content"
            hide-details="auto"
            placeholder="Type your message here"
            height="320px"
          ></v-textarea>
          <div class="full-width d-flex justify-space-between align-center">
            <v-btn
              class="mt-6"
              color="primary"
              height="46"
              @click="sendMessage"
              :loading="sendMessageLoading"
              >Send Message</v-btn
            >
            <v-checkbox
              v-model="model.sendMessage.saveAsTemplate"
              label="Save as template"
              hide-details
              required
            ></v-checkbox>
          </div>
        </v-form>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { AuthStateType } from '@/store/modules/auth';
import jsonReader from '@/utils/jsonReader';
import { UserStateType } from '@/store/modules/user';
import uuid from '@/utils/uuid';
import ChipsGroup from '../../components/dashboard/chips-groups.vue';
import FirebaseHelper from '../../services/firebase';

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
  name: 'Contacts',
  components: {
    ChipsGroup
  }
})
export default class Contacts extends Vue {
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
    messageRecipient: ''
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

  @user.Getter
  getContactGroups!: UserStateType['contactGroups'];

  @Watch('checkbox', { deep: true })
  async onMessageRecipientCheckBox(val: { messageRecipient: string }) {
    if (val.messageRecipient) {
      if (val.messageRecipient === 'all') {
        this.model.sendMessage.recipients = this.getContacts.data;
      } else {
        this.model.sendMessage.recipients = await FirebaseHelper.getGroupContacts(
          val.messageRecipient
        );
      }
    } else {
      this.model.sendMessage.recipients = [];
    }
  }

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
      jsonReader(e.target.files[0]).then(
        (jsonResult: UserStateType['contacts']['data']) => {
          this.model.contactImport.importedJson = jsonResult;
          this.importJsonParsed = true;
        }
      );
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
    if ((this.$refs.sendMessageForm as Vue & { validate: () => boolean }).validate()) {
      if (!this.model.sendMessage.message.title && this.model.sendMessage.saveAsTemplate) {
        this.$toast.error('Message Title needed for templates', 'Error', 'topRight');
        return;
      }
      if (this.model.sendMessage.recipients.length < 1) {
        this.$toast.error('Message recipients needed', 'Error', 'topRight');
        return;
      }
      this.sendMessageLoading = true;
      this.sendBulkSMS(this.model.sendMessage)
        .then(() => {
          this.sendMessageLoading = false;
          this.$toast.success('Messages Sent', 'Success', 'topRight');
          this.sendMessageDialog = false;
        })
        .catch(() => {
          this.sendMessageLoading = false;
          this.$toast.error('Messages not Sent', 'Error', 'topRight');
        });
      this.sendMessageLoading = false;
    }
  }

  @user.Action
  private addContacts!: (
    contacts: Model['contactImport']['importedJson']
  ) => Promise<void>;

  @user.Action
  private addGroup!: ({
    group,
    importedJson
  }: Model['contactImport']) => Promise<void>;

  @user.Action
  private sendBulkSMS!: (sendMessageModel: object) => Promise<void>;
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
  margin-top: -16%;
}
.contact--display--groups {
  background: var(--accent) !important;
  border-radius: 5px;
}
.v-input--selection-controls .v-input__slot .v-label {
  font-style: normal;
  font-weight: normal;
  font-size: 12px !important;
  line-height: 15px !important;
  color: #000000;
}
.contact--display--groups .selections {
  font-size: 10px;
}
input[type="file"] {
  width: 0 !important;
  height: 0 !important;
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
.contact--display--list:hover {
  background: var(--accent);
  cursor: pointer;
}
.contact--display--list:hover .delete {
  visibility: visible;
}
.contact--display--list .delete {
  visibility: hidden;
}
.icon-upload::before {
  font-size: 40px;
}
</style>
