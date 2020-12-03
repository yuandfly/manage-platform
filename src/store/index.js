import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    formEdit: false,
    insertModule:false
  },
  mutations: {
    changeEdit(state, type) {
      state.formEdit = type
    }, 
    changeInsertModule(state, type) {
      state.insertModule = type
    }
  }
})
