new Vue({
  el:'#vue-app',
  /*http: {
    root: '/root',
    headers: {
      Authorization: 'Basic YXBpOnBhc3N3b3Jk'
    }
  },*/
  data: {
    items: [],
    socialMediaFilters: [
      {name: 'Twitter',
      active: true},
      {name: 'Facebook',
      active: false}
    ],
    dateFilters: [
      {year: 2017,
      active: true},
      {year: 2016,
      active: false}
    ],
    url: 'https://osoc-2017-datascouts-akad1070.c9users.io/',
    mockDataTwitter: 'http://www.json-generator.com/api/json/get/ckwxgssyXm?indent=2',
    newEntity: '',
    currentEntity: '',
    entities: [],
    waterfall: new Waterfall(200),
    waterfallIsCreated: false,
    isLoading: false,
    limit: 20,
    vueIsWorking: 'Hurray, Vue is working!'
  },
  watch: {
    items: function(updatingWfContainer){
      this.updateWaterfall()
    }

  },
  methods: {
    fetchData: function(mediaFilter) {
      var u = this.url + mediaFilter + '/q/' + this.currentEntity + '?limit=' + this.limit
      if(this.currentEntity=='mockdata'){
        u = this.mockDataTwitter
      }
      this.isLoading = true
      document.getElementById("wf-container").style.visibility = "hidden"
      this.$http({url: u, method: 'GET' }).then(function (response) {
          this.items = response.data
          this.isLoading = false
          //console.log(response)
        }, function (response) {
          console.log("Error Fail to get data")
          this.isLoading = false
      });

    },
    addEntity: function (e) {
      e.preventDefault()
      if(this.newEntity==undefined || this.newEntity.length==0){
        if(this.entities.indexOf('mockdata')==-1){
          this.entities.push('mockdata')
        }
        this.currentEntity='mockdata'
      }
      else{
        if(this.entities.indexOf(this.newEntity)==-1){
          this.entities.push(this.newEntity)
        }
        this.currentEntity=this.newEntity
      }
      this.fetchData('twitter')
      this.newEntity=''
    },
    selectEntity: function (entity, e) {
      e.preventDefault()
      //console.log(entity)
      this.currentEntity = entity
      this.fetchData('twitter')
    },
    updateWaterfall: _.debounce(
        function() {
          this.waterfall.compose(true)
          document.getElementById("wf-container").style.visibility = "visible"
        },
      1)
    }
})
