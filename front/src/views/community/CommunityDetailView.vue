<template>
  <div class="container">
      <div class="tags">
        <!-- {{ post }} -->
        <!-- {{post.recruitCurrentVolume}}
        {{counter}} -->

        <el-tag type="dark" class="tag">{{ post.cityName }}</el-tag>
        <el-tag type="dark" class="tag">{{ post.category === 1 ? '식사' : post.category === 2 ? '동행' : post.category === 3 ? '파티' : post.category === 4 ? '이동수단 셰어' : '기타' }}</el-tag>
      </div>
      <div class="header">
        <div class="profile" @click="goProfile">
          <el-avatar class="profile-image" :size="40" src="" />
          <span class="username">{{ post.name }}</span>
        </div>
        <div v-if="!isPostAuthor" class="bookmark">
          <span v-if="post.bookmark===false" class="material-symbols-outlined" @click="goBookmark">bookmark_add</span>
          <span v-else class="material-symbols-outlined filled" @click="cancelBookmark">bookmark</span>
        </div>
        <div v-if="isPostAuthor">
          <edit-delete-button class="edit-delete"></edit-delete-button>
        </div>
      </div> 
    <hr>
    <div class="title">
      <!-- <span class="state">{{ post.recruitCurrentVolume < post.recruitVolume ? '모집중' : '모집마감' }}</span> -->
      <h4>{{ post.title }}</h4>
    </div>
    <div class="options">
      <p class="option">
        <span class="material-symbols-outlined icon">groups</span>
        <span v-if="post.startAge===19 && post.endAge===70 && post.gender==='누구나'">누구나</span>
        <span v-else>{{ post.startAge === post.endAge ? `${post.startAge}세` : post.startAge === 19 && post.endAge === 70 ? '누구나' : `${post.startAge}~${post.endAge}세`}} | {{ post.gender }}</span>
        참여 가능
      </p>
      <p class="option">
        <span class="material-symbols-outlined icon">event_note</span>
        <span>{{ post.endDate ? `${post.startDate.slice(5, 10)}~${post.endDate.slice(5,10)}` : ''+post.startDate.slice(5, 10) }},</span>
        <span>{{ ''+post.meetingTime.slice(11, 16) }}</span>
      </p>
      <p class="option">
        <span class="material-symbols-outlined icon">location_on</span>
        {{ post.place }}
      </p>
    </div>
    
    <div class="content">
      <p class="description">{{ post.description }}</p>
      <hr>
    </div>
    <div class="members">
      <!-- <p class="member-count">
        <span>{{ post.recruitCurrentVolume + 1}}</span>
        / {{ post.recruitVolume + 1 }}명 참여
      </p> -->
      <!-- <div class="users">
        <div class="user">
          <el-avatar :size="40" src="" />
          <span>{{ post.name }}</span>
        </div>
      </div> -->
      <div v-if="!isPostAuthor" class="participation">
        <el-button type="primary" class="button" @click="goPartIn">참가하기</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import EditDeleteButton from '@/components/common/EditDeleteButton.vue'

export default {
  name: 'CommunityDetailView',
  components: {
    EditDeleteButton
  },
  data() {
    return {
      // isBookmark: false,
      postPk: this.$route.params.postPk
    }
  },
  watch: {
    post: {
      deep: true,
      handler: 'executeBookmark'
    }
  },
  
  computed: {
    ...mapGetters(['post', 'isPostAuthor']),
    // recruitState() {
    //   return '모집중'
    // },
    convertTag() {
      const category = this.post.category
      const categoryList = ['식사', '동행', '파티', '이동수단 셰어', '기타']
      return categoryList[category-1]
    },
    // convertDate() {
    //   let date = ''
    //   if (!this.post.isDay) {
    //     date = this.post.startDate.substr(5,5) + '~' + this.post.endDate.substr(5,5)
    //   } else {
    //     date = this.post.startDate.substr(5,5)
    //   }
    //   return date
    // },
    // convertTime() {
    //   let time = ''
    //   time = this.post.meetingTime.substr(11,5)
    //   return time
    // }
  },
  methods: {
    // ...mapMutations(['ADD_VOLUME']),
    ...mapActions(['fetchPost', 'updatePost', 'fetchCurrentUser', 'fetchBookmark', 'createBookmark', 'deleteBookmark', 'checkBookmark']),
    executeBookmark() {
      this.checkBookmark(this.postPk)
    },
    
    goBookmark() {
      this.checkBookmark(this.postPk)
      this.createBookmark(this.postPk)
      // this.switchIsBookmark()
      // this.isBookmark = true
      // console.log(1, this.isBookmark)
    },
    cancelBookmark() {
      this.checkBookmark(this.postPk)
      this.deleteBookmark(this.postPk)
      // this.switchIsBookmark()
      // console.log(2, this.isBookmark)
    },
    // switchIsBookmark() {
    //   this.isBookmark = !this.isBookmark
    // }
    goProfile() {
      this.$router.push({ name: 'profile' })
    },
    goPartIn() {
      // this.ADD_VOLUME()
      window.open(this.post.openKakaoUrl)
    }
  },
  created() {
    this.fetchCurrentUser()
    this.fetchPost(this.postPk)
    // this.fetchPost(this.postPk)
    // this.fetchBookmark()
  },
  mounted() {
    // setTimeout(() => {
    //   this.checkBookmark(this.postPk)
    // }, 25);
  },
  // updated() {
  //   this.checkBookmark(this.postPk)
  // }
}
</script>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
}

.container {
  padding: 1rem;
}

hr {
  border: 0;
  height: 0;
  border-top: 1px solid #d9d9d9;
}

.tags {
  text-align: left;
}

.tag {
  margin-right: 0.3rem;
  margin-bottom: 1rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-items: center;
  position: relative;
  padding: 0.5rem;
}

.bookmark {
  color: #F16B51;
}

.filled {
  font-variation-settings:
  'FILL' 1,
  'wght' 400,
  'GRAD' 0,
  'opsz' 48
}

.profile {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.profile-image {
  margin-right: 0.3rem;
}

.username {
  font-weight: 400;
}

.edit-delete {
  position: absolute;
  top: 1rem;
  right: 1rem;
}

.title {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  font-size: 1.2rem;
}

.state {
  font-weight: bold;
  color: #F16B51;
  margin-right: 0.3rem;
}

.options {
  padding: 0.5rem;
  font-size: 0.9rem;
}

.option {
  display: flex;
  align-items: center;
  margin-bottom: 0.3rem;
}

.option > span {
  margin-right: 0.3rem;
}

.icon {
  font-size: 1.2rem;
}

.content {
  padding: 0.5rem;
}

.description {
  text-align: left;
  margin-bottom: 1rem;
}

.members {
  padding: 0.5rem;
}

.member-count {
  text-align: left;
  font-size: 0.9rem;
  font-weight: 400;
  margin-bottom: 0.3rem;
}

.member-count > span {
  color: #F16B51;
  font-weight: 400;
}

.users {
  display: flex;
  align-items: center;
}

.user {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-right: 0.3rem;
}

.user > span {
  text-align: center;
  font-size: 0.8rem;
  font-weight: 400;
}

.participation {
  display: flex;
  justify-content: center;
}

.button {
  position: fixed;
  width: 90%;
  bottom: 5rem;
}

/* .el-button .el-button--primary {
  --el-button-active-color: var(--el-color-white);
  --el-button-disabled-bg-color: var(--el-color-white);
  --el-button-disabled-border-color: #b9b9b9;
} */

</style>