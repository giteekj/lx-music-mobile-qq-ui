import type { ListInfoItem } from '@/store/songlist/state'
import musicSdk from '@/utils/musicSdk'
import { toNewMusicInfo } from '@/utils'
import { arrShuffle } from '@/utils/common'
import { setTempList } from '@/core/list'
import { playList } from '@/core/player/player'
import { LIST_IDS } from '@/config/constant'

const RECOMMEND_SOURCE: LX.OnlineSource = 'kw'

const RECOMMEND_KEYWORDS = [
  '华语流行', '经典老歌', '抖音热歌', '网络神曲', 'KTV必点',
  '周杰伦', '陈奕迅', '林俊杰', '邓紫棋', '薛之谦',
  '毛不易', '周深', '张杰', 'Taylor Swift', '轻音乐',
  '民谣', '摇滚', '电子', '伤感', '励志',
]

const SONGLIST_KEYWORDS = [
  '华语', '经典', '流行', '校园', '青春',
  '老歌', '新歌', '热歌', '抖音', '车载',
  '治愈', '晚安', '运动', '咖啡馆', '旅行',
  '古风', '粤语', '欧美', '日韩', '纯音乐',
]

const hashString = (str: string) => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

const getDailySeed = () => {
  const now = new Date()
  return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`
}

const getHourlySeed = () => {
  const now = new Date()
  return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}-${now.getHours()}`
}

const seededShuffle = <T,>(list: T[], seed: string) => {
  const shuffled = [...list]
  let seedNum = hashString(seed)
  for (let i = shuffled.length - 1; i > 0; i--) {
    seedNum = (seedNum * 9301 + 49297) % 233280
    const j = seedNum % (i + 1)
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export const getDailyRecommendSongs = async (limit = 30): Promise<LX.Music.MusicInfoOnline[]> => {
  const seed = getDailySeed()
  const keywordIndex = hashString(seed) % RECOMMEND_KEYWORDS.length
  const keyword = RECOMMEND_KEYWORDS[keywordIndex]
  try {
    const result = await musicSdk[RECOMMEND_SOURCE].musicSearch.search(keyword, 1, Math.max(limit, 30))
    const list: LX.Music.MusicInfoOnline[] = result.list.map((s: any) => toNewMusicInfo(s) as LX.Music.MusicInfoOnline)
    return seededShuffle(list, seed).slice(0, limit)
  } catch (e) {
    console.log(e)
    return []
  }
}

export const getForYouSongs = async (limit = 20): Promise<LX.Music.MusicInfoOnline[]> => {
  const keyword = RECOMMEND_KEYWORDS[Math.floor(Math.random() * RECOMMEND_KEYWORDS.length)]
  try {
    const result = await musicSdk[RECOMMEND_SOURCE].musicSearch.search(keyword, 1, Math.max(limit, 30))
    const list: LX.Music.MusicInfoOnline[] = result.list.map((s: any) => toNewMusicInfo(s) as LX.Music.MusicInfoOnline)
    return arrShuffle([...list]).slice(0, limit)
  } catch (e) {
    console.log(e)
    return []
  }
}

export const getRecommendSonglists = async (limit = 6): Promise<ListInfoItem[]> => {
  const seed = getHourlySeed()
  const keywordIndex = hashString(seed) % SONGLIST_KEYWORDS.length
  const keyword = SONGLIST_KEYWORDS[keywordIndex]
  try {
    const result = await musicSdk[RECOMMEND_SOURCE].songList.search(keyword, 1, Math.max(limit, 12))
    return seededShuffle(result.list as ListInfoItem[], seed).slice(0, limit)
  } catch (e) {
    console.log(e)
    return []
  }
}

export const playRecommendSongs = async (songs: LX.Music.MusicInfoOnline[], index = 0) => {
  if (!songs.length) return
  const listId = `recommend_${Date.now()}`
  await setTempList(listId, [...songs])
  void playList(LIST_IDS.TEMP, index)
}

export const playDailyRecommend = async () => {
  const songs = await getDailyRecommendSongs(30)
  await playRecommendSongs(songs, 0)
}

export const playForYou = async () => {
  const songs = await getForYouSongs(20)
  await playRecommendSongs(songs, 0)
}
