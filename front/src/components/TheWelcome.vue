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
  },
  created() {
    BikeServices.getTest(1)
      .then(response => {
        this.most = response.data['name']
      })
      .catch(error => {
        console.log('There was an error:', error.response)
      })
    BikeServices.getTest(2)
      .then(response => {
        this.least = response.data['name']
      })
      .catch(error => {
        console.log('There was an error:', error.response)
      })
  }, computed: {
    newMean() {
    var source = new EventSource("http://localhost:9090");
    source.onmessage = event => {
            this.mean = event.data
            this.info = event.data
    };
    return this.mean
    }
    
  }
}
</script>


<template>
  <div>
    <WelcomeItem>
      <template #icon>
        <DocumentationIcon />
      </template>
      <template #heading>Testing</template>

      <a>{{ most }}</a>
    </WelcomeItem>
    
    <WelcomeItem>
      <template #icon>
        <DocumentationIcon />
      </template>
      <template #heading>Testing</template>

      <a>{{ least }}</a>
    </WelcomeItem>

    <WelcomeItem>
      <template #icon>
        <DocumentationIcon />
      </template>
      <template #heading>Testing</template>

      <a>{{ newMean }}</a>
    </WelcomeItem>

    <WelcomeItem>
      <template #icon>
        <DocumentationIcon />
      </template>
      <template #heading>Testing</template>

      <a>{{ newMean }}</a>
    </WelcomeItem>

  </div>
</template>
