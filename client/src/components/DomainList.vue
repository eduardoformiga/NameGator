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
import AppItemList from './AppItemList'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'app',
  components: {
    AppItemList
  },
  data() {
    return {}
  },
  methods: {
    ...mapActions(['addItem', 'deleteItem', 'getItems', 'generateDomains']),
    openDomain(domain) {
      this.$router.push({
        path: `/domains/${domain.name}`
      })
    }
  },
  computed: {
    ...mapState(['items', 'domains'])
  }
}
</script>

<style>
</style>
