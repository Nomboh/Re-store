import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { router } from "../router/Routes";

axios.defaults.baseURL = "http://localhost:5000/api/";
axios.defaults.withCredentials = true;

const responseBody = (response: AxiosResponse) => response.data;

const sleep = () => new Promise(resolve => setTimeout(resolve, 1500));

axios.interceptors.response.use(
  async response => {
    await sleep();
    return response;
  },
  (error: AxiosError) => {
    const { data, status } = error.response as AxiosResponse;
    switch (status) {
      case 400:
        if (data.errors) {
          const modalError: string[] = [];
          for (const key in data.errors) {
            modalError.push(data.errors[key]);
          }
          throw modalError.flat();
        }
        toast.error(data.title);
        break;

      case 401:
        toast.error(data.title);
        break;

      case 403:
        toast.error(data.title);
        break;

      case 404:
        router.navigate("/not-found");
        break;

      case 500:
        router.navigate("/server-error", { state: { error: data } });
        break;
    }
    return Promise.reject(error.response);
  }
);

const request = {
  get: (url: string) => axios.get(url).then(responseBody),
  post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
  put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
  delete: (url: string) => axios.delete(url).then(responseBody),
};

const catalog = {
  list: () => request.get("products"),
  details: (id: number) => request.get(`products/${id}`),
};

const buggy = {
  getBadRequest: () => request.get("buggy/bad-request"),
  getNotFound: () => request.get("buggy/not-found"),
  getUnauthorised: () => request.get("buggy/unauthorised"),
  getValidation: () => request.get("buggy/validation"),
  getServer: () => request.get("buggy/server-error"),
};

const basket = {
  getBasket: () => request.get("basket"),
  addBasket: (productId: number, quantity: number = 1) =>
    request.post(`basket?productId=${productId}&quantity=${quantity}`, {}),
  removeBasket: (productId: number, quantity: number) =>
    request.delete(`basket?productId=${productId}&quantity=${quantity}`),
};

const agent = {
  catalog,
  buggy,
  basket,
};

export default agent;
