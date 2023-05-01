<script setup>
import WelcomeItem from './WelcomeItem.vue'
import ArrowDownRightIcon from './icons/IconArrowDownRight.vue'
import ArrowUpLeftIcon from './icons/IconArrowUpLeft.vue'
import ClockIcon from './icons/IconClock.vue'
import BookIcon from './icons/IconBook.vue'

</script>

<script>
import BikeServices from '@/services/Service.js'

export default {
  data() {
    return {
      meanStation1 :'',
      meanStation2 :'',
      infoStation :'',
      most: [],
      least: [],
      mean: [],
      info: { arrivals: '', departures: '' }
    }
  }, computed: {
    newMost() {
      var source = new EventSource("http://localhost:9090");
      source.onmessage = event => {
        console.log(event.data)
        this.most = JSON.parse(event.data)['stations']
      };
      return this.most
    },
    newLeast() {
      var source = new EventSource("http://localhost:9090");
      source.onmessage = event => {
        this.least = JSON.parse(event.data)['stations']
      };
      return this.least
    },
    newMean(){
      BikeServices.getMeanTimeBetweenStations(this.meanStation1, this.meanStation2)
        .then(response => {
          this.mean = response.data['meanTime'] 
        })
        .catch(error => {
          console.log('There was an error:', error.response)
        })
        return this.mean
    }
  },
  methods: {
    getNewInfo(){
      BikeServices.getStationInfo(this.infoStation)
        .then(response => {
          this.info.arrivals = response.data['arrivals'] 
          this.info.departures = response.data['departures']
        })
        .catch(error => {
          console.log('There was an error:', error.response)
        })
    }
  }
}
</script>


<template>
  <div>
    <WelcomeItem>
      <template #icon>
        <ArrowDownRightIcon />
      </template>
      <template #heading>Station with most arrivals last hour </template>

      <h2>1. {{ newMost[0] }}</h2>
      <h2>2. {{ newMost[1] }}</h2>
      <h2>3. {{ newMost[2] }}</h2>
      <h2>4. {{ newMost[3] }}</h2>
      <h2>5. {{ newMost[4] }}</h2>
    </WelcomeItem>

    <WelcomeItem>
      <template #icon>
        <ArrowUpLeftIcon />
      </template>
      <template #heading>Station with most departures last hour </template>

      <h2>1. {{ newLeast[5] }}</h2>
      <h2>2. {{ newLeast[6] }}</h2>
      <h2>3. {{ newLeast[7] }}</h2>
      <h2>4. {{ newLeast[8] }}</h2>
      <h2>5. {{ newLeast[9] }}</h2>
    </WelcomeItem>

    <WelcomeItem>
      <template #icon>
        <ClockIcon />
      </template>
      <template #heading>
        Mean time between stations<br>
        <input class="bikeInput1" type="text" v-model="meanStation1" placeholder="University Ave / Elm St" />
        and
        <input class="bikeInput2" type="text" v-model="meanStation2" placeholder="University Ave / Elm St" />
      </template>

      <h2>{{ newMean }} segundos </h2>
    </WelcomeItem>

    <WelcomeItem>
      <template #icon>
        <BookIcon />
      </template>
      <template #heading>
        Latest departures and arrivals in the station:
        <input class="bikeInput1" type="text" v-model="infoStation" placeholder="University Ave / Elm St" v-on:input="getNewInfo" />
      </template>

      <h2>{{ info.arrivals + " arrivals"}}</h2>
      <h2>{{ info.departures + " departures" }}</h2>
    </WelcomeItem>

  </div>
</template>
