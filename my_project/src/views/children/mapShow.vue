<script>
// mapboxgl 相关文件的导入
import mapboxgl from "mapbox-gl";
import '../../assets/css/mapbox-gl.css'
import { poi } from '../../assets/js/poi'
export default {
    data() {
        return {};
    },
    mounted() {
        this.init();
    },
    methods: {
        // 初始化
        init() {
            mapboxgl.accessToken =
                'pk.eyJ1IjoibGl6aGk1MjEiLCJhIjoiY2w3c2RiOXdiMG8zczNxbnUxY2Z1am9iZiJ9.U8e-WOu3ZFIO77foSXjL7A';
            const sources = {
                "raster-tiles": {
                    "type": "raster",
                    "tiles": ["http://t0.tianditu.gov.cn/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=fd9b52461875f08212b5446b4eeef167"],
                    "tileSize": 256
                }
            }
            const layers = [{
                "id": "simple-tiles",
                "type": "raster",
                "source": "raster-tiles",
                "minzoom": 5,
                "maxzoom": 19,
            }]
            const map = new mapboxgl.Map({
                container: 'map', // container ID
                center: [118.80242, 32.06465], // starting position [lng, lat]
                zoom: 9, // starting zoom
                attributionControl: false,
                pitch: 45,
                style: {
                    "version": 8,
                    "sources": sources,
                    "layers": layers
                }
            });
            map.on("load", () => {
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
                map.addSource("poi_source", {
                    type: "geojson",
                    data: poi,
                });
                map.addLayer({
                    id: "poi-layer",
                    type: 'symbol',
                    source: "poi_source",
                    layout: {
                        "icon-image": ["match", ["get", "type"], "school", "image-a", "hospital", "image-b", "image-c"]
                    }
                })

            })

            // 先拿到用户输入的数据
            function getValue() {
                return document.getElementById("keywords").value;
            }
            // // 利用mapbox自带的filter
            // function search() {
            //     map.setFilter("poi-layer", ["==", ["get", "type"], getValue()]);
            // }

            const btn = document.getElementById('search')

            btn.onclick = function () {
                map.setFilter("poi-layer", ["==", ["get", "type"], getValue()]);

            }
        },


    },

}
</script>

<template>
    <div id="map">
        <div class="search">
            <input type="text" id="keywords"><button id="search">搜索</button>
        </div>
    </div>
</template>

<style scoped>
#map {
    width: 100%;
    height: 100%;
}

.search {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 30px;
    left: 50px;
    z-index: 10;
}
</style>
