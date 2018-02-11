// vue
var app = new Vue({
  el: '#app',
  data: {
    services:[],
    service:"",
    indexes:[],
    index:'',
    search:'',
    filter:'',
    facet:'',
    count:"false",
    top:10,
    skip:0,
    orderby:'',
    other:'',
    results:'search results here',
    updateDocuments:'[update/add/delete documents here]',
    updateResult:''
  },

  mounted: function() {
    // need `credentials: 'include'` in Azure apps with AAD, for sending cookie.
    window.fetch("/api/services",{ mode: 'cors',credentials: 'include' })
    .then(res => res.json())
    .then(res => {
      let len = this.services.length;
      for(var i = 0; i < len;i++)this.services.pop();
      res.forEach(r => this.services.push(r));
      
    })
    .catch(e => this.updateResult = JSON.stringify(e))
  },

  methods: {
    getIndex: function () {
      
      window.fetch(`/api/services/${this.service}`,{ mode: 'cors',credentials: 'include' })
      .then(res => res.json())
      .then(res =>  {
        this.index ="";
        let len = this.indexes.length;
        for(var i = 0; i < len;i++)this.indexes.pop();
        res.forEach(r => this.indexes.push(r));
      })
      .catch(e => this.updateResult = JSON.stringify(e))
      
    },
    onSearch: function() {
      this.updateResult ="execute search documents...";
      let noemp = str => str != null && str.length > 0
      let query = {}
      if (noemp(this.search)) query.search = (this.search)
      if (noemp(this.filter)) query.filter = (this.filter)
      if (noemp(this.facet)) query.facet = (this.facet)
      if ("true" === this.count) query.count = true
      if (noemp(this.orderby)) query.orderby = this.orderby
      query.top = this.top-0;
      query.skip = this.skip-0;

      if (noemp(this.other)) {
        let json = JSON.parse(this.other);
        Object.keys(this.other).forEach(key => query[key] = this.other[key])
      }

      
      window.fetch(`/api/services/${this.service}/${this.index}/search`,
      { mode: 'cors',credentials: 'include', method:"POST",
        headers:{"Content-Type": "application/json"},
       body:JSON.stringify(query) })
      .then(res => res.json())
      .then(res => {
        this.results = JSON.stringify(res, null, " ")
        this.updateDocuments = JSON.stringify(res.value, null, " ")
        
         this.updateResult =`fetch ${res.value.length} documents.`;
      }).catch(e => this.updateResult = JSON.stringify(e))

    },

    onUpdate: function() {
      
      this.updateResult ="execute update documents..";
      window.fetch(`/api/services/${this.service}/${this.index}/update`,
      { mode: 'cors',credentials: 'include', method:"POST", 
        headers:{"Content-Type": "application/json"},body:this.updateDocuments })
      .then(res => res.text())
      .then(res => {
        this.updateResult = res
      }).catch(e => this.updateResult = JSON.stringify(e))
    },
    
    onDelete: function() {
      
      this.updateResult ="execute delete documents..";
      window.fetch(`/api/services/${this.service}/${this.index}/delete`,
      { mode: 'cors',credentials: 'include', method:"POST", 
        headers:{"Content-Type": "application/json"},body:this.updateDocuments })
      .then(res => res.text())
      .then(res => {
        this.updateResult = res
      }).catch(e => this.updateResult = JSON.stringify(e))
    }
  }
})