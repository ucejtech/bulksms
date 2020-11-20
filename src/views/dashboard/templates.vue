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
        <div class="mt-6 pt-3 pr-3 import--csv text-12">
          <div class="ml-4">Create Template</div>
          <div class="mt-4 d-flex">
            <img
              src="@/assets/images/illustrations/hand-thumbs-up.svg"
              alt=""
            />
            <div
              class="d-flex justify-center align-end full-width flex-column text-center"
            >
              You can create reusable messae template
            </div>
          </div>
        </div>
        <v-btn
          class="mt-6"
          color="primary"
          height="46"
          @click="createTemplateDialog = !createTemplateDialog"
          block
          >Create</v-btn
        >
      </v-col>
      <v-col cols="12" md="9">
        <div
          class="colored--accent--box contact--list d-flex align-center pl-3 mb-4"
        >
          <!-- <v-checkbox v-model="checkbox.all" :value="checkbox" label="#" hide-details required></v-checkbox> -->
          <span>#</span>
          <span class="ml-7">Templates</span>
        </div>

        <div
          v-if="getMessageTemplate.data.length < 1"
          class="d-flex align-center full-width full-height justify-center"
        >
          <div class="text-center mb-4">
            <img
              class="mb-4"
              src="@/assets/images/illustrations/contacts_search.svg"
              alt="no contact image"
              width="300px"
            /><br />No Template Available
          </div>
        </div>
        <div v-else>
          <div
            class="mt-2 contact--display--list d-flex align-center pl-3"
            v-for="(template, index) in getMessageTemplate.data"
            :key="index"
          >
            <!-- <v-checkbox v-model="model.createTemplate.recipients" :label="`${index + 1}`" :value="contact" hide-details required></v-checkbox> -->
            <span class="text-13">{{ index + 1 }}</span>
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
                  <v-icon color="#000" size="15">icon-disk</v-icon>
                </v-btn>
                <div class="ml-3">
                  <span class="text-bold"> {{ template.title }}</span>
                  <div>{{ template.content.slice(0, 200) }}</div>
                </div>
              </div>
              <div class="ml-9">
                <v-btn color="primary" @click="openSendMessageDialog(index)" depressed>Use</v-btn>
              </div>
            </span>
          </div>
        </div>
      </v-col>
    </v-row>
    <v-dialog v-model="createTemplateDialog" width="500px">
      <v-card class="mx-auto pa-6 text-center">
        <div class="d-flex justify-space-between">
          <div>
            <v-btn class="no-shadow" color="primary" height="33" width="33" fab
              ><i class="icon-edit"></i
            ></v-btn>
            <label for="Import Contact" class="ml-4 text-13"
              >Create Template</label
            >
          </div>
          <v-btn
            class="no-shadow"
            height="33"
            width="33"
            @click="createTemplateDialog = !createTemplateDialog"
            color="transparent"
            fab
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>
        <v-form ref="createTemplateForm">
          <v-text-field
            class="mt-4"
            placeholder="Title"
            background-color="#f2f3fc"
            v-model="model.createTemplate.title"
            :rules="rules.title"
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
            v-model="model.createTemplate.content"
            hide-details="auto"
            placeholder="Type your template content"
            no-resize
            height="320px"
          >
          </v-textarea>
        </v-form>

        <div class="full-width d-flex justify-space-around align-center">
          <v-btn
            class="mt-6"
            color="primary"
            height="46"
            @click="createTemplate"
            :loading="createTemplateLoading"
            >Create Template</v-btn
          >
        </div>
      </v-card>
    </v-dialog>
    <v-dialog v-model="sendMessageDialog" width="500px">
      <v-card class="mx-auto pa-6 text-center">
        <div class="d-flex justify-space-between">
          <div>
            <v-btn class="no-shadow" color="primary" height="33" width="33" fab
              ><i class="icon-edit"></i
            ></v-btn>
            <label for="Import Contact" class="ml-4 text-13"
              >Create Template</label
            >
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
        <quick-sms :presetContent="presetValues.content" />
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { AuthStateType } from '@/store/modules/auth';
import { UserStateType } from '@/store/modules/user';
import ChipsGroup from '../../components/dashboard/chips-groups.vue';
import QuickSMS from '../../components/dashboard/quick-sms.vue';

interface Model {
  contactImport: {
    group: {
      name: string;
      id: string;
    };
    importedJson: UserStateType['contacts']['data'];
  };
  createTemplate: {
    title: string;
    content: string;
  };
}

const auth = namespace('auth');
const user = namespace('user');

@Component({
  name: 'Templates',
  components: {
    ChipsGroup,
    'quick-sms': QuickSMS
  }
})
export default class Templates extends Vue {
  sendMessageDialog = false

  presetValues = {
    content: ''
  }

  model: Model = {
    contactImport: {
      group: {
        name: '',
        id: ''
      },
      importedJson: []
    },
    createTemplate: {
      title: '',
      content: ''
    }
  };

  rules = {
    content: [(v: string) => !!v || 'Template Content is needed'],
    title: [(v: string) => !!v || 'Template title is needed']
  };

  checkbox = {
    all: false,
    groups: false
  };

  addContactLoading = false;

  createTemplateLoading = false;

  importJsonParsed = false;

  createTemplateDialog = false;

  @auth.Getter
  getLoggedInUser!: AuthStateType['currentUser'];

  @user.Getter
  getMessageTemplate!: UserStateType['messageTemplate'];

  get firstname(): string {
    if (this.getLoggedInUser && this.getLoggedInUser.name) {
      return this.getLoggedInUser.name.split(' ')[0];
    }
    return '';
  }

  createTemplate() {
    if (
      (this.$refs.createTemplateForm as Vue & {
        validate: () => boolean;
      }).validate()
    ) {
      this.createTemplateLoading = true;
      this.addTemplate(this.model.createTemplate)
        .then(() => {
          this.createTemplateLoading = false;
          this.$toast.success('Template created', 'Success', 'topRight');
          this.createTemplateDialog = false;
        })
        .catch(() => {
          this.createTemplateLoading = false;
          this.$toast.success('Template not created', 'Error', 'topRight');
        });
    }
  }

  openSendMessageDialog(index: number) {
    this.presetValues.content = '';
    const selectedTemplate = this.getMessageTemplate.data[index];
    this.presetValues.content = selectedTemplate.content ? selectedTemplate.content : '';
    this.sendMessageDialog = !this.sendMessageDialog;
  }

  @user.Action
  private addTemplate!: (createTemplateModel: object) => Promise<void>;
}
</script>
