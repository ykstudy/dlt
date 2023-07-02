<template>
<div class="echarts-box">
  <el-row>
    <el-col :span="12">
      <div id="end-chart" :style="{width: '800px', height: '1200px'}"></div>
    </el-col>
    <el-col :span="12">
      <div id="front-chart" :style="{width: '600px', height: '1200px'}"></div>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="12">
      <div id="prob-front-chart" :style="{width: '800px', height: '600px'}"></div>
    </el-col>
    <el-col :span="12">
      <div id="prob-end-chart" :style="{width: '800px', height: '600px'}"></div>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="12" >
      <el-row v-for="k of Object.keys(frontDict)" :key="k" :class="probClassCheck(frontDict[k].sliceProb)">
        {{k}} - {{frontDict[k].times}} - {{frontDict[k].prob}} - {{frontDict[k].sliceProb?.join(' ')}} - {{frontPriorityDict[k]}}
      </el-row>
      <!-- 前times次没有出现的数字 -->
      <el-row style="margin-top: 20px">
        {{notAppear('front', 5)?.join(' ')}}
      </el-row>
    </el-col>
    <el-col :span="12" >
      <el-row v-for="k of Object.keys(endDict)" :key="k" :class="probClassCheck(endDict[k])">
        {{k}} - {{endDict[k]?.join(' ')}} - {{endPriorityDict[k]}}
      </el-row>
      <!-- 前times次没有出现的数字 -->
      <el-row style="margin-top: 20px">
        {{notAppear('end', 5)?.join(' ')}}
      </el-row>
    </el-col>
  </el-row>
</div>
</template>

<script setup lang="ts">
import {onMounted, defineProps, reactive} from 'vue'
import { init } from 'echarts'
import historyData from '../data.json'
import {getDltHistoryPageList} from "../api/common";
defineProps({
  width: Number,
  height: Number
})
const keys = Object.keys(historyData)
const frontSliceArr = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
const endSliceArr = [10, 20, 40, 70, 100]
const frontLen = 6
const frontArea = 35
const frontArr = []
let frontDict = reactive({})
let frontPriorityDict = reactive({})

const endLen = 1
const endArea = 12
const endArr = []
let endDict = reactive({})
let endPriorityDict = reactive({})
function notAppear(area: string, times: number) {
  const arr = keys.slice(keys.length - times, keys.length)
  const notAppear = []
  let notAppearArea = 0
  if (area === 'front') {
    notAppearArea = frontArea
  } else if (area === 'end') {
    notAppearArea = endArea
  }
  for (let i = 1; i <= notAppearArea; i++) {
    notAppear.push(i)
  }
  for (const key of arr) {
    let slice = []
    if (area === 'front') {
      slice = historyData[key].slice(0, 5)
    } else if (area === 'end') {
      slice = historyData[key].slice(5, 7)
    }
    for (const h of slice) {
      if (notAppear.indexOf(h) >= 0) {
        notAppear.splice(notAppear.indexOf(h), 1)
      }
    }
  }
  return notAppear
}
function probClassCheck(arr: Array<number>) {
  if (arr.length == 0) {
    return "";
  }
  let sum = 0
  for (const n of arr) {
    sum += n
  }
  if (arr[0] < sum / arr.length) {
    return "recommend"
  }
  return ""
}
onMounted(async () => {
  // const res = await getDltHistoryPageList()
  // let historyList = []
  // let historyData = {}
  // if (res.status === 200) {
  //   historyList = res.data.value.list
  // }
  // for (const h of historyList) {
  //   historyData[h.lotteryDrawNum] = h.lotteryDrawResult.split(' ')
  // }
  // 获取dom，断言HTMLElement类型，否则会报错
  const endChartEle: HTMLElement = document.getElementById('end-chart') as HTMLElement;
  const frontChartEle: HTMLElement = document.getElementById('front-chart') as HTMLElement;
  const endChart = init(endChartEle);
  const frontChart = init(frontChartEle);
  const endSeries = []
  const frontSeries = []
  const keys = Object.keys(historyData)
  for (let key of keys.slice(40)) {
    endSeries.push({
      name: key,
      type: 'line',
      label: {
        show: true,
        position: 'center'
      },
      data: historyData[key].slice(0, 5)
    })
    frontSeries.push({
      name: key,
      type: 'line',
      label: {
        show: true,
        position: 'center'
      },
      data: historyData[key].slice(5, 7)
    })
  }
  endChart.setOption({
    title: {
      text: '趋势图'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: keys.slice(40),
      height: 200
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
      data: ['1', '2', '3', '4', '5']
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        show: true
      },
      interval: 1
    },
    series: endSeries
  });
  frontChart.setOption({
    title: {
      text: '趋势图'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: keys.slice(40),
      height: 200
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
      data: ['1', '2']
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        show: true
      },
      interval: 1
    },
    series: frontSeries
  });
  prob()
  priority()
  probFrontChart()
  probEndChart()
})
for (let i = 1; i <= endArea; i++) {
  endArr.push(i)
}
for (let i = 1; i <= frontArea; i++) {
  frontArr.push(i)
}

function prob() {
  const len = keys.length
  for (const r of frontArr) {
    let sliceRArr = []
    let sum = 0
    for (const s of frontSliceArr) {
      let bs = 0
      for (const key of keys.slice(len - s, len)) {
        if (historyData[key].slice(0, 5).indexOf(r) >= 0) {
          bs++
        }
      }
      sliceRArr.push(parseFloat((bs * 100 / s).toFixed(1)))
    }
    for (const key of keys) {
      if (historyData[key].slice(0, 5).indexOf(r) >= 0) {
        sum++
      }
    }
    frontDict[r] = {
      times: sum,
      prob: parseFloat((sum * 100 / len).toFixed(1)),
      sliceProb: sliceRArr
    }
  }
  for (const b of endArr) {
    let sliceBArr = []
    for (const s of endSliceArr) {
      let bs = 0
      for (const key of keys.slice(len - s, len)) {
        if (historyData[key].slice(5, 7).indexOf(b) >= 0) {
          bs++
        }
      }
      sliceBArr.push(parseFloat((bs * 100 / s).toFixed(1)))
    }
    endDict[b] = sliceBArr
  }
}

function priority() {
  const frontKeys = Object.keys(frontDict)
  for (const n of frontKeys) {
    let sum = 0
    for (const p of frontDict[n].sliceProb) {
      sum += p
    }
    if (frontDict[n].sliceProb[0] < sum / frontDict[n].sliceProb.length) {
      frontPriorityDict[n] = ((sum / frontDict[n].sliceProb.length - frontDict[n].sliceProb[0]) / (sum / frontDict[n].sliceProb.length)).toFixed(2)
    }
  }
  const endKeys = Object.keys(endDict)
  for (const n of endKeys) {
    let sum = 0
    for (const p of endDict[n]) {
      sum += p
    }
    if (endDict[n][0] < sum / endDict[n].length) {
      endPriorityDict[n] = ((sum / endDict[n].length - endDict[n][0]) / (sum / endDict[n].length)).toFixed(2)
    }
  }
}
function probFrontChart() {
  const probFrontChartEle: HTMLElement = document.getElementById('prob-front-chart') as HTMLElement;
  const chart = init(probFrontChartEle);
  const frontSeries = []
  for (let key in frontDict) {
    frontSeries.push({
      name: key,
      type: 'line',
      label: {
        show: true,
        position: 'center'
      },
      data: frontDict[key].sliceProb
    })
  }
  chart.setOption({
    title: {
      text: '趋势图'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: Object.keys(frontDict),
      height: 200
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
      data: frontSliceArr
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        show: true
      },
      interval: 1
    },
    series: frontSeries
  });
}

function probEndChart() {
  const probEndChartEle: HTMLElement = document.getElementById('prob-end-chart') as HTMLElement;
  const chart = init(probEndChartEle);
  const endSeries = []
  for (let key in endDict) {
    endSeries.push({
      name: key,
      type: 'line',
      label: {
        show: true,
        position: 'center'
      },
      data: endDict[key]
    })
  }
  chart.setOption({
    title: {
      text: '趋势图'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: Object.keys(endDict),
      height: 200
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
      data: endSliceArr
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        show: true
      },
      interval: 1
    },
    series: endSeries
  });
}
</script>

<style scoped>

.recommend {
  color: aqua;
}
</style>
