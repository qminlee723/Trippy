<template>
  <div class="form">
    <form @submit.prevent="onSubmit">
      <!-- 제목 -->
      <div class="title-box">
        <p>제목</p>
        <el-input v-model="newDiary.title" class="input-box" placeholder="제목을 입력해주세요." />
      </div>

      <div class="demo-collapse">
        <el-collapse>
          <!-- 장소 -->
          <el-collapse-item name="1">
            <template #title>
              <p class="option-p">장소</p>
              <div v-if="select.length===2">
                <el-tag class="option-tag" type="dark">{{ select[0] }}</el-tag>
                <el-tag class="option-tag" type="dark">{{ select[1] }}</el-tag>
              </div>
            </template>
            <div class="location-div">
              <!-- {{ location }} -->
              <el-cascader :options="locationTable" v-model="select" clearable placeholder="나라와 도시를 선택해주세요."/>
            </div>
          </el-collapse-item>

          <!-- 옵션 -->
          <el-collapse-item name="2">
            <template #title>
              <p class="option-p">옵션</p>
              <!-- 태그 -->
              <el-scrollbar>
                <div class="option-tag-div">
                  <el-tag class="option-tag" type="dark">
                    {{ partyTag }}
                  </el-tag>
                  <el-tag v-for="trans in transportationTag" :key="trans" class="option-tag" 
                  closable :disable-transitions="false" type="dark" @close="handleClose(trans)">
                    {{ trans.transport.name }}
                  </el-tag>
                </div>
              </el-scrollbar>
            </template>

            <div class="option-div">
              <!-- 옵션:여행 기간 -->
              <div class="option-date">
                <span class="option-title">여행 기간</span>
                <div class="date-picker">
                  <el-date-picker
                    v-model="newDiary.startDate"
                    type="date"
                    value-format="YYYY-MM-DD HH:mm:ss"
                    placeholder="여행 시작일을 선택해주세요."
                  />
                  <el-date-picker
                    v-model="newDiary.endDate"
                    type="date"
                    value-format="YYYY-MM-DD HH:mm:ss"
                    placeholder="여행 종료일을 선택해주세요."
                  />
                </div>
              </div>

              <!-- 옵션: 일행 타입 -->
              <div class="option-party">
                <span class="option-title">일행 타입</span>
                <el-radio-group v-model="newDiary.company">
                  <el-radio class="party-option" :label=1>가족</el-radio>
                  <el-radio class="party-option" :label=2>커플</el-radio>
                  <el-radio class="party-option" :label=3>친구</el-radio>
                  <el-radio class="party-option" :label=4>개인</el-radio>
                </el-radio-group>
              </div>

              <!-- 옵션: 인원 수 -->
              <div class="option-member">
                <span class="option-title">인원 수</span>
                <el-input-number v-model="newDiary.count" :min="1" :max="10"/>
              </div>

            <!-- 옵션: 이동수단 -->
              <div class="option-transport">
                <span>이동 수단</span>
                <div class="option-checkbox">
                  <el-checkbox-group class="transport" v-model="newDiary.postTransports" v-for="(trans, idx) in transportList" :key="idx">
                    <el-checkbox class="transport-option" :label="trans">{{ trans.transport.name }}</el-checkbox>
                  </el-checkbox-group>
                </div>
              </div>
            </div>
          </el-collapse-item>

          <!-- 루트 -->
          <el-collapse-item class="route-select" name="3">
            <template #title>
              <p class="route-p">루트</p>
              <!-- 태그 -->
              <el-scrollbar>
                <div class="option-tag-div">
                  <el-tag class="option-tag" v-for="(route, idx) in newDiary.routes" :key="idx"
                  :disable-route="false" type="dark">
                    {{ route.routeName }}
                  </el-tag>
                </div>
              </el-scrollbar>
            </template>
            
            <!-- 지도 -->
            <div>
              <div class="route-div">
                <input id="pac-input" class="route-input" type="text" placeholder="루트를 추가해주세요." v-show="flag === 0 && newDiary.routes.length < 10" />
                <el-button-group class="route-btn-group">
                  <el-button type="primary" class="route-btn" @click="addMarkers" :disabled="newDiary.routes.length === 0">
                    <span class="material-symbols-outlined">push_pin</span>
                  </el-button>
                  <el-button type="primary" class="route-btn" @click="initMap" :disabled="flag === 0">
                    <span class="material-symbols-outlined">add_location</span>  
                  </el-button>
                </el-button-group>
              </div>
              <div id="map" style="height: 70vw; position: relative; overflow: hidden;"></div>
              <div class="route-tag-group">
                <el-tag v-for="(route, idx) in newDiary.routes" :key="idx" class="route-tag"
                closable :disable-route="false" type="dark" @close="removeRoute(idx)">
                  {{ route.routeName }}
                </el-tag>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>

      <!-- 스토리 -->
      <div class="story-form">
        <p class="story-p">스토리</p>
        <div>
          <div v-for="(newStory, k) in newStories" :key="k">
            <div class="story-title">
              <span>상세 장소</span>
              <el-input v-model="newStory.detailLocationName" class="input-box" id="title-input-box" placeholder="상세 장소를 입력해주세요." />
            </div>

            <div class="story-rate">
              <span>별점</span>
              <el-rate v-model="newStory.rating" allow-half />
            </div>

            <div class="story-content">
              <span>내용</span>
              <el-input v-model="newStory.detailLocationContent" maxlength="500"
              placeholder="내용을 입력해주세요." show-word-limit type="textarea" rows=7 resize="none" class="content-input"/>
            </div>

            <!-- 사진 잠깐 주석 -->
            <div class="story-photo">
              <div class="story-photo-title">
                <span>사진</span>
                <span>(선택)</span>
              </div>

                <div v-if="images[k].length === 0" class="photo-div">
                  <label :for=k>
                    <span class="material-symbols-outlined">add_photo_alternate</span>
                  </label>
                  <input class="photo-input" type="file" :id=k :ref="`${k}th-file`" accept="image/*" @change="uploadPhoto(k)"/>
                  <div class="photo-des-div">
                    <span class="photo-description">아이콘을 눌러 사진을 추가해주세요.</span>
                    <span class="photo-description-sec">(스토리 당 한 개의 사진을 첨부할 수 있어요.)</span>
                  </div>
                </div>

                <div v-else class="photo-content-div">
                  <div class="photo-preview-group">
                    <img :src="newStory.preview" alt="photo" @click="removePhoto(k)">
                    <span class="photo-description">사진을 클릭하면 삭제할 수 있어요.</span>
                  </div>
                </div>

            </div>
            
            <div class="story-btn">
              <el-button @click="addStory()" v-show="newStories.length < 10" :disabled="k != newStories.length - 1" link>
                <span class="material-symbols-outlined">note_add</span>
              </el-button>
              <el-button @click="removeStory(k)" v-show="(newStories.length >= 1) && k!=0" link>
                <span class="material-symbols-outlined">delete</span>
              </el-button>
            </div>
            <el-divider/>
          </div>
        </div>

      </div>

      <div class="submit-btn">
        <el-button @click="onSubmit" type="primary" class="button">작성하기</el-button>
      </div>

    </form>
  </div>
</template>

<script>
/* eslint-disable no-undef */
import { mapActions, mapGetters } from 'vuex'
import { ElMessageBox } from 'element-plus'

export default {
  name: 'DiaryForm',
  props: {
    diary: Object,
    action: String
  },
  data() {
    return {
      transportList: [
        {
          transport: 
          {
            id: 1,
            name: '뚜벅이'
          }
        },
        {
          transport: 
          {
            id: 2,
            name: '대중교통'
          }
        },
        {
          transport: 
          {
            id: 3,
            name: '따릉이'
          }
        },
        {
          transport: 
          {
            id: 4,
            name: '택시'
          }
        },
        {
          transport: 
          {
            id: 5,
            name: '자차'
          }
        },
      ],
      flag: 0,
      route: {},
      images: [[]],
      newStories: [
        ...this.diary.detailLocations,
        { 
          // pk: 0,
          detailLocationName: '',
          // dialogVisible: false,
          detailLocationContent: '',
          rating: null,
          preview: ''
        }
      ],      
      newDiary: {
        title: this.diary.title,
        countryName: this.diary.countryName,
        cityName: this.diary.cityName,
        startDate: this.diary.startDate,
        endDate: this.diary.endDate,
        company: this.diary.company,
        count: this.diary.count,
        postTransports: this.diary.postTransports,
        routes: this.diary.routes,
        detailLocations: this.diary.detailLocations
      },
      select: [],
    }
  },
  computed: {
    // update할 때 diaryTemp 대신 해당 pk 다이어리 가져와야 함 -> 편집 창으로 들어오면 해당 pk 다이어리 내용 fetch하는 함수
    ...mapGetters(['diaryTemp', 'location', ]),
    partyTag() {
      const party = this.newDiary.company
      const partyList = ['가족', '커플', '친구', '개인']
      return partyList[party-1]
    },
    transportationTag() {
      const transportation = this.newDiary.postTransports
      return transportation
    },
    locationTable() {
      const options = []
      let countryName = ''
      let j = -1
      for (let i=0 ; i<this.location.length ; i++) {
        const country = {}
        if (countryName != this.location[i].countryName) {
          country.value = this.location[i].countryName
          country.label = this.location[i].countryName
          country.children = []
          const city = {}
          city.value = this.location[i].cityName
          city.label = this.location[i].cityName
          country.children.push(city)
          options.push(country)
          countryName = this.location[i].countryName
          j = j + 1
          console.log(i, country)
        } else {
          const citySec = {}
          citySec.value = this.location[i].cityName
          citySec.label = this.location[i].cityName
          options[j].children.push(citySec)
        }
      }
      return options  
    }
  },
  methods: {
    ...mapActions(['createDiary', 'updateDiary', 'saveImage', 'fetchLocation', ]),

    handleClose(tag) {
      this.newDiary.postTransports.splice(this.newDiary.postTransports.indexOf(tag), 1)
    },

    initMap() {
      this.flag = 0
      const map = new google.maps.Map(document.getElementById("map"), {
          center: { lat: 37.5642135 ,lng: 127.0016985 },
          zoom: 13,
          disableDefaultUI: true,
      });
      const input = document.getElementById("pac-input");
      const autocomplete = new google.maps.places.Autocomplete(input, {
          fields: ["place_id", "geometry", "name", "formatted_address"],
      });
      autocomplete.bindTo("bounds", map);

      const geocoder = new google.maps.Geocoder();
      const marker = new google.maps.Marker({ map: map });
      autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          if (!place.place_id) {
              return;
          }
          geocoder
              .geocode({ placeId: place.place_id })
              .then(({ results }) => {
              map.setZoom(15);
              map.setCenter(results[0].geometry.location)

              marker.setPlace({
                  placeId: place.place_id,
                  location: results[0].geometry.location,
              })

              let routeName = place.name
              let geocode = { lat: place.geometry.location.lat(), lng: place.geometry.location.lng() }

              this.addRoute(routeName, geocode)

              marker.setVisible(true)
          })
              .catch((e) => window.alert("Geocoder failed due to: " + e))
      input.value = ''
      });
    },

    addRoute(routeName, geocode) {
      this.route.index = this.newDiary.routes.length + 1
      this.route.routeName = routeName
      this.route.lat = geocode.lat
      this.route.lng = geocode.lng
      this.newDiary.routes.push(this.route)
      console.log(this.newDiary.routes)
      this.route = {}
      // console.log(this.newDiary.routes)
    },

    addMarkers() {
      this.flag = 1
      const map = new google.maps.Map(document.getElementById("map"), {
          center: { lat: this.newDiary.routes[this.newDiary.routes.length - 1].lat, lng: this.newDiary.routes[this.newDiary.routes.length - 1].lng},
          zoom: 13,
          disableDefaultUI: true,
      });
      const geocodes = []
      // console.log(this.routeGeocodes)
      this.newDiary.routes.forEach((each) => {
        // console.log(each)
        let labelNum = (each.index).toString()
        geocodes.push({ lat: each.lat, lng: each.lng })
        new google.maps.Marker({
            position: { lat: each.lat, lng: each.lng },
            label: labelNum,
            map: map,
        });
      })
      // console.log(geocodes)
      const routePath = new google.maps.Polyline({
        path: geocodes,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2
      })
      routePath.setMap(map)
    },

    removeRoute(index) {
      this.newDiary.routes.splice(index, 1)
      this.newDiary.routes.forEach((each) => {
        each.index = this.newDiary.routes.indexOf(each) + 1
      })
      this.addMarkers()
    },

    addStory() {
      if (this.newStories[this.newStories.length - 1].detailLocationName === '' || this.newStories[this.newStories.length - 1].detailLocationContent === '') {
        ElMessageBox.alert('내용 작성 후 스토리를 추가해주세요!', '알림', {
          confirmButtonText: 'OK',
        })
      } else {
        this.newStories.push({
          // pk: 0,
          detailLocationName: '',
          // images: [],
          // dialogVisible: false,
          detailLocationContent: '',
          rating: null,
          preview: ''
        }),
        this.images.push([])
      }
    },

    removeStory(index) {
      this.newStories.splice(index, 1)
    },

    uploadPhoto(index) {
      console.log(index)
      console.log(this.$refs[`${index}th-file`])
      console.log(this.$refs[`${index}th-file`][0].files)

      for (let i = 0; i < this.$refs[`${index}th-file`][0].files.length; i++) {
        let photo = this.$refs[`${index}th-file`][0].files[i]
        if (photo.type.substr(0, 5) === "image") {
          this.images[index] = this.$refs[`${index}th-file`][0].files[i]
          console.log(this.images[index])
          this.newStories[index].preview = URL.createObjectURL(this.$refs[`${index}th-file`][0].files[i])
        } else {
          ElMessageBox.alert("사진 파일만 추가 가능합니다", '알림', {
          confirmButtonText: 'OK',
        })
        }
      }
      console.log(this.images[index])
      console.log(this.images)
      console.log(this.newStories[index].preview)
      let fileInput = document.getElementsByClassName("photo-input")
      fileInput[fileInput.length - 1].value = ''
    },

    // uploadPhoto(index) {
    //   console.log(index)
    //   let addedPhotoList = this.newStories[index].images
    //   // console.log(addedPhotoList)
    //   // fileInput.value = index
    //   console.log(this.$refs.files)
    //   console.log(this.$refs.files[index].files)
    //   for (let i = 0; i < this.$refs.files[index].files.length; i++) {
    //     let photo = this.$refs.files[index].files[i]
    //     // console.log(photo)
    //     if (photo.type.substr(0, 5) === "image") {
    //       addedPhotoList = [
    //         ...addedPhotoList,
    //         // 1차 실험 코드 (사진 미리보기는 없음)
    //         // this.$refs.files[index].files[i]
    //         // 여기 잠깐 주석
    //         {
    //           // 실제 파일
    //           file: this.$refs.files[index].files[i],
    //           // 사진 미리보기
    //           preview: URL.createObjectURL(this.$refs.files[index].files[i]),
    //           // 삭제 및 관리를 위한 number
    //           // number: i
    //         }
    //       ]
    //       // num = i
    //     } else {
    //       alert("사진 파일만 추가 가능합니다")
    //     }
    //   }
    //   this.newStories[index].images = addedPhotoList
    //   console.log(this.newStories[index].images)
    //   let fileInput = document.getElementsByClassName("photo-input")
    //   // // console.log(fileInput)
    //   // console.log(fileInput[0].value)
    //   // console.log(fileInput[fileInput.length - 1].value)
    //   fileInput[fileInput.length - 1].value = ''
    //   // for (let j = 0; j < fileInput.length; j++) {
    //   //   console.log(fileInput[j].value)
    //   //   fileInput[j].value = ''
    //   // }
    // },

    removePhoto(index) {
      // if (this.newStories[index].photoList.length === 1) {
      //   this.dialogVisible = false
      // }
      this.images[index] = []
      this.newStories[index].preview = ''
    },

    // addPhoto(index) {
    //   // console.log('add', index)
    //   let addedPhotoList = this.newStories[index].images
    //   // let fileInput = document.getElementsByClassName("photo-input-sec")
    //   // console.log(fileInput)
    //   console.log(this.$refs.files)
    //   console.log(this.$refs.files[index].files)
    //   for (let i = 0; i < this.$refs.files[index].files.length; i++) {
    //     let photo = this.$refs.files[index].files[i]
    //     if (photo.type.substr(0, 5) === "image") {
    //       addedPhotoList = [
    //         ...addedPhotoList,
    //         {
    //           file: this.$refs.files[index].files[i],
    //           preview: URL.createObjectURL(this.$refs.files[index].files[i]),
    //         }
    //       ]
    //     } else {
    //       alert("사진 파일만 추가 가능합니다")
    //     }
    //   }
    //   this.newStories[index].images = addedPhotoList
    //   console.log(this.newStories[index].images)
    //   let fileInput = document.getElementsByClassName("photo-input-add")
    //   // console.log(fileInput[0].value)
    //   // console.log(fileInput[fileInput.length - 1].value)
    //   // fileInput.forEach((each) => {
    //   //   each.value = ''
    //   // })
    //   fileInput[fileInput.length - 1].value = ''
    //   // for (let j = 0; j < fileInput.length; j++) {
    //   //   console.log(fileInput[j].value)
    //   //   fileInput[j].value = ''
    //   // }
    // },

    onSubmit() {
      this.newStories.forEach((each) => {
        // each.pk = this.newStories.indexOf(each) + 1
        delete each.preview
      })
      this.newDiary.detailLocations = this.newStories
      this.newDiary.countryName = this.select[0]
      this.newDiary.cityName = this.select[1]

      if (this.newDiary.title && this.newDiary.startDate && this.newDiary.endDate && this.newDiary.postTransports.length
      && this.newDiary.routes.length && this.newDiary.detailLocations.length && this.newDiary.countryName && this.newDiary.cityName) {
        console.log(this.newDiary)
        // const imageList = new FormData()
        const diary = new FormData()
        // console.log(this.images)
        // console.log(imageList)
        // for (let key in this.newDiary) {
          //   const value = this.newDiary[key]
        //   diary.append(key, JSON.stringify(value))
        // }
        diary.append("post", new Blob([JSON.stringify(this.newDiary)], {type: "application/json"}))
        // diary.append("diary", JSON.stringify(this.newDiary))
        this.images.forEach((image) => {
          if (image.length === 0) {
            // diary.append("images", this.$refs[`${this.images.indexOf(image)}th-file`][0].files)
            // console.log(this.images.indexOf(image))
            // console.log(this.$refs[`${this.images.indexOf(image)}th-file`][0].files)
            const empty = new File(["empty"], "empty.txt", {type: "text/plain"})
            diary.append("images", empty)
          } else {
            diary.append("images", image)
          }
        })
        // diary.append("images", imageList)
        for (var key of diary.keys()) {
          console.log(key);
        }
        for (var value of diary.values()) {
          console.log(value);
        }
        // for (var imagekey of imageList.keys()) {
          //   console.log(imagekey);
        // }
        // for (var imagevalue of imageList.values()) {
          //   console.log(imagevalue);
        // }
        this.createDiary(diary)
        // this.saveImage(imageList)
      } else {
        // console.log(this.locationPick)
        // console.log(this.locationPick[0])
        // console.log(this.locationPick[1])
        ElMessageBox.alert('빈 칸 없이 모든 필드를 채워주세요!', '알림', {
          confirmButtonText: 'OK',
        })
      }
    }
  },
  
  mounted() {
    this.initMap(),
    this.fetchLocation()
  },
}
</script>

<style scoped>
.form {
  margin-bottom: 5rem;
}
.title-box {
  display: flex;
  justify-content: start;
  align-items: center;
  color: var(--el-text);
  font-size: 0.8rem;
  margin-bottom: 0.5rem;
}
.title-box > p {
  width: 10vw;
  text-align: left;
  font-weight: 500;
}
.title-box .input-box {
  width: 80vw;
  margin-left: 0.5rem;
}
.location-div {
  margin-left: 2.7rem;
}
.option-p {
  width: 10vw;
  text-align: left;
  font-weight: 500;
}
.option-tag-div {
  display: flex;
  /* flex-wrap: wrap; */
  align-items: center;
  width: 65vw;
}
.option-tag {
  margin-top: 0.7rem;
  margin-left: 0.5rem;
}
.option-div {
  display: flex;
  flex-direction: column;
  margin-top: 1.5rem;
}
.option-date {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border-right: none;
  margin-bottom: 1rem;
  text-align: left;
}
.date-picker {
  display: flex;
  flex-direction: column;
}
.option-title {
  color: var(--el-text-color-secondary);
  width: 20vw;
  font-size: 0.8rem;
  font-weight: 500;
}
.option-party {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 1rem;
  text-align: left;
}
.option-member {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 1rem;
  text-align: left;
}
.party-option {
  width: 2rem;
  margin-right: 1.5rem;
}
.option-transport {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 1rem;
  text-align: left;
}
.option-transport span {
  color: var(--el-text-color-secondary);
  width: 25vw;
  font-size: 0.8rem;
  font-weight: 500;
}
.option-checkbox {
  display: flex;
  flex-wrap: wrap;
  margin-left: 1.5rem;
}
.transport-option {
  width: 5.2rem;
  margin-right: 1.5rem;
}
.route-btn-group{
  display: flex;
}
.route-input {
  height: 30px;
}
.route-p {
  width: 10vw;
  text-align: left;
  font-weight: 500;
}
.route-div {
  display: flex;
  margin-bottom: 10px;
}
#pac-input {
  background-color: #fff;
  font-size: 0.8rem;
  color: var(--el-text-color-secondary);
  padding: 0 11px 0 13px;
  text-overflow: ellipsis;
  width: 60vw;
  height: 1.8rem;
  box-shadow: none;
  border: solid 1px var(--el-border-color);
  border-radius: 5px;
  margin-right: 1rem;
}
.route-btn {
  width: 2rem;
  margin: 0 0.3rem;
}
.route-tag-group {
  text-align: left;
}
.route-tag {
  margin-top: 0.5rem;
  margin-left: 0.5rem;
}
.story-p {
  width: 10vw;
  text-align: left;
  font-weight: 500;
  font-size: 0.8rem;
  margin-top: 1rem;
}
.story-title {
  display: flex;
  align-items: center;
  text-align: left;
  margin-top: 1rem;
}
.story-title > span {
  color: var(--el-text-color-secondary);
  width: 17vw;
  font-size: 0.8rem;
  font-weight: 500;
}
.story-title .input-box {
  width: 70vw;
  /* margin-left: 0.7rem; */
}
.story-rate {
  display: flex;
  align-items: center;
  text-align: left;
  margin-top: 1rem;
}
.story-rate > span {
  color: var(--el-text-color-secondary);
  width: 17vw;
  font-size: 0.8rem;
  font-weight: 500;
}
.story-rate .el-rate {
  --el-rate-fill-color: #F16B51;
}
.story-content {
  display: flex;
  align-items: center;
  text-align: left;
  margin-top: 1rem;
}
.story-content > span {
  color: var(--el-text-color-secondary);
  width: 17vw;
  font-size: 0.8rem;
  font-weight: 500;
}
.story-content .content-input {
  height: 150px;
  width: 70vw;
}
.story-photo {
  display: flex;
  justify-content: left;
  align-items: center;
  text-align: left;
  margin-top: 1rem;
  margin-bottom: 1rem;
}
.story-photo-title {
  display: flex;
  flex-direction: column;
}
.story-photo-title span {
  color: var(--el-text-color-secondary);
  width: 17vw;
  font-size: 0.8rem;
  font-weight: 500;
}
.photo-div {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.photo-div label {
  height: 2.25rem;
}
.photo-div .material-symbols-outlined {
  color: var(--el-text-color-secondary);
  font-size: 10vw;
  font-weight: 500;
}
.photo-des-div {
  display: flex;
  flex-direction: column;
}
.photo-description {
  color: var(--el-text-color-secondary);
  font-size: 0.8rem;
  margin-left: 0.5rem;
}
.photo-description-sec {
  color: var(--el-text-color-secondary);
  font-size: 0.6rem;
  margin-left: 0.5rem;
}
.photo-input {
  width: 0;
  visibility: hidden;
}
.photo-input-add {
  width: 0;
  visibility: hidden;
}
.photo-add-div {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.photo-add-div .material-symbols-outlined {
  color:#F16B51;
  font-size: 10vw;
  font-weight: 500;
}
.my-header {
  display: flex;
  justify-content: space-between;
  margin-left: 1rem;
}
.my-header > div {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.my-header > div > h4 {
  font-weight: 500;
  margin-bottom: 0;
}
.my-header > div > p {
  color: var(--el-text-color-secondary);
  font-size: 0.7rem;
  margin-bottom: 0;
}
.my-header > div > p:last-child {
  color: var(--el-text-color-secondary);
  font-size: 0.7rem;
  margin-bottom: 0;
  margin-top: 0;
}
.photo-preview {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
}
.photo-preview .material-symbols-outlined {
  font-size: 15vw;
}
.photo-preview label {
  height: 3.375rem;
}
.photo-preview-group {
  display: flex;
  align-items: center;
}
.photo-preview-group > img {
  width: 15vw;
  height: 20vw;
  margin-right: 0.5rem;
}
.story-btn {
  display: flex;
  justify-content: flex-end;
}
.story-btn > el-button {
  margin: 0;
}
.story-btn .material-symbols-outlined {
  color: #F16B51;
  font-size: 2rem;;
}
.submit-btn {
  margin-top: 1rem;
  text-align: center;
}
.button {
  width: 100%;
}

.el-button--primary {
  --el-button-active-bg-color: var(--el-color-primary);
  /* --el-button-active-color: var(--el-color-primary); */
  /* --el-button-disabled-bg-color: #EFDFDE;  */
  --el-button-hover-bg-color: #FFD2C9;
  --el-button-hover-border-color: #FFD2C9;
}
</style>