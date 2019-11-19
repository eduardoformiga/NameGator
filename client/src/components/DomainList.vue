<template>
  <div>
    <div id="main">
      <div class="container">
        <div class="row">
          <div class="col-md">
            <AppItemList
              title="Prefixos"
              :items="items.prefix"
              type="prefix"
              @addItem="addItem"
              @deleteItem="deleteItem"
            ></AppItemList>
          </div>
          <div class="col-md">
            <AppItemList
              title="Suffixos"
              :items="items.suffix"
              type="suffix"
              @addItem="addItem"
              @deleteItem="deleteItem"
            ></AppItemList>
          </div>
        </div>
        <br />
        <h5>
          Domínios
          <span class="badge badge-info">{{ domains.length }}</span>
        </h5>
        <div class="card">
          <div class="card-body">
            <ul class="list-group">
              <li
                class="list-group-item"
                v-for="domain in domains"
                :key="domain.name"
              >
                <div class="row">
                  <div class="col-md-6">{{ domain.name }}</div>
                  <div class="col-md-3">
                    <span class="badge badge-info">{{ domain.available ? 'Disponível' : 'Não Disponível' }}</span>
                  </div>
                  <div class="col-md-3 text-right">
                    <a
                      class="btn btn-info"
                      :href="domain.checkout"
                      target="_blank"
                    >
                      <span class="fa fa-shopping-cart"></span>
                    </a>
                    &nbsp;
                    <button
                      class="btn btn-info"
                      @click="openDomain(domain)"
                    >
                      <span class="fa fa-search"></span>
                    </button>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import 'bootstrap/dist/css/bootstrap.css'
import 'font-awesome/css/font-awesome.css'
import axios from 'axios/dist/axios'
import AppItemList from './AppItemList'

export default {
  name: 'app',
  components: {
    AppItemList
  },
  data() {
    return {
      items: {
        prefix: [],
        suffix: []
      },
      domains: []
    }
  },
  methods: {
    async addItem(item) {
      const response = await axios({
        url: 'http://localhost:4000',
        method: 'post',
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
      })
      const query = response.data
      const newItem = query.data.newItem
      this.items[item.type].push(newItem)
      this.generateDomains()
    },
    async deleteItem(item) {
      await axios({
        url: 'http://localhost:4000',
        method: 'post',
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
      })
      // delete item
      this.items[item.type].splice(this.items[item.type].indexOf(item), 1)
      this.generateDomains()
    },
    async getItems(type) {
      const getItemsPromise = axios({
        url: 'http://localhost:4000',
        method: 'post',
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
      })

      const { data: query } = await getItemsPromise
      this.items[type] = query.data.items

      return getItemsPromise
    },
    async generateDomains() {
      const { data: query } = await axios({
        url: 'http://localhost:4000',
        method: 'post',
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
      })

      this.domains = query.data.domains
    },
    openDomain(domain) {
      this.$router.push({
        path: `/domains/${domain.name}`
      })
    }
  },
  async created() {
    await Promise.all([this.getItems('prefix'), this.getItems('suffix')])
    this.generateDomains()
  }
}
</script>

<style>
</style>
