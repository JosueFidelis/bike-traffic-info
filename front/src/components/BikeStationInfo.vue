<script setup>
import BikeStationInfoItem from './BikeStationInfoItem.vue';
import ArrowDownRightIcon from './icons/IconArrowDownRight.vue'
import ArrowUpLeftIcon from './icons/IconArrowUpLeft.vue'
import ClockIcon from './icons/IconClock.vue'
import BookIcon from './icons/IconBook.vue'
</script>

<script>
import BikeServices from '@/services/Service.js';

export default {
  data() {
    return {
      meanStation1: '',
      meanStation2: '',
      infoStation: '',
      stationsWithMostBikes: [],
      stationsWithLeastBikes: [],
      mean: [],
      info: { arrivals: 0, departures: 0 },
    };
  },
  created(){
    const source = new EventSource('http://localhost:9090');
    source.onmessage = (event) => {
      const stations = JSON.parse(event.data)['stations'];
      this.stationsWithLeastBikes = stations.slice(0, 5);
      this.stationsWithMostBikes = stations.slice(5, 10);
    };
  },
  computed: {
    meanTimeBetweenStation() {
      BikeServices.getMeanTimeBetweenStations(
        this.meanStation1,
        this.meanStation2
      )
        .then((response) => {
          this.mean = response.data['meanTime'];
        })
        .catch((error) => {
          console.log('There was an error:', error.response);
        });
      return this.mean;
    },
  },
  methods: {
    getNewInfo() {
      BikeServices.getStationInfo(this.infoStation)
        .then((response) => {
          this.info.arrivals = response.data['arrivals'];
          this.info.departures = response.data['departures'];
        })
        .catch((error) => {
          console.log('There was an error:', error.response);
        });
    },
  },
};
</script>

<template>
  <div>
    <BikeStationInfoItem>
      <template #icon>
        <ArrowDownRightIcon />
      </template>
      <template #heading>Station with most arrivals last hour </template>

      <h2 v-for="(station, index) in stationsWithMostBikes" :key="index">
        #{{ index + 1 }} {{ station }}
      </h2>
    </BikeStationInfoItem>

    <BikeStationInfoItem>
      <template #icon>
        <ArrowUpLeftIcon />
      </template>
      <template #heading>Station with most departures last hour </template>

      <h2 v-for="(station, index) in stationsWithLeastBikes" :key="index">
        #{{ index + 1 }} {{ station }}
      </h2>
    </BikeStationInfoItem>

    <BikeStationInfoItem>
      <template #icon>
        <ClockIcon />
      </template>
      <template #heading>
        Mean time between stations<br />
        <input
          class="bikeInput1"
          type="text"
          v-model="meanStation1"
          placeholder="University Ave / Elm St"
        />
        and
        <input
          class="bikeInput2"
          type="text"
          v-model="meanStation2"
          placeholder="Bathurst St / Dundas St W"
        />
      </template>

      <h2 v-if="meanTimeBetweenStation != -1 ">
        <template v-if=" meanTimeBetweenStation >= 60">{{ Math.floor(meanTimeBetweenStation/60) }} minutos e </template>
        <template v-if=" (Math.floor(meanTimeBetweenStation) % 60) != 0">{{ Math.floor(meanTimeBetweenStation % 60) }} segundos</template>
      </h2>
      <h2 v-else>Dados sobre essa busca não foram encontrados</h2>
    </BikeStationInfoItem>

    <BikeStationInfoItem>
      <template #icon>
        <BookIcon />
      </template>
      <template #heading>
        Latest departures and arrivals in the station:
        <input
          class="bikeInput1"
          type="text"
          v-model="infoStation"
          placeholder="Union Station"
          v-on:input="getNewInfo"
        />
      </template>

      <div v-if="info.arrivals != 0 && info.departures != 0">
        <h2>{{ info.arrivals + ' arrivals' }}</h2>
        <h2>{{ info.departures + ' departures' }}</h2>
      </div>
      <div v-else>
        <h2>Dados sobre essa busca não foram encontrados</h2>
      </div>
    </BikeStationInfoItem>
  </div>
</template>
