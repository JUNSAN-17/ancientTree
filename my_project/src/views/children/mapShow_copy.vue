<script>
// mapboxgl 相关文件的导入
import mapboxgl from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
import axios from "axios";

mapboxgl.accessToken =
  'pk.eyJ1IjoiMTMxNjczNzc1OCIsImEiOiJjbHFtZHIxYTUyem9oMnJtaHp4aTJ2NDRlIn0.09tiCR8kV4_0xZFRm_41iw';

let map;
let currentMarker;
let currentPopup;
let markers = [];
export default {
  data() {
    return {
      input: "",
      value: '',
      wfsTree: "",
      njdemo: "",
      isTrue: true,
      markerShow: false,
      lng: "",
      lat: "",
      drawer: false, // 控制 `el-drawer` 显示
      userAddress: "", // 用户输入的起点地址
      userLngLat: null, // 起点经纬度
      destinationLngLat: null, // 终点经纬度
      map: null, // 高德地图实例
      convertedCoordinates: "",
      showMap: false,
    };
  },
  mounted() {
    const sources = {
      "satellite-tiles": {
        "type": "raster",
        "tiles": ["http://t0.tianditu.gov.cn/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=fd9b52461875f08212b5446b4eeef167"],
        // "tiles": ["http://t4.tianditu.gov.cn/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=fd9b52461875f08212b5446b4eeef167"],
        // "tiles": ["http://t4.tianditu.gov.cn/DataServer?T=cia_w&x={x}&y={y}&l={z}&tk=fd9b52461875f08212b5446b4eeef167"],

        "tileSize": 256,
      },
      "street-tiles": {
        "type": "raster",
        "tiles": ["http://t4.tianditu.gov.cn/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=fd9b52461875f08212b5446b4eeef167"],
        "tileSize": 256,
      }
    }
    const layers = [
      {
        "id": "satellite",
        "type": "raster",
        "source": "satellite-tiles",
        "layout": {
          "visibility": "visible"
        }
      },
      {
        "id": "street",
        "type": "raster",
        "source": "street-tiles",
        "layout": {
          "visibility": "none"
        }
      },

    ]
    map = new mapboxgl.Map({
      container: 'map', // container ID
      center: [118.79665603476823, 32.05941383461646], // starting position [lng, lat]
      zoom: 10, // starting zoom
      attributionControl: false,
      minZoom: 8,
      maxZoom: 17,
      bounds: [[119.23657837, 32.61218107], [118.35377162, 31.23060178]],
      style: {
        "version": 8,
        "sources": sources,
        "layers": layers,
        "glyphs": "mapbox://fonts/mapbox/{fontstack}/{range}.pbf",
      }
    });

    this.init();
  },
  methods: {
    toggleMap() {
      this.showMap = !this.showMap;
      if (this.showMap) {
        this.initMap();  // 如果地图显示，则初始化地图
      }
    },
    // **1️⃣ 初始化地图**
    initMap() {
      if (this.map || !this.showMap) return; // 防止重复初始化和确保显示时才初始化地图
      this.map = new AMap.Map("amap-container", {
        resizeEnable: true,
        zoom: 13,
      });
      console.log('地图已初始化');
    },


    // **2️⃣ 触发导航**
    openNavigation(lng, lat) {
      this.destinationLngLat = [lng, lat]; // 终点经纬度
      this.drawer = true; // 打开 `el-drawer`
    },

    // **3️⃣ 搜索用户输入的起点地址**
    async searchUserAddress() {
      if (!this.userAddress) {
        this.$message.error("请输入起点地址");
        return;
      }

      try {
        this.userLngLat = await this.getGeoLocation(this.userAddress);
        if (!this.userLngLat) {
          this.$message.error("起点地址解析失败");
          return;
        }

        console.log("✅ 起点:", this.userLngLat);
        console.log("✅ 终点:", this.destinationLngLat);

        this.calculateRoute();
      } catch (error) {
        console.error("❌ 起点地址解析失败:", error);
        this.$message.error("地址解析失败，请检查输入");
      }
    },

    // **4️⃣ 获取地址的经纬度**
    getGeoLocation(address) {
      return new Promise((resolve, reject) => {
        AMap.plugin("AMap.Geocoder", () => {
          let geocoder = new AMap.Geocoder();
          geocoder.getLocation(address, (status, result) => {
            if (status === "complete" && result.geocodes.length > 0) {
              resolve([result.geocodes[0].location.lng, result.geocodes[0].location.lat]);
            } else {
              reject("地址解析失败");
            }
          });
        });
      });
    },

    // **5️⃣ 计算路线**
    calculateRoute() {
      AMap.plugin("AMap.Driving", () => {
        let driving = new AMap.Driving({
          policy: 0, // 速度优先
          map: this.map,
          panel: "panel",
        });

        console.log("🚀 查询路线: 起点", this.userLngLat, "终点", this.destinationLngLat);

        driving.search(this.userLngLat, this.destinationLngLat, (status, result) => {
          if (status === "complete") {
            console.log("✅ 路线规划成功", result);
            this.$message({ message: "路线规划成功", type: "success" });
          } else {
            console.error("❌ 获取驾车数据失败:", result);
            this.$message.error("路线规划失败");
          }
        });
      });
    },

    // 搞一个click事件
    tishi(e) {
      // 先移除再添加
      marker.remove()
      marker = new mapboxgl.Marker({
        color: "orange",
        draggable: true
      }).setLngLat([e.lngLat.lng, e.lngLat.lat]).addTo(map);

      // 点击时显示坐标
      var lngLat = marker.getLngLat();
      coordinates.style.display = 'block';
      coordinates.innerHTML =
        '经度: ' + lngLat.lng + '<br />纬度: ' + lngLat.lat;
      // 搞一个拖拽事件
      function onDragEnd() {
        var lngLat = marker.getLngLat();
        coordinates.style.display = 'block';
        coordinates.innerHTML =
          '经度: ' + lngLat.lng + '<br />纬度: ' + lngLat.lat;
      }
      marker.on('dragend', onDragEnd);
    },
    // 添加坐标拾取功能
    addMarker() {
      // 设置鼠标为十字形
      map.getCanvas().style.cursor = 'crosshair';
      this.markerShow = !this.markerShow;

      // 监听地图点击事件，获取点击位置的经纬度
      const onClick = (e) => {
        const lngLat = e.lngLat; // 获取点击位置的经纬度
        coordinates.style.display = 'block';
        coordinates.innerHTML =
          '经度: ' + lngLat.lng + '<br />纬度: ' + lngLat.lat;

        console.log('点击位置：', lngLat.lng, lngLat.lat);

        // 在点击位置添加marker
        const marker = new mapboxgl.Marker({
          color: 'orange',
          draggable: true,
        })
          .setLngLat([lngLat.lng, lngLat.lat]) // 使用点击位置的经纬度
          .addTo(map);

        // 为每个marker创建唯一的标识符
        const markerId = `${lngLat.lng.toFixed(6)}_${lngLat.lat.toFixed(6)}`;

        // 存储marker到数组
        markers.push({
          id: markerId,
          marker: marker,
          lngLat: lngLat,
        });

        // 监听点击marker的事件，打开弹窗
        marker.getElement().addEventListener('click', () => {
          // 弹窗内容
          const formHTML = `
        <div class="popup-form">
          <table>
            <tr><td><label for="id">挂牌号</label></td><td><input type="text" id="id" name="id"/></td></tr>
            <tr><td><label for="name">树名</label></td><td><input type="number" id="age" name="age" /></td></tr>
            <tr><td><label for="field3">科属</label></td><td><input type="text" id="field3" name="field3" /></td></tr>
            <tr><td><label for="field4">区域</label></td><td><input type="text" id="field4" name="field4" /></td></tr>
            <tr><td><label for="field5">地址</label></td><td><input type="text" id="field5" name="field5" /></td></tr>
            <tr><td><label for="field6">树龄</label></td><td><input type="text" id="field6" name="field6" /></td></tr>
            <tr><td><label for="field7">胸围</label></td><td><input type="text" id="field7" name="field7" /></td></tr>
            <tr><td><label for="field8">冠幅</label></td><td><input type="text" id="field8" name="field8" /></td></tr>
            <tr><td><label for="field9">树高</label></td><td><input type="text" id="field9" name="field9" /></td></tr>
            <tr><td><label for="field10">等级</label></td><td><input type="text" id="field10" name="field10" /></td></tr>
            <tr><td><label for="field11">经纬度</label></td><td><input type="text" id="field11" name="field11" value="${lngLat.lng.toFixed(6)}, ${lngLat.lat.toFixed(6)}"/></td></tr>
          </table>

          <div class="popup-buttons">
            <div class="popup-buttons-left">
              <button id="submit-btn">确认</button>
              <button id="cancel-btn">取消</button>
            </div>  
            <div class="popup-buttons-right">
              <button id="del-btn">删除</button>
            </div>
          </div>          
        </div>
      `;

          // 创建并展示弹窗
          const popup = new mapboxgl.Popup({
            closeButton: true,
            closeOnClick: false,
          })
            .setLngLat([lngLat.lng, lngLat.lat])
            .setHTML(formHTML)
            .addTo(map);

          // 存储popup
          const markerIndex = markers.findIndex(item => item.id === markerId);
          markers[markerIndex].popup = popup;

          // 处理取消按钮
          const cancelBtn = document.getElementById("cancel-btn");
          if (cancelBtn) {
            cancelBtn.addEventListener("click", () => {
              this.cancelForm(markerId);  // 取消时移除当前marker和popup
            });
          }

          // 处理删除按钮
          const delBtn = document.getElementById('del-btn');
          if (delBtn) {
            delBtn.addEventListener('click', () => {
              this.removeMarker(markerId);  // 删除指定ID的marker
              this.cancelForm(markerId);  // 删除后关闭popup
            });
          }
        });

        // 处理拖拽结束时，打印新经纬度
        marker.on('dragend', () => {
          const lngLat = marker.getLngLat();
          coordinates.style.display = 'block';
          coordinates.innerHTML =
            '经度: ' + lngLat.lng + '<br />纬度: ' + lngLat.lat;
        });

        // 添加完marker后恢复鼠标样式为默认
        map.getCanvas().style.cursor = 'default';
        this.markerShow = !this.markerShow;

        // 取消地图点击事件监听
        map.off('click', onClick);
      };

      map.on('click', onClick);
    },

    // 取消表单时，移除对应的popup
    cancelForm(markerId) {
      const markerData = markers.find(item => item.id === markerId);
      if (markerData && markerData.popup) {
        markerData.popup.remove();  // 移除popup
      }
    },

    // 删除指定ID的marker和popup
    removeMarker(markerId) {
      const markerData = markers.find(item => item.id === markerId);
      if (markerData) {
        markerData.marker.remove();  // 删除marker
        markerData.popup.remove();   // 删除popup
        markers = markers.filter(item => item.id !== markerId);  // 从markers数组中删除
      }
    },
    // 切换图层
    changelayer() {
      this.isTrue = !this.isTrue
      const visible = this.isTrue ? 'none' : 'visible'
      map.setLayoutProperty('street', 'visibility', visible)
      if (!this.isTrue) {
        map.removeLayer("json-layer");
        map.removeLayer("json-line");
        map.removeLayer("json-text");
        map.removeSource("json-source");
        map.addSource('street-line',
          {
            "type": 'raster',
            "tiles": ["http://t4.tianditu.gov.cn/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=fd9b52461875f08212b5446b4eeef167"],
            "tileSize": 256,
          }
        )
        map.addLayer({
          "id": 'street-line',
          "type": 'raster',
          "source": 'street-line',
        })
      } else {
        axios({
          method: 'get',
          // url:'http://localhost:8080/geoserver/ne/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=ne%3Anjdemo&maxFeatures=50&outputFormat=application%2Fjson',
          url: 'http://localhost:8080/geoserver/ne/ows?',
          params: {
            'service': 'WFS',
            'version': '1.0.0',
            'request': 'GetFeature',
            'typeName': 'ne:njdemo',
            'outputFormat': 'application/json',
          },
        }).then((res) => {
          // console.log(res.data);
          const json = res.data
          this.njdemo = json
          map.addSource('json-source', { type: 'geojson', data: json })
          // 添加面要素
          map.addLayer({
            id: 'json-layer',
            type: 'fill',
            source: 'json-source',
            paint: {
              'fill-color': '#00FFD0',
              'fill-opacity': 0.1,
            }
          })
          // 添加线要素
          map.addLayer({
            id: 'json-line',
            type: 'line',
            source: 'json-source',
            paint: {
              'line-color': 'orange',
              'line-width': 2.5,
            }
          })
          // 添加文字要素
          map.addLayer({
            id: 'json-text',
            type: 'symbol',
            source: 'json-source',
            paint: {
              'text-color': 'orange',
            },
            layout: {
              'text-field': '{area}'
            }
          })
          map.removeLayer("street-line")
          map.removeSource("street-line")
        })
      }

    },
    // 初始化
    init() {
      map.on("load", () => {
        // 添加wms服务数据
        // map.addSource("wms-source", {
        //     type: "raster",
        //     tiles: [
        //         // "http://localhost:8080/geoserver/ne/wms?service=WMS&version=1.1.0&request=GetMap&layers=ne%3Ahangzhou&bbox={bbox-epsg-3857}&width=768&height=445&srs=EPSG%3A3857&styles=&format=image/png&transparent=true",
        //         'http://localhost:8080/geoserver/ne/wms?service=WMS&version=1.1.0&request=GetMap&layers=ne%3Anjdemo&bbox={bbox-epsg-3857}&width=486&height=768&srs=EPSG%3A3857&styles=&format=image/png&transparent=true'
        //         // 'http://localhost:8080/geoserver/ne/wms?service=WMS&version=1.1.0&request=GetMap&layers=ne%3ANanKing&bbox={bbox-epsg-3857}&width=490&height=768&srs=EPSG%3A3857&styles=&format=image/png&transparent=true'

        //     ],
        //     tileSize: 256,
        // });
        // map.addLayer({
        //     id: "wms-layer",
        //     source: "wms-source",
        //     type: "raster",
        // });

        // 添加wfs 行政区的数据
        axios({
          method: 'get',
          // url:'http://localhost:8080/geoserver/ne/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=ne%3Anjdemo&maxFeatures=50&outputFormat=application%2Fjson',
          url: 'http://localhost:8080/geoserver/ne/ows?',
          params: {
            'service': 'WFS',
            'version': '1.0.0',
            'request': 'GetFeature',
            'typeName': 'ne:njdemo',
            'outputFormat': 'application/json',
          },
        }).then((res) => {
          // console.log(res.data);
          const json = res.data
          this.njdemo = json
          map.addSource('json-source', { type: 'geojson', data: json })
          // 添加面要素
          map.addLayer({
            id: 'json-layer',
            type: 'fill',
            source: 'json-source',
            paint: {
              'fill-color': '#00FFD0',
              'fill-opacity': 0.1,
            }
          })
          // 添加线要素
          map.addLayer({
            id: 'json-line',
            type: 'line',
            source: 'json-source',
            paint: {
              'line-color': 'orange',
              'line-width': 2.5,
            }
          })
          // 添加文字要素
          map.addLayer({
            id: 'json-text',
            type: 'symbol',
            source: 'json-source',
            paint: {
              'text-color': 'orange',
            },
            layout: {
              'text-field': '{area}'
            }
          })
        })

        // 添加wfs tree的数据
        axios({
          method: 'get',
          // url:'http://localhost:8080/geoserver/ne/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=ne%3Atree&maxFeatures=50&outputFormat=application%2Fjson'
          url: 'http://localhost:8080/geoserver/ne/ows?',
          params: {
            'service': 'WFS',
            'version': '1.0.0',
            'request': 'GetFeature',
            'typeName': 'ne:tree_end',
            'outputFormat': 'application/json',
          },
        }).then((res) => {
          const allTree = res.data
          this.wfsTree = allTree
          // 加载image
          map.loadImage('/mapbox-icons/a.png', (error, image) => {
            if (error) throw error;
            map.addImage("image-a", image);
          })
          map.loadImage('/mapbox-icons/b.png', (error, image) => {
            if (error) throw error;
            map.addImage("image-b", image);
          })
          map.loadImage('/mapbox-icons/c.png', (error, image) => {
            if (error) throw error;
            map.addImage("image-c", image);
          })
          map.loadImage('/mapbox-icons/d.png', (error, image) => {
            if (error) throw error;
            map.addImage("image-d", image);
          })
          // 加载poi数据
          setTimeout(() => {
            map.addSource("poi_source", {
              type: "geojson",
              data: allTree,
            });
            map.addLayer({
              id: "poi-layer",
              type: 'symbol',
              source: "poi_source",
              layout: {
                "icon-image": ["match", ["get", "rank"], "一级", "image-a", "二级", "image-b", "三级", "image-c", "image-d"],
                "icon-size": 0.7,
                "icon-anchor": "bottom",
                "icon-allow-overlap": true
              }
            });
          }, 100);
        })
        // 添加全屏
        map.addControl(new mapboxgl.FullscreenControl());
      });
      // 添加点击弹窗事件
      map.on('click', 'poi-layer', (e) => {
        // Copy coordinates array.
        console.log(e.features[0]);
        const coordinates = e.features[0].geometry.coordinates.slice();
        const description =
          '<p>挂牌号:' + e.features[0].properties.id + '</p>' +
          '<p>树名:' + e.features[0].properties.name + '</p>' +
          '<p>树龄:' + e.features[0].properties.age + '</p>' +
          '<p>等级:' + e.features[0].properties.rank + '</p>' +
          '<div id="nav-icon" class="nav-icon" style="cursor: pointer;">' +
          '<img src="/mapbox-icons/navigate.png" alt="Navigate"/>' +
          '</div>';

        // 使用高德的convertFrom方法转换WGS84坐标到高德坐标系
        AMap.convertFrom(coordinates, "gps", (status, result) => {
          if (status === "complete" && result.info === "ok") {
            this.convertedCoordinates = result.locations[0]; // 获取转换后的高德坐标           
          } else {
            console.error("坐标转换失败:", result.info);
          }
        });
        setTimeout(() => {
          const navIcon = document.getElementById("nav-icon");
          if (navIcon) {
            navIcon.addEventListener("click", () => {
              this.openNavigation(this.convertedCoordinates.lng, this.convertedCoordinates.lat);
              this.toggleMap()
            });
          }
        }, 0);

        // 确保地图放大后也行
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        new mapboxgl.Popup({ anchor: 'top' })
          .setLngLat(coordinates)
          .setHTML(description)
          .addTo(map);
      });
      map.on('mouseenter', 'poi-layer', () => {
        map.getCanvas().style.cursor = 'pointer';
      });

      map.on('mouseleave', 'poi-layer', () => {
        map.getCanvas().style.cursor = '';
      });

      // 先拿到用户输入的数据
      // function getValue(){
      //     return document.getElementById("keywords").value;
      // }

      // 利用mapbox自带的filter
      // function search() {
      //     map.setFilter("poi-layer", ["==", ["get", "type"], getValue()]);
      // }


      // const btn = document.getElementById('search')

      // btn.onclick = function () {
      //     map.setFilter("poi-layer", ["==", ["get", "type"], getValue()]);
      // }
    },

    getValue() {
      return document.getElementById("keywords").value;
    },

    search() {
      // 先获取到输入框中过滤好的数据
      const result = this.wfsTree.features.filter((e) =>
        e.properties.id.includes(this.getValue()) || e.properties.name.includes(this.getValue())
      );
      console.log(result);
      //map.fitBounds();
      if (result.length > 0) {
        map.removeLayer("poi-layer");
        map.removeSource("poi_source");
        map.removeImage("image-a");
        map.removeImage("image-b");
        map.removeImage("image-c");
        const center = result[0].geometry.coordinates;
        map.flyTo({ center: center, essentia: true });
        const obj = {
          type: "FeatureCollection",
          features: result,
        };
        map.loadImage('/mapbox-icons/a.png', (error, image) => {
          if (error) throw error;
          map.addImage("image-a", image);
        })
        map.loadImage('/mapbox-icons/b.png', (error, image) => {
          if (error) throw error;
          map.addImage("image-b", image);
        })
        map.loadImage('/mapbox-icons/c.png', (error, image) => {
          if (error) throw error;
          map.addImage("image-c", image);
        })
        map.loadImage('/mapbox-icons/d.png', (error, image) => {
          if (error) throw error;
          map.addImage("image-d", image);
        })
        setTimeout(() => {
          map.addSource("poi_source", {
            type: "geojson",
            data: obj,
          });
          map.addLayer({
            id: "poi-layer",
            type: 'symbol',
            source: "poi_source",
            layout: {
              "icon-image": ["match", ["get", "rank"], "一级", "image-a", "二级", "image-b", "三级", "image-c", "image-d"],
              "icon-size": 0.7,
              "icon-anchor": "bottom",
            }
          });
        }, 100);
      } else {
        alert("没带这棵树哎！")
      }
    },

    filter(item) {
      console.log(item.area);
      console.log(item);
      map.removeLayer("poi-layer");
      map.removeSource("poi_source");
      map.removeImage("image-a");
      map.removeImage("image-b");
      map.removeImage("image-c");

      const result = this.wfsTree.features.filter((e) =>
        e.properties.area.includes(item.area)
      );
      const obj = {
        type: "FeatureCollection",
        features: result,
      };
      map.loadImage('/mapbox-icons/a.png', (error, image) => {
        if (error) throw error;
        map.addImage("image-a", image);
      })
      map.loadImage('/mapbox-icons/b.png', (error, image) => {
        if (error) throw error;
        map.addImage("image-b", image);
      })
      map.loadImage('/mapbox-icons/c.png', (error, image) => {
        if (error) throw error;
        map.addImage("image-c", image);
      })
      map.loadImage('/mapbox-icons/d.png', (error, image) => {
        if (error) throw error;
        map.addImage("image-d", image);
      })
      setTimeout(() => {
        map.addSource("poi_source", {
          type: "geojson",
          data: obj,
        });
        map.addLayer({
          id: "poi-layer",
          type: 'symbol',
          source: "poi_source",
          layout: {
            "icon-image": ["match", ["get", "rank"], "一级", "image-a", "二级", "image-b", "三级", "image-c", "image-d"],
            "icon-size": 0.7,
            "icon-anchor": "bottom",
          }
        });
      }, 100);
      map.fitBounds([[item.leftbottom1, item.leftbottom2], [item.righttop1, item.righttop2]])

    }
  },

}

</script>

<template>
  <div id="map">
    <div class="search">
      <!-- <el-input v-model="input" placeholder="Please input" type="text" id="keywords" /> -->
      <!-- <input type="text" id="keywords"> -->
      <!-- <el-button plain @click="search()" id="search" type="success">Search</el-button> -->
      <!-- <button @click="search()" id="search">搜索</button> -->
      <div class="mt-4">
        <el-input v-model="input" placeholder="请输入" class="input-with-select" type="text" id="keywords">
          <template #prepend>
            <el-select v-model="value" placeholder="按区查询" style="width: 115px">
              <el-option :label="item.properties.area" :value="item.properties.geocode" @click="filter(item.properties)"
                v-for="item in njdemo.features"></el-option>
            </el-select>
          </template>
          <template #append>
            <el-button @click="search()">搜索</el-button>
          </template>
        </el-input>
      </div>
    </div>
    <div class="changely">
      <button @click="changelayer()" class="changelybtn">
        <i class="ri-stack-fill"></i>
      </button>
    </div>
    <div class="addMarker">
      <button @click="addMarker()" class="addMarkerbtn" :disabled="markerShow">
        <i class="ri-map-pin-fill"></i>
      </button>
    </div>
    <pre id="coordinates" class="coordinates" v-show=markerShow></pre>

    <div id="label-container">
      <div class="label-item">
        <img src="/mapbox-icons/a.png" alt="名木">
        <div class="label-text">一级古树</div>
      </div>

      <div class="label-item">
        <img src="/mapbox-icons/b.png" alt="一级古树">
        <div class="label-text">二级古树</div>
      </div>

      <div class="label-item">
        <img src="/mapbox-icons/c.png" alt="二级古树">
        <div class="label-text">三级古树</div>
      </div>

      <div class="label-item">
        <img src="/mapbox-icons/d.png" alt="三级古树">
        <div class="label-text">名木</div>
      </div>
    </div>

    <div v-show="showMap" class="map-container">
      <div class="map-header">
        <h3>导航</h3>
        <el-button type="text" @click="toggleMap" icon="el-icon-close">
          <i>关闭</i>
        </el-button>
      </div>
      <div class="map-controls" style="margin-top: 10px;">
        <el-input v-model="userAddress" placeholder="请输入您的当前位置" @keyup.enter="searchUserAddress"
          style="margin-bottom: 10px" />
        <el-button type="primary" @click="searchUserAddress">确认出发地</el-button>
      </div>
      <div id="amap-container" style="width: 100%; height: 300px; margin-top: 10px;"></div>
      <div id="panel" style="height: 42%; overflow: auto; margin-top: 10px;"></div>
    </div>
  </div>
</template>

<style scoped>
.map-container {
  border: 3px solid #dcdfe6;
  border-radius: 8px;
  padding: 10px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  margin: 60px 8px;
  z-index: 99999;
  /* 确保地图容器始终位于最上层 */
  position: relative;
  /* 为了使 z-index 生效，必须设置 position */
  width: 330px;
  height: 83%;
  background-color: #ffffff;
}

.map-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.map-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: bold;
}

.el-button {
  font-size: 14px;
}

#map {
  width: 100%;
  height: 100%;
}

.search {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 10;
}

.input-with-select {
  width: 350px;
}

.changely {
  position: absolute;
  right: 8px;
  top: 50px;
  z-index: 99;

}

.changelybtn {
  width: 30px;
  height: 30px;
  border-radius: 20%;
  border: none;
  cursor: pointer
}

.ri-stack-fill,
.ri-map-pin-fill {
  font-size: 22px;
  width: 50px;
  height: 50px;
}

.addMarker {
  position: absolute;
  right: 8px;
  top: 90px;
  z-index: 99;
}

.addMarkerbtn {
  width: 30px;
  height: 30px;
  border-radius: 20%;
  border: none;
  cursor: pointer
}

.coordinates {
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  position: absolute;
  top: 0;
  left: 50%;
  padding: 5px 10px;
  margin: 0;
  font-size: 11px;
  line-height: 18px;
  border-radius: 3px;
  display: none;
  z-index: 99;
}

/* 容器固定在右下角 */
#label-container {
  position: absolute;
  right: 8px;
  bottom: 90px;
  z-index: 99;
  display: flex;
  flex-direction: column;
  /* 竖直排列 */
  align-items: center;
  gap: 10px;
  /* 图标之间的间距 */
  background: rgba(255, 255, 255, 0.8);
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.2);
}

/* 每个图标 + 文本的容器 */
.label-item {
  display: flex;
  flex-direction: column;
  /* 让图片和文字垂直排列 */
  align-items: center;
}

/* 图片大小 */
.label-item img {
  width: 40px;
  /* 调整大小 */
  height: auto;
}

/* 文字样式 */
.label-text {
  font-size: 14px;
  color: #333;
  margin-top: 5px;
  text-align: center;
}
</style>
