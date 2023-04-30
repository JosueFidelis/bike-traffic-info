<script setup>
import WelcomeItem from './WelcomeItem.vue'
import DocumentationIcon from './icons/IconDocumentation.vue'
import ToolingIcon from './icons/IconTooling.vue'
import EcosystemIcon from './icons/IconEcosystem.vue'
import CommunityIcon from './icons/IconCommunity.vue'
import SupportIcon from './icons/IconSupport.vue'

</script>

<script>
import BikeServices from '@/services/Service.js'

export default {
  data() {
    return {
      most: [],
      least: [],
      mean: [],
      info: []
    }
  }, computed: {
    newMost() {
      var source = new EventSource("http://localhost:9090");
      source.onmessage = event => {
        console.log(event.data)
        this.most = JSON.parse(event.data)['stations'][4]
      };
      return this.most
    },
    newLeast() {
      var source = new EventSource("http://localhost:9090");
      source.onmessage = event => {
        this.least = JSON.parse(event.data)['stations']
      };
      return this.least
    }

  },
  created() {
    BikeServices.getTest(1)
      .then(response => {
        this.mean = response.data['name']
      })
      .catch(error => {
        console.log('There was an error:', error.response)
      })
    BikeServices.getTest(2)
      .then(response => {
        this.info = response.data['name']
      })
      .catch(error => {
        console.log('There was an error:', error.response)
      })
  }
}
</script>


<template>
  <div>
    <WelcomeItem>
      <template #icon>
        <EcosystemIcon />
      </template>
      <template #heading>Station with most arrivals last hour </template>

      <h2>{{ newMost }}</h2>
    </WelcomeItem>

    <WelcomeItem>
      <template #icon>
        <CommunityIcon />
      </template>
      <template #heading>Station with most departures last hour </template>

      <h2>{{ newLeast }}</h2>
    </WelcomeItem>

    <WelcomeItem>
      <template #icon>
        <SupportIcon />
      </template>
      <template #heading>Estimated(mean) travel time between stations </template>

      <h2>{{ mean }}</h2>
    </WelcomeItem>

    <WelcomeItem>
      <template #icon>
        <DocumentationIcon />
      </template>
      <template #heading>Latest departures and arrivals in the station</template>

      <h2>{{ info }}</h2>
    </WelcomeItem>

  </div>
</template>
