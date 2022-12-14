import store from '../store'
import VueCookies from 'vue-cookies'
import { ElMessageBox } from 'element-plus'
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/home/HomeView.vue'
import SearchView from '@/views/home/SearchView.vue'

import DiaryCreateView from '../views/diary/DiaryCreateView.vue'
import DiaryDetailView from '../views/diary/DiaryDetailView.vue'
import DiaryEditView from '../views/diary/DiaryEditView.vue'
import DiaryDeleteView from '../views/diary/DiaryDeleteView.vue'
// import DiaryCommentView from '../components/diary/DiaryCommentView.vue'

import LoginView from '@/views/account/LoginView.vue'
import SignUpView from '@/views/account/SignUpView.vue'
import SignUpOptionView from '@/views/account/SignUpOptionView.vue'
import SettingView from '@/views/account/SettingView.vue'
import PasswordFindView from '@/views/account/PasswordFindView.vue'
import PasswordChangeView from '@/views/account/PasswordChangeView.vue'

// import MyProfileView from '@/views/profile/MyProfileView.vue'
import ProfileView from '@/views/profile/ProfileView.vue'
import ProfileEditView from '@/views/profile/ProfileEditView.vue'

import CommunityCreateView from '@/views/community/CommunityCreateView.vue'
import CommunityView from '@/views/community/CommunityView.vue'
import CommunityDetailView from '@/views/community/CommunityDetailView.vue'
import CommunityEditView from '@/views/community/CommunityEditView.vue'
import ChatListView from '@/views/community/ChatListView.vue'

import BadgeListView from '../views/badge/BadgeListView.vue'

import NotFound404View from '@/views/handler/NotFound404View.vue'

const routes = [
  // 모두가 접근 가능한 route
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/search',
    name: 'search',
    component: SearchView
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/signup',
    name: 'signUp',
    component: SignUpView
  },
  {
    path: '/signup/option',
    name: 'signUpOption',
    component: SignUpOptionView
  },
  {
    path: '/setting',
    name: 'setting',
    component: SettingView
  },
  {
    path: '/passwordchange',
    name: 'passwordChange',
    component: PasswordChangeView
  },
  {
    path: '/passwordfind',
    name: 'passwordFind',
    component: PasswordFindView
  },
  {
    path: '/404',
    name: 'notFound404',
    component: NotFound404View
  },
  {
    path: '/:catchAll(.*)',
    redirect: '/404'
  }, 


  // login한 사용자만 접근 가능한 route
  {
    path: '/diary/create',
    name: 'diaryCreate',
    component: DiaryCreateView
  },
  {
    path: '/diary/:diaryPk',
    name: 'diaryDetail',
    component: DiaryDetailView
  },
  {
    path: '/diary/edit/:diaryPk',
    name: 'diaryEdit',
    component: DiaryEditView
  },
  {
    path: '/diary/delete',
    name: 'diaryDelete',
    component: DiaryDeleteView
  },
  // {
  //   path: '/diary/comment',
  //   // 나중에 pk 추가하기
  //   name: 'diaryComment',
  //   component: DiaryCommentView
  // },


  {
    path: '/profile/:authorId',
    name: 'profile',
    component: ProfileView,
  },
  
  {
    path: '/profile/edit',
    name: 'profileEdit',
    component: ProfileEditView,
  },


  {
    path: '/community',
    name: 'community',
    component: CommunityView,
  },

  {
    path: '/community/:postPk',
    name: 'communityDetail',
    component: CommunityDetailView,
  },
  {
    path: '/community/create',
    name: 'communityCreate',
    component: CommunityCreateView,
  },
  {
    path: '/community/edit/:postPk',
    name: 'communityEdit',
    component: CommunityEditView,
  },

  
  {
    path: '/badge',
    name: 'badgeList',
    component: BadgeListView,
  },
  
  {
    path: '/chat',
    name: 'chatList',
    component: ChatListView,
  },
  

  
]


const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})


router.beforeEach( async(to, from, next) => {

      const authPages = [
      'diaryCreate', 'diaryEdit', 'diaryDetail',
      'profile', 'profileEdit', 
      'community', 'communityEdit', 'communityDetail', 'communityCreate',
      'badgeList', 'chatList'
    ]
    const isAuthRequired = authPages.includes(to.name)
  
    if (VueCookies.get('accessToken')===null && VueCookies.get('refreshToken') !== null){
      //refreshToken은 있고 accessToken이 없을 경우 토큰 재발급 요청
      console.log('passed')
      await store.dispatch('reissueToken')
    }
    if (VueCookies.get('accessToken')!==null){
      //accessToken이 있을 경우 진행
      return next();
    }
    if (isAuthRequired && VueCookies.get('accessToken')===null && VueCookies.get('refreshToken')===null){
      //2개 토큰이 모두 없을 경우 로그인페이지로
      ElMessageBox.alert('로그인을 해주세요!', '알림', {
        confirmButtonText: 'OK',
      })
      return next('/login');
    }
    return next();
})

// router.beforeEach( async(to, from, next) => {
//   // const refreshToken = VueCookies.get('refreshToken')
//   // const accessToken = VueCookies.get('accessToken')

//   const authPages = [
//     'diaryCreate', 'diaryEdit', 'diaryDetail',
//     'profile', 'profileEdit', 
//     'community', 'communityEdit', 'communityDetail', 'communityCreate',
//     'badgeList', 'chatList'
//   ]

//   const isAuthRequired = authPages.includes(to.name)
  
//     if (isAuthRequired && VueCookies.get('accessToken')===null && VueCookies.get('refreshToken') !== null){
//       //refreshToken은 있고 accessToken이 없을 경우 토큰 재발급 요청
//       console.log('passed')
//       await store.dispatch('reissueToken')
//     }
//     if (isAuthRequired && VueCookies.get('accessToken')!==null){
//       //accessToken이 있을 경우 진행
//       return next();
//     }
//     if (isAuthRequired && VueCookies.get('accessToken')===null && VueCookies.get('refreshToken')===null){
//       console.log(store)
//       //2개 토큰이 모두 없을 경우 로그인페이지로
//       alert('로그인을 해주세요!')
//       return next({name: 'login'});
//     }
//     return next();
// })

export default router