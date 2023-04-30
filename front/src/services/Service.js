import axios from 'axios'

const apiClient = axios.create({
    baseURL: `https://jsonplaceholder.typicode.com`,
    withCredentials: false, // This is the default
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }
})

export default {
    getTest(n) {
        return apiClient.get('/users/' + n)
    },
    getMeanTimeBetweenStations(station1, station2) {
        return apiClient.get('/mean',{ params: {'startStationName' : station1, 'endStationName' : station2}})
    },
    getStationInfo(station) {
        return apiClient.get('/info/',{ params: {'station' : station}})
    }
    // getMostStation() {
    //     return apiClient.get('/most')
    // },
    // getLeastStation() {
    //     return apiClient.get('/least/')
    // },
}