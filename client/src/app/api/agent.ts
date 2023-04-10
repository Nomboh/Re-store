import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { PaginatedResponse } from "../models/pagination";
import { router } from "../router/Routes";
import { store } from "../store/configureStore";

axios.defaults.baseURL = "http://localhost:5000/api/";
axios.defaults.withCredentials = true;

const responseBody = (response: AxiosResponse) => response.data;

axios.interceptors.request.use(config => {
  const token = store.getState().account.user?.token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const sleep = () => new Promise(resolve => setTimeout(resolve, 1500));

axios.interceptors.response.use(
  async response => {
    await sleep();
    const pagination = response.headers["pagination"];

    if (pagination) {
      response.data = new PaginatedResponse(
        response.data,
        JSON.parse(pagination)
      );
      return response;
    }
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
  get: (url: string, params?: URLSearchParams) =>
    axios.get(url, { params }).then(responseBody),
  post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
  put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
  delete: (url: string) => axios.delete(url).then(responseBody),
};

const catalog = {
  list: (params: URLSearchParams) => request.get("products", params),
  details: (id: number) => request.get(`products/${id}`),
  fetchFilters: () => request.get(`products/filters`),
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

const account = {
  login: (values: any) => request.post(`account/login`, values),
  register: (values: any) => request.post(`account/register`, values),
  currentUser: () => request.get(`account/currentUser`),
  fetchAddress: () => request.get("account/savedAddress"),
};

const order = {
  list: () => request.get("orders"),
  fetch: (id: number) => request.get(`orders/${id}`),
  create: (value: any) => request.post("orders", value),
};

const agent = {
  catalog,
  buggy,
  basket,
  account,
  order,
};

export default agent;
