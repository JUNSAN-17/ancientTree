<script>
// mapboxgl 相关文件的导入
import mapboxgl from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
import axios from "axios";

mapboxgl.accessToken =
    'pk.eyJ1IjoiMTMxNjczNzc1OCIsImEiOiJjbHFtZHIxYTUyem9oMnJtaHp4aTJ2NDRlIn0.09tiCR8kV4_0xZFRm_41iw';

let map;
let marker;
export default {
    data() {
        return {
            input: "",
            value: '',
            wfsTree: "",
            njdemo: "",
            isTrue: true,
            markerShow: true,
            lng: "",
            lat: ""
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
            minZoom: 5,
            maxZoom: 19,
            bounds: [[119.23657837, 32.61218107], [118.35377162, 31.23060178]],
            style: {
                "version": 8,
                "sources": sources,
                "layers": layers,
                "glyphs": "mapbox://fonts/mapbox/{fontstack}/{range}.pbf",
            }
        });

        this.init()

    },
    methods: {
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
            marker.on('dragend', onDragEnd)
        },
        // 添加坐标拾取功能
        addMarker() {
            this.markerShow = !this.markerShow
            if (!this.markerShow) {
                marker = new mapboxgl.Marker({
                    color: "orange",
                    draggable: true
                }).setLngLat([118.79665603476823, 32.05941383461646]).addTo(map);

                marker.on('dragend', () => {
                    var lngLat = marker.getLngLat();
                    coordinates.style.display = 'block';
                    coordinates.innerHTML =
                        '经度: ' + lngLat.lng + '<br />纬度: ' + lngLat.lat;
                })
                map.on('click', this.tishi)
            } else {
                marker.remove()
                map.off('click', this.tishi)
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
                        'typeName': 'ne:tree1',
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
                                "icon-image": ["match", ["get", "rank"], "一级", "image-a", "二级", "image-b", "image-c"],
                                "icon-size": 0.7,
                                "icon-anchor": "bottom",
                                "icon-allow-overlap":true
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
                const description = `<p>挂牌号:${e.features[0].properties.id}<p>树名:${e.features[0].properties.name}</p><p>树龄:${e.features[0].properties.age}<p>等级:${e.features[0].properties.rank}`;


                // 确保地图放大后也行
                while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                }

                new mapboxgl.Popup({ anchor: 'top' })
                    .setLngLat(coordinates)
                    .setHTML(description)
                    .setMaxWidth("800px")
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
                            "icon-image": ["match", ["get", "rank"], "一级", "image-a", "二级", "image-b", "image-c"],
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
                        "icon-image": ["match", ["get", "rank"], "一级", "image-a", "二级", "image-b", "image-c"],
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
                            <el-option :label="item.properties.area" :value="item.properties.geocode"
                                @click="filter(item.properties)" v-for="item in njdemo.features"></el-option>
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
            <button @click="addMarker()" class="addMarkerbtn">
                <i class="ri-map-pin-fill"></i>
            </button>
        </div>
        <pre id="coordinates" class="coordinates" v-show=markerShow></pre>
    </div>
</template>

<style>
.mapboxgl-ctrl-logo {
    display: none !important;
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
</style>
