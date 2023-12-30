<template>
  <section class="msger">
    <header class="msger-header">
      <div class="msger-header-title">
        <i class="fas fa-comment-alt"></i>
        <span>Служба Поддержки</span>
      </div>
      <div class="msger-header-options">
        <span><i class="fas fa-cog"></i></span>
      </div>
    </header>

    <main class="msger-chat" ref="chatArea">
      <div class="msg">
        <div class="msg-bubble">
          <div class="msg-info">
            <div class="msg-info-name">BOT</div>
          </div>

          <div class="msg-text">
            Добро пожаловать в Службу Поддержки. Пожалуйста, напишите ваш
            вопрос.
          </div>
        </div>
      </div>

      <template v-if="request">
        <div
          class="msg"
          :class="[msg.userFrom.id === user.id ? 'right-msg' : 'left-msg']"
          v-for="msg in request.messages"
          :key="msg.id"
        >
          <div class="msg-bubble">
            <div class="msg-info">
              <div class="msg-info-name">{{ msg.userFrom.username }}</div>
              <div class="msg-info-time">{{ formatDate(msg.createdAt) }}</div>
            </div>

            <div class="msg-text" v-if="msg.text">{{ msg.text }}</div>
            <div v-else>
              <img
                v-if="msg.file.mime.includes('image')"
                :src="url + msg.file.url"
                alt=""
                class="image"
              />
              <a
                :href="url + msg.file.url"
                target="_blank"
                download
                class="file"
                v-else
              >
                <img src="/file.png" alt="" />
                <span>{{ msg.file.name }}</span>
              </a>
            </div>
          </div>
        </div>
      </template>
    </main>

    <form class="msger-inputarea" @submit.prevent="submit">
      <input
        type="text"
        class="msger-input"
        placeholder="Enter your message..."
        v-model="text"
      />
      <button type="submit" class="msger-send-btn">Send</button>
    </form>
  </section>
</template>

<script setup>
import API from "@/api";
import { useStore } from "@/store";
import { storeToRefs } from "pinia";
import { io } from "socket.io-client";
import { nextTick, onMounted, ref, watch } from "vue";

const store = useStore();
const { setRequest } = store;
const { user, request } = storeToRefs(store);

const url = "https://thoughtful-beauty-e454f50ff1.strapiapp.com";

const socket = io("wss://thoughtful-beauty-e454f50ff1.strapiapp.com", {
  query: {
    jwt: API.getToken(),
  },
});

const text = ref("");
const chatArea = ref(null);

socket.on("newMessage", () => {
  handleRequestUpdate();
});

const submit = () => {
  if (!text.value) return;

  if (!request.value) {
    socket.emit("join", { message: text.value });
  } else {
    socket.emit("message", {
      text: text.value,
    });
  }

  text.value = "";
};

const formatDate = (str) => {
  return new Date(str).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const handleRequestUpdate = () => {
  return API.fetchActiveRequest().then((request) => {
    setRequest(request);
  });
};

onMounted(() => {
  handleRequestUpdate().then(() => {
    if (request.value) {
      socket.emit("join");
    }
  });
});

watch(request, () => {
  nextTick().then(() => {
    chatArea.value.scrollTop = chatArea.value.scrollHeight;
  });
});
</script>

<style lang="scss">
.file {
  display: flex;
  align-items: center;
  gap: 10px;

  color: #000;

  & img {
    width: 30px;
    height: 30px;
    object-fit: contain;
    display: block;
  }
}
</style>
