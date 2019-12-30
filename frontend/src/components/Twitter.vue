<template>
  <div class="metrics">
    <img src="../assets/twitter_logo.png">
    <div v-if="!loaded" class="loader"></div>
    <date-picker
      v-if="loaded"
      v-model="dateRange"
      mode="range"
      :input-props='{
        style: "display: block; margin: 0 auto 35px auto; max-width: 500px; text-align: center",
        placeholder: "Select a range of dates to filter the chart.",
      }'
    />
    <line-chart v-if="loaded" :chartData="chartdata" />
  </div>
</template>

<script>
import DatePicker from 'v-calendar/lib/components/date-picker.umd';

import axios from 'axios';
import moment from 'moment';
import LineChart from './Chart';

export default {
  name: 'Twitter',
  data() {
    return {
      chartdata: {
        labels: [],
        datasets: [{
          label: 'Elon Musk',
          backgroundColor: 'rgba(0, 76, 153, 0.2)',
          data: [],
        }, {
          label: 'Donald Trump',
          backgroundColor: 'rgba(175, 0, 42, 0.2)',
          data: [],
        }, {
          label: 'Barack Obama',
          backgroundColor: 'rgba(0, 191, 108, 0.2)',
          data: [],
        }, {
          label: 'The Economist',
          backgroundColor: 'rgba(255, 145, 0, 0.2)',
          data: [],
        }],
      },
    };
  },
  computed: {
    dateRange: {
      get() {
        return this.$store.state.dateRange;
      },
      set(value) {
        this.$store.commit('updateDateRange', value);
        this.storeMetrics();
      },
    },
    loaded: {
      get() {
        return this.$store.state.loaded;
      },
      set(value) {
        this.$store.commit('updateLoaded', value);
      },
    },
  },
  async mounted() {
    this.loaded = false;
    this.storeMetrics();
  },
  methods: {
    async storeMetrics() {
      this.fetchData(this.getQuery())
        .then((response) => {
          const self = this;
          // console.log(response.data);
          response.data.sort((a, b) => Number(a.id.N) - Number(b.id.N));

          const labels = response.data.map(el => el.id.N);
          self.chartdata.labels = labels.map(el => moment.unix(el).format('MM/DD/YYYY - h:mm a'));
          self.chartdata.datasets[0].data = response.data.map(el => el.elonmusk.N);
          self.chartdata.datasets[1].data = response.data.map(el => el.realDonaldTrump.N);
          self.chartdata.datasets[2].data = response.data.map(el => el.BarackObama.N);
          self.chartdata.datasets[3].data = response.data.map(el => el.TheEconomist.N);
          self.loaded = true;
        })
        // eslint-disable-next-line no-console
        .catch(error => console.log(error));
    },
    getQuery() {
      if (this.dateRange) {
        return {
          params: {
            start: moment(this.$store.state.dateRange.start).unix(),
            end: moment(this.$store.state.dateRange.end).unix(),
          },
        };
      }

      return { // TODO: remove when handled in endpoint
        params: {
          start: 0,
          end: 9999999999,
        },
      };
    },
    async fetchData(query) {
      const response = axios
        .get('https://fl2pqtejz0.execute-api.us-east-1.amazonaws.com/prod/metrics', query);

      return response;
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
