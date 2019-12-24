<template>
  <div class="metrics">
    <date-picker v-model="dateRange" mode="range" class="picker"/>
    <line-chart v-if="loaded" :chartData="chartdata" />
  </div>
</template>

<script>
import DatePicker from 'v-calendar/lib/components/date-picker.umd';

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
  computed: {
    dateRange: {
      get() {
        return this.$store.state.dateRange;
      },
      set(value) {
        this.$store.commit('updateDateRange', value);
        this.getMetrics();
      },
    },
  },
  async mounted() {
    this.loaded = false;
    this.getMetrics();
  },
  methods: {
    getMetrics() {
      const self = this;
      let query = null;
      if (this.$store.state.dateRange) {
        const start = moment(this.$store.state.dateRange.start).unix();
        const end = moment(this.$store.state.dateRange.end).unix();
        query = '?start='.concat(start, '&end=', end);
      } else {
        query = '?start=0&end=9999999999'; // TODO: remove when handled in endpoint
      }

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
        .get(query)
        .then((response) => {
          // console.log(response.data);
          self.metrics = response.data;
          const labels = response.data.map(el => el.id.N).sort();
          self.chartdata.labels = labels.map(el => moment.unix(el).format('MM/DD/YYYY - h:mm a'));
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
    DatePicker,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
template {
  width: 100%;
  text-align: center;
}

.metrics {
  display: inline-block;
  margin: 0 auto;
  padding: 3px;
  width: 75%;
}
</style>
