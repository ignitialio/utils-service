<template>
  <div :id="id" class="utils-layout">
    <div class="utils-left">
      <div class="utils-search">
        <v-text-field v-model="search" solo append-icon="search" clearable
          :label="$t('Search')"></v-text-field>
      </div>

      <v-list>
        <v-list-item v-for="feature in features" :key="feature.name"
          @click="handleSelected(feature)"
          class="utils-item"
          :class="{ 'selected': selected && ('' + selected.name === '' + feature.name) }">

          <v-list-item-avatar>
            <v-img :src="$utils.fileUrl(feature.icon)"></v-img>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title v-text="feature.name"></v-list-item-title>
            <v-list-item-subtitle v-text="$t(feature.description)"></v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </div>

    <div class="utils-right" >
      <div v-if="selected" class="utils-header">
        <h3>{{ selected.name }}</h3>
        <div>{{ $t(selected.description) }}</div>
      </div>
      <ig-form v-if="!!config && !!schema"
        v-model="config" :schema="schema"></ig-form>
    </div>
  </div>
</template>

<script>
import filter from 'lodash/filter'

export default {
  data: () => {
    return {
      id: 'utils_' + Math.random().toString(36).slice(2),
      loading: false,
      selected: null,
      search: '',
      features: [],
      schema: null,
      config: null
    }
  },
  watch: {
    search: function(val) {
      this.update()
    }
  },
  computed: {

  },
  methods: {
    update() {
      if (this.search !== '') {
        this.features =
          filter(this.features, e => (e.name + ' ' + e.description).match(this.search))
      } else {
        this.$services.waitForService('utils').then(async utilsService => {
          this.features = await utilsService.features()
          console.log($j(this.features))
        }).catch(err => console.log(err))
      }
    },
    handleSelected(feature) {
      this.$services.waitForService('utils').then(async utilsService => {
        let defs = await utilsService.parameters(feature.name)

        this.schema = defs.config
        this.config = await utilsService.config(feature.name)
      }).catch(err => console.log(err))

      this.selected = feature
    }
  },
  mounted() {
    // dev
    // refresh service UI on hot reload
    this.$services.once('service:up', service => {
      if (service.name === 'utils') {
        localStorage.setItem('HR_PATH', '/service-utils')
        window.location.reload()
      }
    })

    this.update()
  },
  beforeDestroy() {

  }
}
</script>

<style>
.utils-layout {
  width: 100%;
  height: calc(100% - 0px);
  display: flex;
}

.utils-progress-bar {
  position: absolute;
  width: 100%;
}

.utils-left {
  position: relative;
  min-width: 250px;
  width: 460px;
  max-width: calc(33% - 16px);
  border-right: 1px solid gainsboro;
  overflow-y: auto;
}

.utils-right {
  flex: 1;
  height: calc(100% - 0px);
  padding: 0 8px 0 8px;
}

.utils-header {
  border-radius: 2px;
  background-color: rgba(30, 144, 255, 0.05);
  padding: 8px;
  text-align: right;
  margin-bottom: 8px;
}

.utils-item.selected {
  background-color: rgba(30, 144, 255, 0.2);
}

.utils-btn--error {
  width: 24px;
  height: 24px;
  color: tomato;
}

.utils-search {
  padding: 24px 8px 0px 8px;
  background-color: rgba(30, 144, 255, 0.05);
  display: flex;
}
</style>
