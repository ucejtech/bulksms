<template>
  <div class="text-left mt-4">
    <input
      :type="inputType"
      class="pl-4 mt-2 c-input"
      :placeholder="placeholder ? placeholder : label"
      :required="required"
      v-model="value"
      :autofocus="autofocus"
      @input.stop="$emit('data', value)"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component({
  name: 'InputField'
})
export default class InputField extends Vue {
  @Prop()
  label!: {
    type: string;
    required: true;
  };

  @Prop()
  placeholder!: {
    type: string;
    required: false;
  };

  @Prop()
  required!: {
    type: boolean;
    required: true;
  };

  @Prop({ default: false })
  autofocus!: {
    type: boolean;
  };

  @Prop()
  inputType!: {
    type: string;
    required: true;
  };

  private value = '';

  get hasData() {
    return !!this.value;
  }
}
</script>

<style lang="scss" scoped>
.input-label {
  font-size: 16px !important;
  color: #747474;
}
.c-input {
  background: #f2f3fc;
  border-radius: 5px;
  border: none;
  box-sizing: border-box;
  border-radius: 8px;
  width: 100%;
  height: 45px;
}
.c-input::placeholder {
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 15px;
}
.c-input:hover,
.c-input:focus {
  border: 1px solid #6246EA;
  outline: none;
}
</style>
