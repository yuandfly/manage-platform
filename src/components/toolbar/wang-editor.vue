<template>
  <div id="wangeditor">
    <div ref="editorElem" style="text-align:left;"></div>
  </div>
</template>

<script>
import E from 'wangeditor'
export default {
  name: 'WangEditor',
  data() {
    return {
      editor: null,
      editorContent: ''
    }
  },
  props: {
    catchData: {
      type: String,
      default: ''
    }
  },
  mounted() {
    this.init()
    /* 反选值 */
    this.editor.txt.html(this.catchData)
  },
  methods: {
    /* 初始化 */
    init() {
      this.editor = new E(this.$refs.editorElem)
      // 编辑器的事件，每次改变会获取其html内容
      this.editor.customConfig.onchange = html => {
        this.editorContent = html
        // 把这个html通过htmlData的方法传入父组件
        this.$emit('htmlData', this.editorContent)
      }
      this.editor.customConfig.menus = [
        // 菜单配置
        'head', // 标题
        'bold', // 粗体
        'fontSize', // 字号
        'fontName', // 字体
        'italic', // 斜体
        'underline', // 下划线
        'strikeThrough', // 删除线
        'foreColor', // 文字颜色
        'backColor', // 背景颜色
        'link', // 插入链接
        'list', // 列表
        'justify', // 对齐方式
        'quote', // 引用
        'emoticon', // 表情
        'image', // 插入图片
        'table', // 表格
        'code', // 插入代码
        'undo', // 撤销
        'redo' // 重复
      ]
      this.editor.create() // 创建富文本实例
    }
  }
}
</script>

<style scoped></style>
