<template>
  <img id="back" src="../../assets/imgs/bg.png" />
  <div id="maper"></div>
  <img id="head" src="../../assets/imgs/top.png" />
  <h1 id="title">南京市古树名木智慧大屏</h1>
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
  top: 0px;
  left: 0px;
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 30px;
  display: flex;
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
  height: 300px;
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
  height: 300px;
  position: absolute;
  right: 25px;
  top: 510px;
  z-index: 14;
  background: rgba(14, 180, 246, 0.2);
  backdrop-filter: saturate(180%) blur(20px);
}

#left2 {
  width: 450px;
  height: 340px;
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
  height: 340px;
  position: absolute;
  right: 5px;
  top: 490px;
  z-index: 10;
}

.mapboxgl-popup-content {
  border: 1px solid rgb(4, 216, 249) !important;
  background: rgba(18, 82, 244, 0.5) !important;
  color: white !important;
  border-radius: 10px !important;
}

.mapboxgl-popup-close-button {
  color: white !important;
}
</style>
<script setup>
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import * as turf from "turf";
import { require } from "../../utils/require";
import { onMounted, ref } from "vue";
import axios from "axios";
let map = null;
let province = ref("浙江省");
let city = ref("");
//存放所有的弹窗对象
let popups = [];
//定时器id
let intval = null;
onMounted(() => {
  init();
  map.on("load", (e) => {
    addLayers();
    goNext();
  });
});
const token = 'pk.eyJ1IjoiMTMxNjczNzc1OCIsImEiOiJjbHFtZHIxYTUyem9oMnJtaHp4aTJ2NDRlIn0.09tiCR8kV4_0xZFRm_41iw'
//初始化方法构建mapbox
function init() {
  mapboxgl.accessToken = token;
  map = new mapboxgl.Map({
    container: "maper",
    center: [120.536363, 29.243242],
    zoom: 8,
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
  const provinceData = await getData("/zj.json");
  const city_center = await getData("/city_center.json");
  //先获取到各城市土壤检测点总数，根据数量渲染颜色
  const count = await getData("/count.json");
  //先必须把各城市的统计数据和行政区划数据做一个绑定，否则无法从properties里取数据
  const result = attach(count, provinceData);
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

  //聚焦到行政区
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
      (f) => f.properties.code.substring(0, 4) === code.substring(0, 4)
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
      layout: { "text-field": "{Name}" },
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
  const buffer = [0.5, 0.3, 0.5, 0.8];
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
}
</script>