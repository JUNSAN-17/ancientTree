import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  state: () => ({
    isCollapse: false,
    username: '',
  }),

  // getters:{
  // },

  actions: {
    updateCollapse() {
      this.isCollapse = !this.isCollapse
    },
    // 更新用户名
    setUsername(newUsername) {
      this.username = newUsername
    },
  }
})
