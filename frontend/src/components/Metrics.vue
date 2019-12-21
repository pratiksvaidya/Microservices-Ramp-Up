<template>
  <div class="metrics">
    <line-chart v-if="loaded" :chartData="chartdata" />
  </div>
</template>

<script>
import axios from 'axios';
import LineChart from './Chart';

export default {
  name: 'Metrics',
  data() {
    return {
      chartdata: {
        labels: [],
        datasets: [{
          label: 'Incoming Non-Gmail Messages',
          backgroundColor: 'rgba(0, 76, 153, 0.2)',
          data: [],
        }],
      },
      loaded: false,
    };
  },
  async mounted() {
    this.loaded = false;
    this.getMetrics();
  },
  methods: {
    getMetrics() {
      const self = this;
      axios
        .create({
          baseURL:
            'https://n2c2iurxbb.execute-api.us-east-1.amazonaws.com/prod/metrics',
          withCredentials: false,
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        })
        .get()
        .then((response) => {
          // console.log(response.data);
          self.metrics = response.data;
          self.chartdata.labels = response.data.map(el => el.timestamp);
          self.chartdata.datasets[0].data = response.data.map(el => el['incoming-non-gmail-msgs']);
          self.loaded = true;
        });
    },
  },
  components: {
    LineChart,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
