<script>
import { Line, mixins } from 'vue-chartjs';

export default {
  extends: Line,
  props: {
    options: {
      type: Object,
      default: null,
    },
  },
  mixins: [mixins.reactiveProp],
  mounted() {
    this.renderChart(this.chartData, this.options);
  },
  watch: {
    chartData() {
      this._data._chart.destroy();
      this.renderChart(this.chartData, this.options);
    },
  },
};
</script>

<style>
</style>
