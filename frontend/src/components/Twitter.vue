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
      chartdata: null,
    };
  },
  computed: {
    dateRange: {
      get() {
        return this.$store.state.dateRange;
      },
      set(value) {
        this.$store.commit('updateDateRange', value);
      },
    },
    loaded() {
      return !!this.chartdata;
    },
    query: {
      get() {
        return {
          params: {
            start: moment(this.dateRange.start).unix(),
            end: moment(this.dateRange.end).unix(),
          },
        };
      },
    },
  },
  async mounted() {
    if (this.dateRange) {
      this.updateChartData();
    } else {
      this.dateRange = {
        start: moment().startOf('month').toDate(),
        end: moment().endOf('month').toDate(),
      };
    }
  },
  watch: {
    dateRange() {
      this.updateChartData();
    },
  },
  methods: {
    async fetchData() {
      const response = await axios
        .get('https://fl2pqtejz0.execute-api.us-east-1.amazonaws.com/prod/metrics', this.query);

      return response.data;
    },
    updateChartData() {
      this.chartdata = null;
      this.fetchData().then((data) => {
        data.sort((a, b) => Number(a.id.N) - Number(b.id.N));
        const labels = data.map(el => el.id.N);
        this.chartdata = {
          labels: labels.map(el => moment.unix(el).format('MM/DD/YYYY - h:mm a')),
          datasets: [{
            label: 'Elon Musk',
            backgroundColor: 'rgba(0, 76, 153, 0.2)',
            data: data.map(el => el.elonmusk.N),
          }, {
            label: 'Donald Trump',
            backgroundColor: 'rgba(175, 0, 42, 0.2)',
            data: data.map(el => el.realDonaldTrump.N),
          }, {
            label: 'Barack Obama',
            backgroundColor: 'rgba(0, 191, 108, 0.2)',
            data: data.map(el => el.BarackObama.N),
          }, {
            label: 'The Economist',
            backgroundColor: 'rgba(255, 145, 0, 0.2)',
            data: data.map(el => el.TheEconomist.N),
          }],
        };
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
