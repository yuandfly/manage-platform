<template>
  <div class="input">
    <input
      :type="inputType"
      class="inputstyle"
      :placeholder="placeholder"
      @input="inputChanged($event)"
    />
  </div>
</template>

<script>
export default {
  props: ["placeholder", "inputType"],
  data() {
    return {
      inputType: "1"
    };
  },
  methods: {
    inputChanged: function($event) {
      console.log(1);
      this.$emit("inputChanged", $event); //将值放在自定义的事件函数中作为参数
    }
  }
};
</script>
