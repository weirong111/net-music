import axios from "axios";
import { message } from "antd";
export const BASE_URL = "http://124.222.27.209:3001";
interface ReturnData<T = any> {
  code: number;
  data: T;
  cookie?: string;
  message?: string;
  [key: string]: any;
}

axios.defaults.withCredentials = true;

export default function ajax<T>(
  url: string,
  data: { [key: string]: any } = {},
  type: string = "GET"
): Promise<ReturnData<T>> {
  data["stampTime"] = new Date().getTime();
  return new Promise((resolve) => {
    let promise;

    if (type === "GET") {
      promise = axios.get(BASE_URL + url, {
        params: data,
      });
    } else if (type === "POST") {
      promise = axios.post(BASE_URL + url, data);
    }
    promise
      ?.then((response) => {
        resolve(response.data);
      })
      .catch((err) => {
        message.error(err.message);
        console.log(err);
      });
  });
}
