import Vue from "vue";
import VueRouter from "vue-router";
import Vuex from "vuex";
import App from "./App.vue";
import DomainList from "./components/DomainList.vue";
import DomainView from "./components/DomainView.vue";
import axios from "axios/dist/axios";

Vue.config.productionTip = false;
Vue.use(VueRouter);
Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    items: {
      prefix: [],
      suffix: []
    },
    domains: []
  },
  mutations: {
    addItem(state, payload) {
      const { item, newItem } = payload;
      state.items[item.type].push(newItem);
    },
    deleteItem(state, payload) {
      const { item } = payload;
      state.items[item.type].splice(state.items[item.type].indexOf(item), 1);
    },
    setItems(state, payload) {
      const { type, items } = payload;
      state.items[type] = items;
    },
    setDomains(state, payload) {
      const { domains } = payload;
      state.domains = domains;
    }
  },
  actions: {
    async addItem(context, payload) {
      const item = payload;
      const response = await axios({
        url: "http://localhost:4000",
        method: "post",
        data: {
          query: `
            mutation($item: ItemInput) {
              newItem: saveItem(item: $item) {
                id
                type
                description
              }
            }
          `,
          variables: {
            item
          }
        }
      });
      const query = response.data;
      const newItem = query.data.newItem;
      context.commit("addItem", { item, newItem });
      context.dispatch("generateDomains");
    },
    async deleteItem(context, payload) {
      const item = payload;
      await axios({
        url: "http://localhost:4000",
        method: "post",
        data: {
          query: `
            mutation ($id: Int) {
              deleted: deleteItem(id: $id)
            }
          `,
          variables: {
            id: item.id
          }
        }
      });
      context.commit("deleteItem", { item });
      context.dispatch("generateDomains");
    },
    async getItems(context, payload) {
      const type = payload;
      const getItemsPromise = axios({
        url: "http://localhost:4000",
        method: "post",
        data: {
          query: `
            query ($type: String){
              items: items(type: $type) {
                id
                type
                description
              }
          }
        `,
          variables: {
            type
          }
        }
      });

      const { data: query } = await getItemsPromise;
      context.commit("setItems", { type, items: query.data.items });

      return getItemsPromise;
    },
    async generateDomains(context) {
      const { data: query } = await axios({
        url: "http://localhost:4000",
        method: "post",
        data: {
          query: `
            mutation {
              domains: generateDomains {
                name
                checkout
                available
              }
            }
          `
        }
      });

      context.commit("setDomains", { domains: query.data.domains });
    }
  }
});

(async () => {
  await Promise.all([
    store.dispatch("getItems", "prefix"),
    store.dispatch("getItems", "suffix")
  ]);
  store.dispatch("generateDomains");
})();

const router = new VueRouter({
  routes: [
    {
      path: "/domains",
      component: DomainList
    },
    {
      path: "/domains/:domain",
      component: DomainView,
      props: true
    },
    {
      path: "/",
      redirect: "/domains"
    }
  ]
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
