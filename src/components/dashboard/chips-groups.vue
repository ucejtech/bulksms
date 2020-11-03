<template>
  <div class="chip--group px-2 d-flex flex-wrap align-center">
    <div v-if="chipData.length > splitAt" class="my-1 d-flex flex-wrap">
      <div class="chip mr-1 py-2 px-1 text-10" v-for="(data, index) in splitAt" :key="index">{{ chipData[index] }}</div>
    </div>
    <div class="my-1 d-flex flex-wrap" v-else>
      <div class="chip mr-1 py-2 px-1 text-10" v-for="(data, index) in chipData" :key="index">{{ data }}</div>
    </div>
    <div class="my-1 chip mr-1 py-2 px-1 text-10" v-if="chipData.length > splitAt">+{{ chipData.length - splitAt }}</div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component({
  name: 'chip-group'
})
export default class ChipsGroup extends Vue {
  @Prop()
  chipData!: {
    type: Array<number>;
    required: true;
  };

  @Prop({ default: 5 })
  splitAt!: {
    type: number;
    required: false;
  };
}
</script>

<style scoped>
.chip {
  background: var(--secondary);
  border-radius: 3px;
}
</style>
