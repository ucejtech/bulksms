<template>
  <v-form ref="composeSms">
    <v-radio-group
      v-model="model.sendMessage.recipientType"
      @change="clearRecipients"
      hide-details="auto"
      class="mt-3"
      row
    >
      <v-radio label="Contact" value="contact"></v-radio>
      <v-radio label="Contact Group" value="group"></v-radio>
      <v-radio label="Unsaved Number" value="number"></v-radio>
    </v-radio-group>
    <v-autocomplete
      chips
      deletable-chips
      multiple
      solo
      class="mt-4"
      v-model="model.sendMessage.recipients"
      :items="getSearchItem"
      item-text="name"
      label="Search Contact"
      background-color="#f2f3fc"
      hide-details="auto"
      :required="true"
      flat
      append-icon="icon-magnify"
      :rules="rules.recipients"
      return-object
    >
      <!-- <template slot="selection" slot-scope="{ item }">
        {{ item.name }}
      </template> -->
      <template slot="item" slot-scope="{ item }">
        <p v-html="`${item.name}`"></p> </template
    ></v-autocomplete>
    <v-textarea
      solo
      flat
      class="mt-4"
      background-color="#f2f3fc"
      name="input-7-4"
      hide-details="auto"
      placeholder="Type your message here"
      v-model="model.sendMessage.message.content"
      :rules="rules.content"
      height="345px"
      no-resize
    ></v-textarea>
    <div class="mt-4 d-flex justify-end">
      <v-btn color="primary" @click="sendMessage">
        Send
        <i class="mdi mdi-send ml-2"></i>
      </v-btn>
    </div>
  </v-form>
</template>

<script lang="ts">
import FirebaseHelper from '@/services/firebase';
import { Contact, groupType, UserStateType } from '@/store/modules/user';
import {
  Vue, Component, Prop, Watch
} from 'vue-property-decorator';
import { namespace } from 'vuex-class';

const user = namespace('user');

@Component({
  name: 'QuickSMS'
})
export default class QuickSMS extends Vue {
  @Prop({ default: '' })
  presetContent!: string;

  @Prop({ default: () => [] })
  presetRecipient!: groupType[];

  @user.Getter
  getContactGroups!: UserStateType['contactGroups'];

  @user.Getter
  getContacts!: UserStateType['contacts'];

  @Watch('presetContent')
  async changedContent(newValue: string) {
    this.model.sendMessage.message.content = newValue;
  }

  fetchedItems: Contact[] | groupType[] = [];

  sendMessageLoading = false;

  model = {
    sendMessage: {
      recipientType: 'contact',
      recipients: this.presetRecipient,
      message: {
        content: this.presetContent
      }
    }
  };

  rules = {
    recipients: [(v: groupType[] | Contact[]) => v.length > 0 || 'Recipients must be selected'],
    content: [(v: string) => !!v || 'Message Content is needed']
  }

  get getSearchItem() {
    if (this.model.sendMessage.recipientType === 'group') {
      return this.getContactGroups.data;
    }
    return this.getContacts.data;
  }

  clearRecipients() {
    this.model.sendMessage.recipients = [];
  }

  async sendMessage() {
    if ((this.$refs.composeSms as Vue & { validate: () => boolean }).validate()) {
      if (this.model.sendMessage.recipientType === 'group') {
        let recipients: Contact[] = [];
        this.model.sendMessage.recipients.map(async x => {
          const contacts = await FirebaseHelper.getGroupContacts(
            x.id
          );
          recipients = [...contacts];
        });
        this.sendMessageLoading = true;
        this.sendBulkSMS({ ...this.model.sendMessage, recipients })
          .then(() => {
            this.sendMessageLoading = false;
            this.$toast.success('Messages Sent', 'Success', 'topRight');
          })
          .catch(() => {
            this.sendMessageLoading = false;
            this.$toast.error('Messages not Sent', 'Error', 'topRight');
          });
      } else {
        this.sendMessageLoading = true;
        this.sendBulkSMS({ ...this.model.sendMessage })
          .then(() => {
            this.sendMessageLoading = false;
            this.$toast.success('Messages Sent', 'Success', 'topRight');
          })
          .catch(() => {
            this.sendMessageLoading = false;
            this.$toast.error('Messages not Sent', 'Error', 'topRight');
          });
      }
    }
  }

  @user.Action
  private sendBulkSMS!: (sendMessageModel: object) => Promise<void>;
}
</script>

<style lang="scss" scoped>
</style>
