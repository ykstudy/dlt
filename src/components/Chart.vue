<template>
<div class="echarts-box">
  <div id="blue-chart" :style="{width: width + 'px', height: height + 'px'}"></div>
</div>
</template>

<script setup lang="ts">
import {onMounted, defineProps} from 'vue'
import { init } from 'echarts'
import historyData from '../data.json'
defineProps({
  width: Number,
  height: Number
})
onMounted(() => {
  // 获取dom，断言HTMLElement类型，否则会报错
  const chartEle: HTMLElement = document.getElementById('blue-chart') as HTMLElement;
  const chart = init(chartEle);
  const series = []
  for (let historyDataKey in historyData) {
    series.push({
      name: historyDataKey,
      type: 'line',
      label: {
        show: true,
        position: 'top'
      },
      data: historyData[historyDataKey]
    })
  }
  console.log(series)
  chart.setOption({
    title: {
      text: '趋势图'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: Object.keys(historyData)
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    toolbox: {
      feature: {
        saveAsImage: {}
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['1', '2', '3', '4', '5', '6', '7']
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        show: true
      },
      interval: 1
    },
    series: series
  });
})
</script>

<style scoped>

</style>
