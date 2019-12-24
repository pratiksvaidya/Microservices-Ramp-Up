<template>
  <div class="metrics">
    <line-chart v-if="loaded" :chartData="chartdata" />
  </div>
</template>

<script>
import axios from 'axios';
import moment from 'moment';
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
        }, {
          label: 'Incoming Gmail Messages',
          backgroundColor: 'rgba(175, 0, 42, 0.2)',
          data: [],
        }, {
          label: 'Outgoing Non-Gmail Messages',
          backgroundColor: 'rgba(0, 191, 108, 0.2)',
          data: [],
        }, {
          label: 'Outgoing Gmail Messages',
          backgroundColor: 'rgba(255, 145, 0, 0.2)',
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
            'https://n2c2iurxbb.execute-api.us-east-1.amazonaws.com/prod/metrics?start=0&end=9999999999',
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
          const labels = response.data.map(el => el.id).sort();
          self.chartdata.labels = labels.map(el => moment.unix(el.N).format('MM/DD/YYYY - h:mm a'));
          self.chartdata.datasets[0].data = response.data.map(el => el['incoming-non-gmail-msgs'].N);
          self.chartdata.datasets[1].data = response.data.map(el => el['incoming-gmail-msgs'].N);
          self.chartdata.datasets[2].data = response.data.map(el => el['outgoing-non-gmail-msgs'].N);
          self.chartdata.datasets[3].data = response.data.map(el => el['outgoing-gmail-msgs'].N);
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
