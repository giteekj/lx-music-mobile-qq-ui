//! 更新默认主题配置后，需要执行 npm run build:theme 重新构建index.json

const fs = require('fs')
const path = require('path')
const { createThemeColors } = require('./utils')

const defaultThemes = [
  {
    id: 'qq_music',
    name: 'QQ音乐',
    isDark: true,
    config: {
      primary: 'rgb(49, 194, 124)',
      font: 'rgb(255, 255, 255)',
      'c-app-background': 'rgba(0, 0, 0, 0.95)',
      'c-main-background': 'rgba(18, 18, 18, 0.98)',
      'bg-image': '',
      'bg-image-position': 'center',
      'bg-image-size': 'cover',

      'c-badge-primary': 'var(c-primary)',
      'c-badge-secondary': '#4baed5',
      'c-badge-tertiary': '#e7aa36',
    },
  },
  {
    id: 'green',
    name: '绿意盎然',
    isDark: false,
    config: {
      primary: 'rgb(77, 175, 124)',
      font: 'rgb(33, 33, 33)',
      'c-app-background': 'var(c-primary-light-600-alpha-700)',
      'c-main-background': 'rgba(255, 255, 255, 1)',
      'bg-image': '',
      'bg-image-position': 'center',
      'bg-image-size': 'cover',

      'c-badge-primary': 'var(c-primary)',
      'c-badge-secondary': '#4baed5',
      'c-badge-tertiary': '#e7aa36',
    },
  },
  {
    id: 'blue',
    name: '蓝田生玉',
    isDark: false,
    config: {
      primary: 'rgb(52, 152, 219)',
      font: 'rgb(33, 33, 33)',
      'c-app-background': 'var(c-primary-light-600-alpha-700)',
      'c-main-background': 'rgba(255, 255, 255, 1)',
      'bg-image': '',
      'bg-image-position': 'center',
      'bg-image-size': 'cover',

      'c-badge-primary': 'var(c-primary)',
      'c-badge-secondary': '#5cbf9b',
      'c-badge-tertiary': '#5cbf9b',
    },
  },
  {
    id: 'blue_plus',
    name: '蛋雅深蓝',
    isDark: false,
    config: {
      primary: 'rgb(77, 131, 175)',
      font: 'rgb(33, 33, 33)',
      'c-app-background': 'var(c-primary-light-600-alpha-600)',
      'c-main-background': 'rgba(255, 255, 255, 1)',
      'bg-image': '',
      'bg-image-position': 'center',
      'bg-image-size': 'cover',

      'c-badge-primary': 'var(c-primary)',
      'c-badge-secondary': 'rgba(66.6, 150.7, 171, 1)',
      'c-badge-tertiary': 'rgba(54, 196, 231, 1)',
    },
  },
  {
    id: 'orange',
    name: '橙黄橘绿',
    isDark: false,
    config: {
      primary: 'rgb(245, 171, 53)',
      font: 'rgb(33, 33, 33)',
      'c-app-background': 'var(c-primary-light-600-alpha-700)',
      'c-main-background': 'rgba(255, 255, 255, 1)',
      'bg-image': '',
      'bg-image-position': 'center',
      'bg-image-size': 'cover',

      'c-badge-primary': 'var(c-primary)',
      'c-badge-secondary': '#9ed458',
      'c-badge-tertiary': '#9ed458',
    },
  },
  {
    id: 'brown',
    name: '泥牛入海',
    isDark: false,
    config: {
      primary: 'rgba(188, 128, 68, 1)',
      font: 'rgb(33, 33, 33)',
      'c-app-background': 'var(c-primary-light-600-alpha-700)',
      'c-main-background': 'rgba(255, 255, 255, 1)',
      'bg-image': '',
      'bg-image-position': 'center',
      'bg-image-size': 'cover',

      'c-badge-primary': 'var(c-primary)',
      'c-badge-secondary': '#483472',
      'c-badge-tertiary': '#647D39',
    },
  },
  {
    id: 'red',
    name: '热情似火',
    isDark: false,
    config: {
      primary: 'rgb(214, 69, 65)',
      font: 'rgb(33, 33, 33)',
      'c-app-background': 'var(c-primary-light-600-alpha-700)',
      'c-main-background': 'rgba(255, 255, 255, 1)',
      'bg-image': '',
      'bg-image-position': 'center',
      'bg-image-size': 'cover',

      'c-badge-primary': 'var(c-primary)',
      'c-badge-secondary': '#dfbb6b',
      'c-badge-tertiary': '#dfbb6b',
    },
  },
  {
    id: 'pink',
    name: '粉装玉琢',
    isDark: false,
    config: {
      primary: 'rgb(241, 130, 141)',
      font: 'rgb(33, 33, 33)',
      'c-app-background': 'var(c-primary-light-600-alpha-700)',
      'c-main-background': 'rgba(255, 255, 255, 1)',
      'bg-image': '',
      'bg-image-position': 'center',
      'bg-image-size': 'cover',

      'c-badge-primary': 'var(c-primary)',
      'c-badge-secondary': '#f5b684',
      'c-badge-tertiary': '#f5b684',
    },
  },
  {
    id: 'purple',
    name: '重斤球紫',
    isDark: false,
    config: {
      primary: 'rgb(155, 89, 182)',
      font: 'rgb(33, 33, 33)',
      'c-app-background': 'var(c-primary-light-600-alpha-700)',
      'c-main-background': 'rgba(255, 255, 255, 1)',
      'bg-image': '',
      'bg-image-position': 'center',
      'bg-image-size': 'cover',

      'c-badge-primary': 'var(c-primary)',
      'c-badge-secondary': '#e5a39f',
      'c-badge-tertiary': '#e5a39f',
    },
  },
  {
    id: 'grey',
    name: '灰常美丽',
    isDark: false,
    config: {
      primary: 'rgb(108, 122, 137)',
      font: 'rgb(33, 33, 33)',
      'c-app-background': 'var(c-primary-light-600-alpha-700)',
      'c-main-background': 'rgba(255, 255, 255, 1)',
      'bg-image': '',
      'bg-image-position': 'center',
      'bg-image-size': 'cover',

      'c-badge-primary': 'var(c-primary)',
      'c-badge-secondary': '#b19b9f',
      'c-badge-tertiary': '#b19b9f',
    },
  },
  {
    id: 'ming',
    name: '青出于黑',
    isDark: false,
    config: {
      primary: 'rgb(51, 110, 123)',
      font: 'rgb(33, 33, 33)',
      'c-app-background': 'var(c-primary-light-600-alpha-700)',
      'c-main-background': 'rgba(255, 255, 255, 1)',
      'bg-image': '',
      'bg-image-position': 'center',
      'bg-image-size': 'cover',

      'c-badge-primary': 'var(c-primary)',
      'c-badge-secondary': '#6376a2',
      'c-badge-tertiary': '#6376a2',
    },
  },
  {
    id: 'blue2',
    name: '清热板蓝',
    isDark: false,
    config: {
      primary: 'rgb(79, 98, 208)',
      font: 'rgb(33, 33, 33)',
      'c-app-background': 'var(c-primary-light-600-alpha-700)',
      'c-main-background': 'rgba(255, 255, 255, 1)',
      'bg-image': '',
      'bg-image-position': 'center',
      'bg-image-size': 'cover',

      'c-badge-primary': 'var(c-primary)',
      'c-badge-secondary': '#b080db',
      'c-badge-tertiary': '#b080db',
    },
  },
  {
    id: 'black',
    name: '黑灯瞎火',
    isDark: true,
    config: {
      primary: 'rgb(190, 190, 190)',
      font: 'rgb(255, 255, 255)',
      'c-app-background': 'rgba(0, 0, 0, 0)',
      'c-main-background': 'rgba(19, 19, 19, 0.95)',
      'bg-image': 'landingMoon.png',
      'bg-image-position': 'center',
      'bg-image-size': 'cover',

      'c-badge-primary': 'var(c-primary-dark-200)',
      'c-badge-secondary': 'var(c-primary)',
      'c-badge-tertiary': 'var(c-primary-dark-300)',
    },
  },
  {
    id: 'mid_autumn',
    name: '月里嫦娥',
    isDark: false,
    config: {
      primary: 'rgb(74, 55, 82)',
      font: 'rgb(33, 33, 33)',
      'c-app-background': 'rgba(255, 255, 255, 0)',
      'c-main-background': 'rgba(255, 255, 255, 0.9)',
      'bg-image': 'jqbg.jpg',
      'bg-image-position': 'center',
      'bg-image-size': 'cover',


      'c-badge-primary': 'var(c-primary)',
      'c-badge-secondary': '#af9479',
      'c-badge-tertiary': '#af9479',
    },
  },
  {
    id: 'anime_sky',
    name: '天空之镜',
    isDark: false,
    config: {
      primary: 'rgb(72, 145, 210)',
      font: 'rgb(38, 50, 66)',
      'c-app-background': 'rgba(235, 245, 252, 0.6)',
      'c-main-background': 'rgba(255, 255, 255, 0.82)',
      'bg-image': 'anime_sky_sea.png',
      'bg-image-position': 'center',
      'bg-image-size': 'cover',

      'c-badge-primary': 'var(c-primary)',
      'c-badge-secondary': '#5bbcd6',
      'c-badge-tertiary': '#7ecbf0',
    },
  },
  {
    id: 'anime_sunset',
    name: '暮色海岸',
    isDark: false,
    config: {
      primary: 'rgb(235, 120, 80)',
      font: 'rgb(56, 40, 36)',
      'c-app-background': 'rgba(255, 244, 238, 0.6)',
      'c-main-background': 'rgba(255, 255, 255, 0.82)',
      'bg-image': 'anime_sunset_beach.png',
      'bg-image-position': 'center',
      'bg-image-size': 'cover',

      'c-badge-primary': 'var(c-primary)',
      'c-badge-secondary': '#f2a65a',
      'c-badge-tertiary': '#e88fa2',
    },
  },
  {
    id: 'anime_starry',
    name: '星夜物语',
    isDark: true,
    config: {
      primary: 'rgb(140, 150, 230)',
      font: 'rgb(240, 242, 255)',
      'c-app-background': 'rgba(12, 14, 36, 0.5)',
      'c-main-background': 'rgba(20, 22, 48, 0.82)',
      'bg-image': 'anime_starry_night.png',
      'bg-image-position': 'center',
      'bg-image-size': 'cover',

      'c-badge-primary': 'var(c-primary-dark-200)',
      'c-badge-secondary': '#8f7fd4',
      'c-badge-tertiary': '#6fa8dc',
    },
  },
  {
    id: 'anime_sakura',
    name: '樱花物语',
    isDark: false,
    config: {
      primary: 'rgb(226, 120, 145)',
      font: 'rgb(58, 42, 48)',
      'c-app-background': 'rgba(255, 242, 246, 0.6)',
      'c-main-background': 'rgba(255, 255, 255, 0.82)',
      'bg-image': 'anime_sakura.png',
      'bg-image-position': 'center',
      'bg-image-size': 'cover',

      'c-badge-primary': 'var(c-primary)',
      'c-badge-secondary': '#c9a0dc',
      'c-badge-tertiary': '#f5b8a0',
    },
  },
  {
    id: 'warm_orange',
    name: '晨曦暖橘',
    isDark: false,
    config: {
      primary: 'rgb(249, 140, 83)',
      font: 'rgb(33, 33, 33)',
      'c-app-background': 'var(c-primary-light-600-alpha-700)',
      'c-main-background': 'rgba(255, 255, 255, 1)',
      'bg-image': '',
      'bg-image-position': 'center',
      'bg-image-size': 'cover',

      'c-badge-primary': 'var(c-primary)',
      'c-badge-secondary': '#f5b684',
      'c-badge-tertiary': '#dfbb6b',
    },
  },
  {
    id: 'fresh_green',
    name: '清风抹茶',
    isDark: false,
    config: {
      primary: 'rgb(134, 168, 92)',
      font: 'rgb(33, 33, 33)',
      'c-app-background': 'var(c-primary-light-600-alpha-700)',
      'c-main-background': 'rgba(255, 255, 255, 1)',
      'bg-image': '',
      'bg-image-position': 'center',
      'bg-image-size': 'cover',

      'c-badge-primary': 'var(c-primary)',
      'c-badge-secondary': '#9ed458',
      'c-badge-tertiary': '#b8d4a0',
    },
  },
  {
    id: 'clear_sky',
    name: '晴空万里',
    isDark: false,
    config: {
      primary: 'rgb(96, 165, 220)',
      font: 'rgb(33, 33, 33)',
      'c-app-background': 'var(c-primary-light-600-alpha-700)',
      'c-main-background': 'rgba(255, 255, 255, 1)',
      'bg-image': '',
      'bg-image-position': 'center',
      'bg-image-size': 'cover',

      'c-badge-primary': 'var(c-primary)',
      'c-badge-secondary': '#7ecbf0',
      'c-badge-tertiary': '#abd7fb',
    },
  },
  {
    id: 'cream_tea',
    name: '奶油甜橙',
    isDark: false,
    config: {
      primary: 'rgb(222, 148, 106)',
      font: 'rgb(33, 33, 33)',
      'c-app-background': 'var(c-primary-light-600-alpha-700)',
      'c-main-background': 'rgba(255, 255, 255, 1)',
      'bg-image': '',
      'bg-image-position': 'center',
      'bg-image-size': 'cover',

      'c-badge-primary': 'var(c-primary)',
      'c-badge-secondary': '#f5c9a8',
      'c-badge-tertiary': '#e8b88a',
    },
  },
  {
    id: 'china_ink',
    name: '近墨者黑',
    isDark: false,
    config: {
      primary: 'rgba(47, 47, 47, 1)',
      font: 'rgb(33, 33, 33)',
      'c-app-background': 'rgba(255, 255, 255, 0)',
      'c-main-background': 'rgba(255, 255, 255, 0.8)',
      'bg-image': 'china_ink.jpg',
      'bg-image-position': 'center',
      'bg-image-size': 'cover',


      'c-badge-primary': 'rgba(137, 70, 70, 1)',
      'c-badge-secondary': 'rgba(67, 139, 65, 1)',
      'c-badge-tertiary': 'rgba(132, 135, 65, 1)',
    },
  },
  {
    id: 'happy_new_year',
    name: '新年快乐',
    isDark: false,
    config: {
      primary: 'rgb(192, 57, 43)',
      font: 'rgb(33, 33, 33)',
      'c-app-background': 'rgba(255, 255, 255, 0.15)',
      'c-main-background': 'rgba(255, 255, 255, 0.8)',
      'bg-image': 'xnkl.png',
      'bg-image-position': 'center',
      'bg-image-size': 'cover',

      'c-badge-primary': '#7fb575',
      'c-badge-secondary': '#dfbb6b',
      'c-badge-tertiary': 'var(c-primary-light-100)',
    },
  },
]

const themes = defaultThemes.map(({ config: { primary, font, ...extInfo }, ...themeInfo }) => {
  return {
    ...themeInfo,
    isCustom: false,
    config: {
      themeColors: createThemeColors(primary, font, themeInfo.isDark),
      extInfo,
    },
  }
})

fs.writeFileSync(path.join(__dirname, 'themes.ts'), `/* eslint-disable */\n//! 此文件由 createThemes.js 生成\n\nexport default ${JSON.stringify(themes, null, 2)} as const`)

