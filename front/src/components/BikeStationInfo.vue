<script setup>
import BikeStationInfoItem from './BikeStationInfoItem.vue';
import DocumentationIcon from './icons/IconDocumentation.vue';
//import ToolingIcon from './icons/IconTooling.vue';
import EcosystemIcon from './icons/IconEcosystem.vue';
import CommunityIcon from './icons/IconCommunity.vue';
import SupportIcon from './icons/IconSupport.vue';
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
      info: { arrivals: '', departures: '' },
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
    newMean() {
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
        <EcosystemIcon />
      </template>
      <template #heading>Station with most arrivals last hour </template>

      <h2 v-for="(station, index) in stationsWithMostBikes" :key="index">
        {{ index }}. {{ station }}
      </h2>
    </BikeStationInfoItem>

    <BikeStationInfoItem>
      <template #icon>
        <CommunityIcon />
      </template>
      <template #heading>Station with most departures last hour </template>

      <h2 v-for="(station, index) in stationsWithLeastBikes" :key="index">
        {{ index }}. {{ station }}
      </h2>
    </BikeStationInfoItem>

    <BikeStationInfoItem>
      <template #icon>
        <SupportIcon />
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
          placeholder="University Ave / Elm St"
        />
      </template>

      <h2>{{ newMean }} segundos</h2>
    </BikeStationInfoItem>

    <BikeStationInfoItem>
      <template #icon>
        <DocumentationIcon />
      </template>
      <template #heading>
        Latest departures and arrivals in the station:
        <input
          class="bikeInput1"
          type="text"
          v-model="infoStation"
          placeholder="University Ave / Elm St"
          v-on:input="getNewInfo"
        />
      </template>

      <h2>{{ info.arrivals + ' arrivals' }}</h2>
      <h2>{{ info.departures + ' departures' }}</h2>
    </BikeStationInfoItem>
  </div>
</template>
