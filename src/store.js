import { defineStore } from "pinia";
export const useStore = defineStore("store", {
  state: () => {
    return {
      user: null,
      request: null,
    };
  },
  actions: {
    setUser(user) {
      this.user = user;
    },
    setRequest(request) {
      this.request = request;
    },
  },
});
