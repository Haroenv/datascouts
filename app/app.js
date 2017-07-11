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
    url: 'https://osoc-2017-datascouts-backend-akad1070.c9users.io/api/v1',
    mockDataTwitter: 'http://www.json-generator.com/api/json/get/ckwxgssyXm?indent=2',
    entities: ['osoc','tesla','spacex', 'apple'],
    selectedEntities: [],
    searchEntity: '',
    currentEntity: '',
    selected: false,
    waterfall: new Waterfall(200),
    waterfallIsCreated: false,
    isLoading: false,
    vueIsWorking: 'Hurray, Vue is working!'
  },
  watch: {
    items: function(updatingWfContainer){
      this.updateWaterfall()
    }
  },
  mounted: function() {
    this.loadEntities()
  },
  methods: {
    fetchData: function(entities) {
      //display load templates, hide loading elements
      this.isLoading = true
      document.getElementById("wf-container").style.visibility = "hidden"

      this.$http.get(this.mockDataTwitter).then(function (response) {
          this.items = response.data
          //console.log(response)
        }, function (response) {
          console.log("Error Fail to get data")
      });

      //now the real magic happens
      /*this.$http.get(this.url + '/entities', JSON.stringify(entities)).then(function (response) {
          this.items = JSON.parse(response.data)
          //console.log(response)
        }, function (response) {
          console.log("Error Fail to get data")
      });*/

    },
    addEntity: function (entity, e) {
      e.preventDefault()
      console.log(entity)
      this.$http.post(this.url + '/entities/', {"name" : entity}).then(function (response) {
          console.log("Entity added")
          //console.log(response)
        }, function (response) {
          console.log("Error Fail to get data")
      })
      this.loadEntities
    },
    selectEntity: function (entity, e) {
      e.preventDefault()
      //console.log(entity)
      if(!this.selected || this.currentEntity==entity){
        this.selected = !this.selected
      }
      this.currentEntity = entity
      if(this.selected){
        document.getElementById("sidenav_handles").style.marginLeft = "250px"
      }
      else{
        document.getElementById("sidenav_handles").style.marginLeft = "0px"
      }
    },
    editEntity: function(entity, e) {

    },
    deleteEntity: function(entity, e) {

    },
    loadEntities: function() {
      this.$http.get(this.url + '/entities').then(function (response) {
        this.entities = response.data.map(e => e.name);

          //console.log(response)
        }, function (response) {
          console.log("Error Fail to get data")
      })
    },
    updateWaterfall: _.debounce(
        function() {
          this.waterfall.compose(true)
          document.getElementById("wf-container").style.visibility = "visible"
          this.isLoading = false
        },
      1)
    }
})
