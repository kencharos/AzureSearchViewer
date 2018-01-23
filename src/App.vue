<template>
  <div id="app">
    <div>
      <h3>connection</h3>
      AzureSearch Endpoint:<input v-model="endpoint" size="30">
      Key:<input v-model="key" size="20">
      index:<input v-model="index" size="20"> 
    </div>

    <div>
      <h3>condition</h3>
      search:<input v-model="search" size="20">
      filter:<input v-model="filter" size="40"><br>
      count: true:<input type="radio" v-model="count" value="true"> false:<input type="radio" v-model="count" value="false"><br>
      top:<input v-model="top" size="5" number> skip:<input v-model="skip" size="5" number>
      orderby:<input v-model="orderby" size="15">
      <button @click="onSearch">Search</button>
      <button @click="onUpdate">update</button> <span>{{updateResult}}</span>
    </div>

    <div>
      <textarea  style="width:700px;height:500px;" v-model="results"></textarea>
      <textarea  style="width:700px;height:500px;" v-model="updateDocuments"></textarea>
    </div>

  </div>
</template>

<script>
import {AzureSearchAdaptor} from "./lib/search"
import json from "json-format"
export default {
  name: 'app',
  data () {
    return {
      endpoint: '',
      key: '',
      index:'',
      search:'',
      filter:'',
      count:"false",
      top:100,
      skip:0,
      orderby:'',
      other:'',
      results:'search results here',
      updateDocuments:'[update documents here]',

      updateResult:''
    }
  },
  methods: {
    onSearch: function() {
      let client = new AzureSearchAdaptor(this.endpoint, this.key, this.index);
      
      let noemp = str => str != null && str.length > 0
      let query = {}
      if (noemp(this.search)) query.search = (this.search)
      if (noemp(this.filter)) query.filter = (this.filter)
      if ("true" === this.count) query.count = "true"
      if (noemp(this.orderby)) query.orderby = this.orderby
      query.top = this.top + "";
      query.skip = this.skip + "";

      client.search(query)
        .then(res => this.results = json(res.raw))
        .catch(err => this.results=json(err))
    },

    onUpdate: function() {
      let client = new AzureSearchAdaptor(this.endpoint, this.key, this.index);
      let docs = JSON.parse(this.updateDocuments)
      client.addDocumentsAsync(docs)
        .then(res => this.updateResult = "update success")
        .catch(err => this.updateResult=json(err))
    }
  }
}
</script>

<style lang="scss">
</style>
