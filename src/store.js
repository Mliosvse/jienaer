import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    shadeLoading:false,
    loadingType:1,
  },
  getters :{   //实时监听state值的变化(最新状态)
    isShadeShow(state) {
      return state.shadeLoading
    }
  },
  mutations: {
    showShadeLoading(state){
      state.shadeLoading = true;
    },
    hideShadeLoading(state){
      state.shadeLoading = false;
    },
    setLoadingType(state,type){
      state.loadingType = type;
    }
  },
  actions: {

  }
})
