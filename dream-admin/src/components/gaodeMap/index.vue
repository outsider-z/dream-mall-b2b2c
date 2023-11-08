<template>
  <el-dialog title="选择地址" :visible.sync="mapVisible" v-if="mapVisible" :append-to-body="true">
    <span>
      <div class="amap-page-container">
        <el-amap-search-box class="search-box" :search-option="searchOption" :on-search-result="onSearchResult" />
        <el-amap class="amap-demo" :zoom="amap.zoom" :center="amap.center" :plugin="amap.plugin" :events="amap.events">
          <!-- 当前位置图标 -->
          <el-amap-marker v-for="(marker, index) in amap.markers" :key="'marker' + index" :position="marker.position" />
          <!-- 位置名称显示 -->
          <el-amap-text v-for="(marker, index) in amap.markers" :key="'text' + index" :text="marker.text"
            :offset="marker.offset" :position="marker.position" />
        </el-amap>
      </div>
    </span>
    <span slot="footer" class="dialog-footer">
      <el-button @click="mapVisible = false">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  function getFormData() {
    return {
      lat: "39.909186",
      lon: "116.39746",
      orgAddr: "天安门",
      province: "",
      city: "",
      district: "",
    };
  }
  //https://elemefe.github.io/vue-amap
  export default {
    name: 'GaodeMap',
    data() {
      const vm = this;
      return {
        // form对象
        mapVisible: false,
        orgAddress: '',
        dataForm: getFormData(),
        // 地图搜索对象
        searchOption: {
          city: "全国",
          citylimit: true,
        },
        lng: 0,
        lat: 0,
        // 地图对象
        amap: {
          zoom: 16,
          center: [116.319802, 39.98294],
          events: {
            // 点击获取地址的数据
            click(e) {
              const {
                lng,
                lat
              } = e.lnglat;
              vm.dataForm.lon = lng;
              vm.dataForm.lat = lat;
              // 这里通过高德 SDK 完成。
              AMap.plugin("AMap.Geocoder",function(){
                var geocoder = new AMap.Geocoder({
                  radius: 100,
                  extensions: "all",
                });
                geocoder.getAddress([lng, lat], function(status, result) {
                  if (status === "complete" && result.info === "OK") {
                    if (result && result.regeocode) {
                      vm.dataForm.orgAddr = result.regeocode.formattedAddress;
                      vm.dataForm.province = result.regeocode.addressComponent.province;
                      vm.dataForm.city = result.regeocode.addressComponent.city;
                      vm.dataForm.district = result.regeocode.addressComponent.district;
                      vm.dataForm.lat = lat ? lat.toString() : "";
                      vm.dataForm.lon = lng ? lng.toString() : "";
                      vm.amap.markers = [];
                      const obj = {
                        position: [lng, lat],
                        text: result.regeocode.formattedAddress,
                        offset: [0, 30],
                      };
                      vm.amap.markers.push(obj);
                      vm.submit();
                    }
                  }
                });
              })
              vm.$nextTick();
            },
          },

          plugin: [{
            // 定位
            pName: "Geolocation",
            events: {
              init(o) {
                // o是高德地图定位插件实例
                o.getCurrentPosition((status, result) => {
                  if (result && result.position) {
                    // 设置经度
                    vm.lng = result.position.lng;
                    // 设置维度
                    vm.lat = result.position.lat;
                    // 设置坐标
                    vm.amap.center = [vm.lng, vm.lat];
                    let op = {
                      position: [vm.lng, vm.lat],
                      text: result.formattedAddress,
                      offset: [0, 30],
                    };
                    vm.amap.markers.push(op);
                    // 页面渲染好后
                    vm.$nextTick();
                    vm.dataForm.province = result.addressComponent.province;
                    vm.dataForm.city = result.addressComponent.city;
                    vm.dataForm.district = result.addressComponent.district;
                    vm.dataForm.orgAddr = result.formattedAddress;
                    vm.dataForm.lat = result.position.lat
                    vm.dataForm.lon = result.position.lng;
                  }
                });
              },
            },
          }, ],
          //
          markers: [],
        },
      };
    },
    created() {},
    mounted() {},
    methods: {
      open() {
        this.mapVisible = true;
      },
      // 地图搜索回调
      onSearchResult(pois) {
        const vm = this;
        vm.amap.markers = [];
        let latSum = 0;
        let lngSum = 0;
        if (pois.length > 0) {
          pois.forEach((poi, index) => {
            const {
              lng,
              lat
            } = poi;
            if (index === 0) {
              lngSum = lng;
              latSum = lat;
              const obj = {
                position: [poi.lng, poi.lat],
                text: poi.name,
                offset: [0, 30],
              };
              vm.amap.markers.push(obj);
              vm.orgAddress = poi.name;
              vm.dataForm.lat = poi.lat ? poi.lat.toString() : "";
              vm.dataForm.lon = poi.lng ? poi.lng.toString() : "";
            }
          });
          vm.amap.center = [lngSum, latSum];
          vm.getAddress(vm.amap.center);
        }
      },
      // 获取详细地址
      getAddress(center) {
        let _this = this;
        let geocoder = new AMap.Geocoder({});
        geocoder.getAddress(center, function(status, result) {
          if (status === "complete" && result.info === "OK") {
            let obj = result.regeocode.addressComponent;
            _this.dataForm.province = obj.province;
            _this.dataForm.city = obj.city;
            _this.dataForm.district = obj.district;
            _this.dataForm.orgAddr = obj.province + obj.city + obj.district + obj.street + obj.township + _this
              .orgAddress;
          }
        });
      },
      // 提交方法
      submit() {
        const vm = this;
        vm.mapVisible = false;
        this.$emit("updateLocation", vm.dataForm);
      },
    },
  };
</script>

<style>
  .amap-page-container {
    margin-top: -80px;
    width: 100%;
    height: 450px;
  }

  .search-box {
    margin-top: 0px;
    position: relative;
    top: 65px;
    left: 20px;
  }

  .el-vue-amap-container.amap-demo {
    height: 96%;
  }
</style>
