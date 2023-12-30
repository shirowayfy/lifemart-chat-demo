import axios from "axios";
import { useStore } from "./store";
import { TOKEN_NAME } from "../constants";

class Storage {
  static set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }
  static get(key) {
    return JSON.parse(localStorage.getItem(key));
  }
}

const instance = axios.create({
  baseURL: "https://thoughtful-beauty-e454f50ff1.strapiapp.com/api",
});

export default class API {
  static async login(identifier, password) {
    return await instance
      .post("/auth/local", {
        identifier,
        password,
      })
      .then((res) => {
        Storage.set(TOKEN_NAME, res.data.jwt);
        return res.data.user;
      })
      .catch((err) => {
        console.log(err);
        return null;
      });
  }

  static getToken() {
    return Storage.get(TOKEN_NAME);
  }

  static async fetchActiveRequest() {
    const { user } = useStore();
    console.log(user);
    const response = await instance.get(
      `/requests?filters[status]=active&filters[userFrom]=${user.id}&populate[0]=messages.userFrom&populate[1]=messages.file`,
      {
        headers: {
          Authorization: `Bearer ${API.getToken()}`,
        },
      }
    );
    console.log(response);
    return response.data.data[0];
  }
}
