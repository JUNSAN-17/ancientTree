<template>
  <img id="back" src="../../assets/imgs/bg.png" />
  <div id="maper"></div>
  <img id="head" src="../../assets/imgs/top.png" />
  <h1 id="title">南京市古树名木智慧大屏</h1>
  <div id="sysTime">{{ currentTime }}</div>
  <div id="sysDate">{{ currentDate }}</div>
  <img id="clickBtn" src="/images/button.png" alt="image" @click="goToMapShow" />
  <div id="inner1"></div>
  <div id="inner2"></div>
  <div id="inner3"></div>
  <div id="inner4"></div>
  <div id="address">
    <div class="xzq-name" @click="addLayers">
      <strong>{{ province }}</strong>
    </div>
    <div v-show="city != ''"><strong>></strong></div>
    <div class="xzq-name">
      <strong>{{ city }}</strong>
    </div>
  </div>
  <img id="left1" src="../../assets/imgs/ccc.png" />
  <img id="left2" src="../../assets/imgs/ccc.png" />
  <img id="left3" src="../../assets/imgs/ccc.png" />
  <img id="left4" src="../../assets/imgs/ccc.png" />
</template>
<style scoped>
#sysTime,
#sysDate {
  /* width: 100%; */
  height: 50px;
  position: absolute;
  color: white;
  z-index: 10;
  display: flex;
  font-size: 28px;
  top: 46px;
  left: 100px;
}

#sysDate {
  font-size: 18px;
  top: 85px;
  left: 69px
}

#clickBtn {
  position: absolute;
  z-index: 10;
  top: 46px;
  right: 30px;
  height: 60px
}

#maper {
  width: 100%;
  height: 100vh;
  top: 0;
  left: 0;
  position: absolute;
  z-index: 2;
}

#address {
  width: 180px;
  height: 45px;
  position: absolute;
  top: 200px;
  left: 500px;
  cursor: pointer;
  color: white;
  z-index: 500;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}

#back {
  width: 100%;
  height: 100vh;
  top: 0;
  left: 0;
  z-index: 1;
  position: absolute;
}


#head {
  width: 100%;
  height: 100px;
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 10;
}

#title {
  width: 100%;
  height: 50px;
  position: absolute;
  color: white;
  left: 0px;
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 30px;
  top: 10px;
}

#left1 {
  width: 450px;
  height: 340px;
  position: absolute;
  left: 5px;
  top: 135px;
  z-index: 10;
}

#inner1 {
  width: 410px;
  height: 300px;
  position: absolute;
  left: 25px;
  top: 160px;
  z-index: 14;
  background: rgba(14, 180, 246, 0.2);
  backdrop-filter: saturate(180%) blur(20px);
}

#inner2 {
  width: 410px;
  height: 320px;
  position: absolute;
  left: 25px;
  top: 510px;
  z-index: 14;
  background: rgba(14, 180, 246, 0.2);
  backdrop-filter: saturate(180%) blur(20px);
}

#inner3 {
  width: 410px;
  height: 300px;
  position: absolute;
  right: 25px;
  top: 160px;
  z-index: 14;
  background: rgba(14, 180, 246, 0.2);
  backdrop-filter: saturate(180%) blur(20px);
}

#inner4 {
  width: 410px;
  height: 320px;
  position: absolute;
  right: 25px;
  top: 510px;
  z-index: 14;
  background: rgba(14, 180, 246, 0.2);
  backdrop-filter: saturate(180%) blur(20px);
}

#left2 {
  width: 450px;
  height: 360px;
  position: absolute;
  left: 5px;
  top: 490px;
  z-index: 10;
}

#left3 {
  width: 450px;
  height: 340px;
  position: absolute;
  right: 5px;
  top: 135px;
  z-index: 10;
}

#left4 {
  width: 450px;
  height: 360px;
  position: absolute;
  right: 5px;
  top: 490px;
  z-index: 10;
}
</style>
<script setup>
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import * as turf from "turf";
import { require } from "../../utils/require";
import { onMounted, ref,watch  } from "vue";
import { useRouter } from 'vue-router';
import axios from "axios";
import * as echarts from "echarts";
let map = null;
let province = ref("南京市");
let city = ref("");
let treeData = ref({});
let currentTime = ref("");
let currentDate = ref("");
//存放所有的弹窗对象
let popups = [];
//定时器id
let intval = null;
onMounted(() => {
  init();
  fetchData();
  map.on("load", (e) => {
    addLayers();
    goNext();
    
  });

  setInterval(updateTime, 1000);
});

// 计算每个责任区出现的次数
const fetchData = async () => {
  try {
    const response = await axios.get('http://localhost:4000/allTree');  // 调用后端接口
    const data = response.data;
    // 更新 treeData 的统计结果
    treeData.value = data.reduce((acc, item) => {
      const responsibi = item.responsibi;
      if (responsibi) {
        acc[responsibi] = (acc[responsibi] || 0) + 1;
      }
      return acc;
    }, {});
  } catch (error) {
    console.error('数据加载失败', error);
  }
};

watch(treeData, (newValue) => {
  if (Object.keys(newValue).length > 0) {
    initCharts(newValue);  // 确保传入最新的数据
  }
});

const router = useRouter();
// 跳转到 mapShow 路由
const goToMapShow = () => {
  router.push('/main/userStatistics');
};
//设置系统时间
const updateTime = () => {
  const now = new Date();
  // 获取星期几
  const daysOfWeek = ["日", "一", "二", "三", "四", "五", "六"];
  const weekDay = daysOfWeek[now.getDay()];
  // 格式化时间
  const time = now.toLocaleTimeString();
  // 格式化日期为：年-月-日
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // 月份从0开始，需加1
  const day = now.getDate();
  const date = `${year}年${month}月${day}日`;

  currentDate.value = `${date} 星期${weekDay}`;
  currentTime.value = time
};

// 初始化图表
function initCharts() {
  const data = treeData.value;
  const areas = Object.keys(data);  // 获取所有的区域名称
  const counts = Object.values(data);

  // Chart1
  const myChart1 = echarts.init(inner1);

  myChart1.setOption({
    title: {
      text: '古树名木统计',
      left: '10px',
      top: "10px",
      textStyle: {
        color: '#fff',
        fontSize: 20,
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)' // 显示百分比
    },
    legend: {
      orient: 'vertical',
      right: '0px',
      top: "115px",
      itemGap: 50,
      formatter: function (name) {
        // 在每个图例项后面添加额外文字
        if (name === '散生古树名木') {
          return name + ' （1000株）';
        } else if (name === '古树群') {
          return name + ' （1222株）';
        }
        return name;
      },
      textStyle: {
        color: '#fff', // 设置图例文字颜色
      }
    },
    series: [
      {
        name: '古树名木数量',
        type: 'pie',
        radius: ['40%', '60%'], // 空心效果
        center: ['30%', '55%'],
        label: {
          normal: {
            show: false, // 显示标签
            position: 'outside',
            formatter: '{b}: {c} ({d}%)', // 标签格式
            textStyle: {
              color: '#fff', // 设置标签文字颜色
            }
          }
        },
        data: [
          { value: 1000, name: '散生古树名木', itemStyle: { color: 'rgb(237, 116, 121)' } },  // 散生古树名木1000株
          { value: 1222, name: '古树群', itemStyle: { color: 'rgb(37, 233 , 184)' } }         // 古树群1222株
        ]
      }
    ]
  });


  const myChart2 = echarts.init(inner2);

const maxLength = 4;  // 设置最大字符长度为 4

// 截取每个区域名称，只保留前四个字符
const truncatedAreas = areas.map(area => area.length > maxLength ? area.slice(0, maxLength) : area);
console.log(truncatedAreas);


myChart2.setOption({
  title: {
    text: '责任区古树名木数量统计',
    left:"center",
    textStyle: {
      color: '#fff', 
      
    }
  },
  tooltip: {
    textStyle: {
      color: '',  // 提示框的文字颜色设置为白色
    }
  },
  grid: {
    top: '10%',  // 图表顶部间距
    bottom: '7%',  // 图表底部间距，增加空间显示标签
    left: '19%',  // 图表左侧间距，增加空间显示标签
    right: '10%'  // 图表右侧间距
  },
  xAxis: {
    type: 'value',
    axisLine: {
      show: false  // 隐藏x轴的坐标轴线
    },
    axisLabel: {
      textStyle: {
        color: '#fff'  // 横轴的数字和标签设置为白色
      }
    },
    splitLine: {
      show: false  // 隐藏x轴的网格线
    }
  },
  yAxis: {
    type: 'category',
    data: truncatedAreas,  // 使用截断后的区域名称
    axisLine: {
      show: false  // 隐藏y轴的坐标轴线
    },
    axisLabel: {
      textStyle: {
        color: '#fff',  // 纵轴的类别名称设置为白色
        fontSize: 14  // 增加字体大小，避免过小无法显示
      },
      rotate: 0,  // 禁用标签旋转，确保标签不会被截断
      interval: 0  // 强制显示所有标签
    },
    splitLine: {
      show: false  // 隐藏y轴的网格线
    }
  },
  series: [{
    name: 'Sales',
    type: 'bar',  // 条状图
    data: counts,
    itemStyle: {
      color: '#ff7f50'  // 保持条状图的颜色不变
    },
    label: {
      show: true,  // 显示数据标签
      position: 'right',  // 标签位置在条形图右边
      textStyle: {
        color: '#fff',  // 标签文字颜色设置为白色
        fontSize: 12  // 标签文字大小
      },
      formatter: '{c}'  // 显示每个条状图的数值
    },
    barCategoryGap: '60%',  // 增大条形图之间的间距
    barGap: '10%'  // 增加条形图之间的间隔
  }]
});






  // Chart4
  const myChart4 = echarts.init(inner4);
  myChart4.setOption({
    title: { text: 'Chart 4' },
    tooltip: {},
    series: [{
      name: 'Pie Chart',
      type: 'pie',
      data: [
        { value: 400, name: 'A' },
        { value: 335, name: 'B' },
        { value: 310, name: 'C' },
        { value: 234, name: 'D' },
        { value: 135, name: 'E' }
      ]
    }]
  });

  //Chart3
  // const wealtherApi = 'gq6zvUWgqIw0C7CA'
  // 获取数据
  axios.get('http://localhost:4000/weather-api/v2.6/' + wealtherApi + '/118.79665603476823,32.05941383461646/hourly?hourlysteps=6')
    .then(response => {
      const data = response.data.result.hourly;

      // 处理数据
      const timeData = data.humidity.map(item => {
        // 提取小时部分，格式为 'HH'
        const date = new Date(item.datetime);
        const hours = date.getHours();  // 获取小时
        return `${hours}:00`;  // 格式化为 '小时:00'
      });

      const humidityData = data.humidity.map(item => item.value);  // 获取湿度值
      const temperatureData = data.temperature.map(item => item.value);  // 获取温度值

      // 初始化 ECharts
      const myChart3 = echarts.init(document.getElementById('inner3'));

      const option = {
        title: {
          text: '天气数据可视化',
          left: 'center',
          top: '10px',
          textStyle: {
            color: '#ffffff',  // 所有标题文字变成白色
          },
        },
        tooltip: {
          trigger: 'axis',

        },
        legend: {
          data: ['温度 (°C)', '湿度 (%)'],
          top: "40px",
          textStyle: {
            color: '#ffffff'  // 图例文字变成白色
          },
        },
        grid: {
          top: "80px"
        },
        xAxis: {
          type: 'category',
          data: timeData,
          axisLabel: {
            textStyle: {
              color: '#ffffff'  // 横坐标文字变成白色
            },
            rotate: 45,  // 旋转坐标轴标签，避免重叠
            interval: 0 // 控制显示的间隔
          },
          axisLine: {
            lineStyle: {
              color: '#ffffff'  // 横坐标轴线变成白色
            }
          },

        },
        yAxis: [
          {
            type: 'value',
            name: '温度 (°C)',
            min: Math.floor(Math.min(...temperatureData)) - 1,  // 向下取整
            max: Math.ceil(Math.max(...temperatureData)) + 1,  // 向上取整
            axisLabel: {
              textStyle: {
                color: '#ffffff'  // 左侧纵坐标文字变成白色
              },
              formatter: '{value} °C'
            },
            axisLine: {
              lineStyle: {
                color: '#ffffff'  // 左侧纵坐标轴线变成白色
              }
            }
          },
          {
            type: 'value',
            name: '湿度 (%)',
            min: Math.floor(Math.min(...humidityData)) - 1,  // 向下取整
            max: Math.ceil(Math.max(...humidityData)) + 1,  // 向上取整
            axisLabel: {
              textStyle: {
                color: '#ffffff'  // 右侧纵坐标文字变成白色
              },
              formatter: '{value} %'
            },
            position: 'right',
            axisLine: {
              lineStyle: {
                color: '#ffffff'  // 右侧纵坐标轴线变成白色
              }
            }
          }
        ],
        series: [
          {
            name: '温度 (°C)',
            type: 'line',
            data: temperatureData,
            smooth: true,  // 曲线平滑
            itemStyle: {
              color: '#ff7f50'  // 温度折线颜色保持不变
            },
            lineStyle: {
              color: '#ff7f50'  // 温度折线颜色保持不变
            }
          },
          {
            name: '湿度 (%)',
            type: 'line',
            yAxisIndex: 1,  // 关联到右侧的纵坐标
            data: humidityData,
            smooth: true,
            itemStyle: {
              color: '#87cefa'  // 湿度折线颜色保持不变
            },
            lineStyle: {
              color: '#87cefa'  // 湿度折线颜色保持不变
            }
          }
        ]
      };

      // 设置图表选项
      myChart3.setOption(option);
    })
    .catch(error => {
      console.error('API 请求失败:', error);
    });
}


const token = 'pk.eyJ1IjoiMTMxNjczNzc1OCIsImEiOiJjbHFtZHIxYTUyem9oMnJtaHp4aTJ2NDRlIn0.09tiCR8kV4_0xZFRm_41iw'
//初始化方法构建mapbox
function init() {
  mapboxgl.accessToken = token;
  map = new mapboxgl.Map({
    container: "maper",
    center: [118.79665603476823, 32.05941383461646],
    zoom: 8.3,
    maxZoom: 10,
    minZoom: 6.5,
    style: {
      version: 8,
      sources: {},
      glyphs: "mapbox://fonts/mapbox/{fontstack}/{range}.pbf",
      layers: [
        {
          id: "back",
          type: "background",
          paint: {
            "background-opacity": 0,
          },
          layout: {
            visibility: "visible",
          },
        },
      ],
    },
  });
}
//添加图层数据
async function addLayers() {
  city.value = "";
  clearInterval(intval);
  removePoint();
  removePopup();
  removeCounty();
  //注意加载图层的操作必须发生在地图load完成之后
  const cityData = await getData("/nj.json");
  const city_center = await getData("/city_center.json");
  //先获取到各城市土壤检测点总数，根据数量渲染颜色
  const count = await getData("/count.json");
  //先必须把各城市的统计数据和行政区划数据做一个绑定，否则无法从properties里取数据
  const result = attach(count, cityData);
  const city_count = attach(count, city_center);
  map.addSource("province", { type: "geojson", data: result });
  //添加填充颜色
  map.addLayer({
    id: "province-fill",
    type: "fill",
    source: "province",
    paint: {
      "fill-color": [
        "step",
        ["get", "count"],
        "#0c97c1",
        10,
        "#22bdeb",
        20,
        "#26b0eb",
        30,
        "#45baff",
        40,
        "#43a8ff",
        50,
        "#3d94ff",
        60,
        "#3c7eff",
        70,
        "#3b5bff",
        100,
        "#0600b7",
      ],
    },
  });
  //添加边界线颜色
  map.addLayer({
    id: "province-line",
    type: "line",
    source: "province",
    paint: { "line-color": "white", "line-width": 1 },
  });
  //添加各行政区的名字
  const names = await getData("/city_center.json");
  map.addSource("province-names", { type: "geojson", data: names });
  map.addLayer({
    id: "province-names",
    type: "symbol",
    source: "province-names",
    paint: { "text-color": "white" },
    layout: { "text-field": "{name}", "text-allow-overlap": true },
  });
  //添加统计数量图标
  map.loadImage(require("@/assets/imgs/count.png"), (error, image) => {
    if (error) return;
    map.addImage("count", image);
    map.addSource("province-count", {
      type: "geojson",
      data: city_count,
    });
    map.addLayer({
      id: "province-count",
      type: "symbol",
      source: "province-count",
      paint: { "text-color": "white" },
      layout: {
        "icon-image": "count",
        "icon-size": 1.2,
        "icon-offset": [0, -20],
        "text-field": "{count}",
        "text-offset": [0, -2],
        "icon-allow-overlap": true,
      },
    });
  });

  // 聚焦到行政区
  fit(result);
}
//添加业务数据，包括土壤点位总数统计，以及具体的点位和展示
async function addBussinessData() {
  map.setPaintProperty("province-fill", "fill-color", [
    "step",
    ["get", "count"],
    "#0c97c1",
    10,
    "#0086d4",
    20,
    "#009bd5",
    30,
    "#0178a4",
    40,
    "#044cf5",
    50,
    "#092cd3",
    60,
    "#072097",
    70,
    "#051a7c",
    100,
    "#05166b",
  ]);
}
//下钻逻辑
function goNext() {
  map.on("click", "province-fill", async (e) => {
    //获取用户点击的城市要素
    const code = e.features[0].properties.adcode.toString();
    city.value = e.features[0].properties.name;
    //正常这里应该去请求对应的行政区数据，在这里我用静态数据过滤来代替请求
    var countys = await getData("/zjcounty.json");
    let currentCounty = countys.features.filter(
      (f) => f.properties.adcode.toString() === code
    );

    //清除上一次加载的图层
    if (currentCounty.length) {
      map.removeLayer("province-line");
      map.removeLayer("province-fill");
      map.removeLayer("province-names");
      map.removeLayer("province-count");
      map.removeSource("province");
      map.removeSource("province-names");
      map.removeSource("province-count");
      map.removeImage("count");
    }
    //清除上一次加载的图层
    removeCounty();
    //清除上一次加载的图层
    removePoint();
    //加载区县级别的行政区
    map.addSource("county", {
      type: "geojson",
      data: { type: "FeatureCollection", features: currentCounty },
    });
    map.addLayer({
      id: "county",
      type: "fill",
      source: "county",
      paint: { "fill-color": "#45baff" },
    });
    map.addLayer({
      id: "county-line",
      type: "line",
      source: "county",
      paint: { "line-color": "white" },
    });
    map.addLayer({
      id: "county-name",
      type: "symbol",
      source: "county",
      paint: { "text-color": "white" },
      layout: { "text-field": "{name}" },
    });
    fit({ type: "FeatureCollection", features: currentCounty });
    //添加具体城市的土壤检测点，目前只有杭州市有示例数据，但是我们逻辑还是按照所有城市都有数据的逻辑在做
    const points = await getData("/point.json");
    const currentPoint = points.filter((f) => f.adcode === code)[0];
    const pointData = convert(currentPoint.points);

    map.addSource("poi", { type: "geojson", data: pointData });
    map.addLayer({
      id: "poi-out",
      type: "circle",
      source: "poi",
      paint: {
        "circle-radius": 8,
        "circle-stroke-color": "yellow",
        "circle-stroke-width": 1,
        "circle-color": "transparent",
      },
    });
    map.addLayer({
      id: "poi",
      type: "circle",
      source: "poi",
      paint: { "circle-radius": 6, "circle-color": "yellow" },
    });
    turn(pointData);
    map.on("mouseover", "poi", (e) => {
      const description =
        "<div>监测点名称：" +
        e.features[0].properties["point_name"] +
        "</div>" +
        "<div>监测点级别：" +
        e.features[0].properties.level +
        "</div>";
      const popup = new mapboxgl.Popup()
        .setLngLat(e.features[0].geometry.coordinates)
        .setHTML(description)
        .addTo(map);
      popups.push(popup);
    });
    map.on("mouseleave", "poi", () => {
      removePopup();
    });
  });
}
//定位至某要素
function fit(feature) {
  const bbox = turf.bbox(feature);
  //正常按照这个边界去定位会使得图层被过度放大，因此可以增加一个buffer调整大小和上下左右偏移
  //buffer的顺序为最小经度调整量，最小纬度调整量，最大经度调整量，最大纬度调整量
  const buffer = [0.5, 0.3, 0.6, 0.5];
  const extent = [
    bbox[0] - buffer[0],
    bbox[1] - buffer[1],
    bbox[2] + buffer[2],
    bbox[3] + buffer[3],
  ];
  map.fitBounds(extent);
}
//清除点位图层
function removePoint() {
  if (map.getLayer("poi")) {
    map.removeLayer("poi");
    map.removeLayer("poi-out");
    map.removeSource("poi");
  }
}
//清除区县数据
function removeCounty() {
  if (map.getLayer("county")) {
    map.removeLayer("county");
    map.removeLayer("county-line");
    map.removeLayer("county-name");
    map.removeSource("county");
  }
}

//清除所有弹窗
function removePopup() {
  popups.forEach((p) => {
    p.remove();
  });
}
//json数据转geojson
function convert(json) {
  const collection = { type: "FeatureCollection", features: [] };
  json.forEach((f) => {
    collection.features.push({
      type: "Feature",
      properties: { ...f },
      geometry: { type: "Point", coordinates: f.lnglat },
    });
  });
  return collection;
}
//轮播函数，将需要轮播的数据传入，调用以实现轮播
function turn(data) {
  //第一次直接播放
  const description =
    "<div>监测点名称：" +
    data.features[0].properties["point_name"] +
    "</div>" +
    "<div>监测点级别：" +
    data.features[0].properties.level +
    "</div>";
  const popup = new mapboxgl.Popup()
    .setLngLat(data.features[0].geometry.coordinates)
    .setHTML(description)
    .addTo(map);
  popups.push(popup);
  let i = 1;
  //采用interval的方式，每隔3秒循环播放下一个监测点信息
  intval = setInterval(() => {
    removePopup();
    if (i < data.features.length - 1) {
      i++;
    } else {
      i = 1;
    }
    const description =
      "<div>监测点名称：" +
      data.features[i].properties["point_name"] +
      "</div>" +
      "<div>监测点级别：" +
      data.features[i].properties.level +
      "</div>";
    const popup = new mapboxgl.Popup()
      .setLngLat(data.features[i].geometry.coordinates)
      .setHTML(description)
      .addTo(map);
    popups.push(popup);
  }, 3000);
}
//将普通的点位、或者统计类的json数据附加到行政区划数据上
function attach(count, province) {
  for (let i = 0; i < province.features.length; i++) {
    for (let j = 0; j < count.length; j++) {
      if (
        province.features[i].properties.adcode.toString() === count[j].adcode
      ) {
        province.features[i].properties.count = count[j].count;
      }
    }
  }
  return province;
}
// 请求数据
async function getData(url) {
  let result = await axios.get(url);
  return result.data;
};

</script>