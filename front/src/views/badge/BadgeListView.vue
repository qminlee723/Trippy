<template>
  <div class="container">
    <h2> 지금까지 모은 뱃지들 </h2>
    <div class="description">
      <p>일정 조건을 만족하면 뱃지를 얻을 수 있습니다</p>
      <p>자신이 얻은 뱃지에는 불이 들어오며</p>
      <p>아직 얻지 못한 배지는 흑백으로 보입니다</p>
      <p>모든 뱃지에 불이 들어올 수 있도록 열심히 활동해보세요!</p>
    </div>
    <!-- 전체 뱃지 목록 -->
    <div class="badge-list">
      <el-row>
        <el-col class="badge" :span="8" v-for="(badge, idx) in badges" :key="idx">
          <img :src=badge.image :alt=badge.image @click="badge.drawer=true" :style="[ badge.obtained ? 'filter: none' : 'filter: grayscale']" >
          <p class="badge-name">{{ badge.name }}</p>
          <el-drawer v-model=badge.drawer direction="btt" size="50%">
            <img :src=badge.image :alt=badge.image :style="[ badge.obtained ? 'filter: none' : 'filter: grayscale']" style="width: 70px; height: 70px;">
            <p>{{ badge.name }}</p>
            <span>{{ badge.description }}</span><br>
            <span>앞으로도 Trippy에서 여행의 기억을 쌓아가세요!</span>
          </el-drawer>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { badgeNames } from '@/common/constant.js'

export default {
  name: 'BadgeListView',
  computed: {
    ...mapGetters(['badgeList', 'profile'])
  },
  watch: {
    badgeList(newValue) {
      console.log(newValue)
      this.isBadgeUnlocked()
    }
  },
  methods: {
    ...mapActions(['fetchBadges']),
    isBadgeUnlocked() {
      // 왜 getters에서 바로 못가져오는지(this.badgeList) 아직도 의문
      var unlockedBadgeList = this.$store.getters.badgeList || []
        unlockedBadgeList.forEach( myBadge => {
          console.log(myBadge)
          if ( myBadge.name === badgeNames.firstSignUp) {
            this.badges[0].obtained = true
          } if ( myBadge.name === badgeNames.firstDiary) {
            this.badges[1].obtained = true
          } if ( myBadge.name === badgeNames.firstPost) {
            this.badges[2].obtained = true
          }
        })
    }
  },
  mounted() {
    this.fetchBadges(this.profile.id)
  },
  data () {
    return {
      badges: [
        {
          pk: 1,
          name: '여행의 시작',
          description: 'Trippy에 오신 것을 환영합니다!',
          image: require('@/assets/badge-start.png'),
          drawer: false,
          obtained: false,
        },
        {
          pk: 2,
          name: '기록의 시작',
          description: '첫 여행 일지를 기록하셨군요!',
          image: require('@/assets/badge-diary.png'),
          drawer: false,
          obtained: false,
        },
        {
          pk: 3,
          name: '만남의 시작',
          description: '첫 동행 글을 작성하셨군요!',
          image: require('@/assets/badge-chat.png'),
          drawer: false,
          obtained: false,
        },
        {
          pk: 4,
          name: '???',
          description: '다음에는 어떤 뱃지가 있을까요?',
          image: require('@/assets/badge-lock.png'),
          drawer: false,
          obtained: false,
        },
        {
          pk: 5,
          name: '???',
          description: '다음에는 어떤 뱃지가 있을까요?',
          image: require('@/assets/badge-lock.png'),
          drawer: false,
          obtained: false,
        },
        {
          pk: 6,
          name: '???',
          description: '다음에는 어떤 뱃지가 있을까요?',
          image: require('@/assets/badge-lock.png'),
          drawer: false,
          obtained: false,
        },
        {
          pk: 7,
          name: '???',
          description: '다음에는 어떤 뱃지가 있을까요?',
          image: require('@/assets/badge-lock.png'),
          drawer: false,
          obtained: false,
        },
        {
          pk: 8,
          name: '???',
          description: '다음에는 어떤 뱃지가 있을까요?',
          image: require('@/assets/badge-lock.png'),
          drawer: false,
          obtained: false,
        },
        {
          pk: 9,
          name: '???',
          description: '다음에는 어떤 뱃지가 있을까요?',
          image: require('@/assets/badge-lock.png'),
          drawer: false,
          obtained: false,
        },
        {
          pk: 10,
          name: '???',
          description: '다음에는 어떤 뱃지가 있을까요?',
          image: require('@/assets/badge-lock.png'),
          drawer: false,
          obtained: false,
        },
        {
          pk: 11,
          name: '???',
          description: '다음에는 어떤 뱃지가 있을까요?',
          image: require('@/assets/badge-lock.png'),
          drawer: false,
          obtained: false,
        },
        {
          pk: 12,
          name: '???',
          description: '다음에는 어떤 뱃지가 있을까요?',
          image: require('@/assets/badge-lock.png'),
          drawer: false,
          obtained: false,
        },
      ],

    }
  }
}
</script>

<style scoped>
.container {
  position: relative;
  margin: 5%;
}

.description {
  height: 10vh;
  margin: 3% 0;
  font-size: 0.9rem;
}

.badge-list {
  margin-top: 8%;
}


.badge {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  margin-bottom: 5%;
}

.badge-name {
  display: flex;
  justify-content: center;
}

img {
  width: 20vw;
  height: 20vw;
  filter: grayscale(100%)
}

</style>\