<template>
  <div>
    <div id="slogan">
      <div class="text-center">
        <h1>NameGator</h1>
        <br />
        <h6 class="text-secondary">Gerador de nomes utilizando Vue.js, GraphQL e Node</h6>
      </div>
    </div>

    <div id="main">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import 'bootstrap/dist/css/bootstrap.css'
import 'font-awesome/css/font-awesome.css'

export default {
  name: 'app'
}
</script>

<style>
#slogan {
  margin-top: 30px;
  margin-bottom: 30px;
}
#main {
  background-color: #f1f1f1;
  padding: 30px 0;
}
</style>
