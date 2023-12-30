<template>
  <div class="login">
    <form @submit.prevent="submit" class="login-form">
      <h1 class="login-title">Login</h1>
      <input
        v-model="email"
        placeholder="Email"
        type="text"
        class="login-input"
      />
      <input
        v-model="password"
        placeholder="Password"
        type="password"
        class="login-input"
      />
      <button class="login-btn">Submit</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import API from "@/api";
import { useStore } from "@/store";
import { useRouter } from "vue-router";

const { setUser, setRequest } = useStore();
const router = useRouter();

const email = ref("avainer@gmail.com");
const password = ref("qwerty");

const submit = () => {
  API.login(email.value, password.value).then((data) => {
    if (data) {
      setUser(data);
      router.push("/chat");
    }
  });
};
</script>

<style lang="scss" scoped>
.login {
  width: 300px;
  background: #fff;
  border-radius: 15px;
  padding: 30px;

  &-form {
  }

  &-title {
    text-align: center;
    font-size: 24px;
    margin-bottom: 15px;
  }

  &-input {
    display: block;
    width: 100%;
    padding: 10px;
    margin-bottom: 15px;
    border-radius: 5px;
  }

  &-btn {
    display: block;
    width: 100%;
    padding: 10px;
  }
}
</style>
