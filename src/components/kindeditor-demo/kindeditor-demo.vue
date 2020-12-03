<template>
  <section>
    <editor
      id="editor_id"
      height="100%"
      width="700px"
      :content.sync="editorText"
      :afterChange="afterChange()"
      pluginsPath="../../../static/kindeditor/plugins/"
      :loadStyleMode="false"
      @on-content-change="onContentChange"
    ></editor>
  </section>
</template>
<script>
export default {
  data() {
    return {
      editorText: '', // 双向同步的变量
      editorTextCopy: '' // content-change 事件回掉改变的对象
    }
  },
  methods: {
    onContentChange(val) {
      this.editorTextCopy = val
      this.addForm.projectContent = this.editorTextCopy
      console.log(this.editorTextCopy)
    },
    afterChange() {}
  }
}
</script>
