<template>
  <div class="diary-create-div">
    <!-- <diary-form v-if="isDiary" :diary="diaryTemp" action="update"></diary-form> -->
    <!-- {{ diary }} -->
    <!-- {{ convertImg }} -->
    <diary-edit-form :diary="diary" :story="convertStories" :trans="convertTransports" :editimages="convertImg" action="update"></diary-edit-form>
  </div>
</template>

<script>
import DiaryEditForm from '@/components/diary/DiaryEditForm.vue'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'DiaryEditView',
  components: {
    DiaryEditForm
  },
  data() {
    return {
      // images: []
    }
  },
  computed: {
    ...mapGetters(['isDiary', 'diary', 'images']),
    convertTransports() {
      const trans = [];
      this.diary.postTransports.forEach((each) => {
        if (each.name === '뚜벅이') {
          trans.push({transport: 
          {
            id: 1,
            name: '뚜벅이'
          }})
        }
        else if (each.name === '대중교통') {
          trans.push({transport: 
          {
            id: 2,
            name: '대중교통'
          }})         
        }
        else if (each.name === '따릉이') {
          trans.push({transport: 
          {
            id: 3,
            name: '따릉이'
          }}) 
        }
        else if (each.name === '택시') {
          trans.push({transport: 
          {
            id: 4,
            name: '택시'
          }})           
        }
        else if (each.name === '자차') {
          trans.push({transport: 
          {
            id: 5,
            name: '자차'
          }})           
        }       
      })
      return trans
    },
    convertStories() {
      const convert = [];
      this.diary.detailLocations.forEach((story) => {
        console.log(story)
        const each = {}
        each.detailLocationName = story.detailLocationName
        each.detailLocationContent = story.detailLocationContent
        each.rating = story.rating
        each.filename = story.filename
        convert.push(each)
      })
      return convert
    },
    // convertImg() {
    //   const images = []
    //   this.diary.detailLocations.forEach((location) => {
    //     images.push(location.filepath)
    //   })
    //   // images.push([])
    //   return images
    // },
    // convertFile() {
    //   const filenames = []
    //   this.diary.detailLocations.forEach((location) => {
    //     filenames.push(location.filename)
    //   })
    //   filenames.push('')
    //   return filenames
    // }
    convertImg() {
      const images = []
      this.diary.detailLocations.forEach((location) => {
        console.log(location)
        images.push([])
      })
      return images
    }
  },
  methods: {
    ...mapActions(['fetchDiary'])
  },
  created() {
    this.fetchDiary(this.$route.params.diaryPk)
  }
}
</script>

<style scoped>
.diary-create-div {
  margin: 1rem 1rem 2rem 1rem;
}
</style>