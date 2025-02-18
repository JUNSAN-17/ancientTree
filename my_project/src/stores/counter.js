import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  state: () => ({
    isCollapse: false,
  }),

  // getters:{
  // },

  actions: {
    updateCollapse(){
      this.isCollapse =!this.isCollapse
    },
  }
})
