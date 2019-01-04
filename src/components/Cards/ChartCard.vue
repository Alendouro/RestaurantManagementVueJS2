<template>
  <md-card>
    <md-card-header class="card-chart" :data-background-color="dataBackgroundColor">
      <div :id="chartId" class="ct-chart"></div>
    </md-card-header>

    <md-card-content>
      <slot name="content"></slot>
    </md-card-content>

    <md-card-actions md-alignment="left">
      <slot name="footer"></slot>
    </md-card-actions>
  </md-card>
</template>
<script>

import Chartist from 'chartist';

export default {

  name: "chart-card",
  props: {
    footerText: {
      type: String,
      default: ""
    },
    headerTitle: {
      type: String,
      default: "Chart title"
    },
    chartType: {
      type: String,
      default: "Line" // Line | Pie | Bar
    },
    chartOptions: {
      type: Object,
      default: () => {
        return {};
      }
    },
    chartResponsiveOptions: {
      type: Array,
      default: () => {
        return [];
      }
    },
    chartData: {
      type: Object,
      default: () => {
        return {
          labels: [],
          series: []
        };
      }
    },
    dataBackgroundColor: {
      type: String,
      default: ""
    }
  },

  data() {
    return {
      chartId: "no-id",
      chartInstance: null
    };
  },
  methods: {
    /***
     * Initializes the chart by merging the chart options sent via props and the default chart options
     */
    initChart() {
      let divNode = document.getElementById(this.chartId);

      if(this.chartType === 'Line'){
        this.chartInstance = new Chartist.Line(divNode, this.chartData, this.chartOptions);
      }else if (this.chartType === "Bar"){
        this.chartInstance = new Chartist.Bar(divNode, this.chartData, this.chartOptions);
      }

    },
    /***
     * Assigns a random id to the chart
     */
    updateChartId() {
      let currentTime = new Date().getTime().toString();
      let randomInt = this.getRandomInt(0, currentTime);
      this.chartId = `div_cardChart_${randomInt}`;
    },
    getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
  },
  mounted() {
    this.updateChartId();
    this.$nextTick(this.initChart);
  },
  watch:{
    data(newData, oldData){
      this.chartInstance.update(newData, this.options);
    },
    options(newOpts) {
      this.chartInstance.update(this.data, newOpts);
    }
  }
};
</script>

<style scoped>

</style>
