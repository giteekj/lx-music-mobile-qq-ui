import { getMusicUrl as getOnlineMusicUrl } from './music/online'
import { downloadFile, externalStorageDirectoryPath, mkdir, existsFile } from '@/utils/fs'
import { toast } from '@/utils/tools'
import settingState from '@/store/setting/state'

const DOWNLOAD_DIR = `${externalStorageDirectoryPath}/Music/yueyin`

const sanitizeFileName = (name: string) => {
  return name.replace(/[\/\\:*?"<>|]/g, '_').trim()
}

const getDownloadPath = (musicInfo: LX.Music.MusicInfoOnline, url: string): string => {
  const fileNameSetting = settingState.setting['download.fileName'] || '歌名 - 歌手'
  const songName = sanitizeFileName(musicInfo.name)
  const singer = sanitizeFileName(musicInfo.singer || '未知')
  let fileName: string
  switch (fileNameSetting) {
    case '歌手 - 歌名':
      fileName = `${singer} - ${songName}`
      break
    case '歌名':
      fileName = songName
      break
    default:
      fileName = `${songName} - ${singer}`
  }
  // Determine extension from URL or default to mp3
  const urlExt = url.split('?')[0].split('.').pop()?.toLowerCase()
  const ext = ['mp3', 'flac', 'wav', 'ape'].includes(urlExt || '') ? urlExt : 'mp3'
  return `${DOWNLOAD_DIR}/${fileName}.${ext}`
}

export const downloadMusic = async(musicInfo: LX.Music.MusicInfoOnline) => {
  try {
    toast('开始下载...', 'short')

    // Ensure download directory exists
    const dirExists = await existsFile(DOWNLOAD_DIR)
    if (!dirExists) {
      await mkdir(DOWNLOAD_DIR)
    }

    // Get music URL
    const { getPlayQuality } = await import('./music/utils')
    const quality = getPlayQuality(settingState.setting['player.playQuality'], musicInfo)
    const url = await getOnlineMusicUrl({
      musicInfo,
      quality,
      isRefresh: false,
    })

    if (!url) {
      toast('获取下载链接失败', 'short')
      return
    }

    const filePath = getDownloadPath(musicInfo, url)

    // Check if file already exists
    const fileExists = await existsFile(filePath)
    if (fileExists) {
      toast('文件已存在', 'short')
      return
    }

    // Start download
    const ret = downloadFile(url, filePath, {
      progress: (res) => {
        if (res.contentLength > 0) {
          const percent = Math.floor((res.bytesWritten / res.contentLength) * 100)
          if (percent % 25 === 0) {
            toast(`下载进度: ${percent}%`, 'short')
          }
        }
      },
    })

    ret.promise.then(() => {
      toast(`下载完成: ${musicInfo.name}`, 'long')
    }).catch((err) => {
      console.warn('Download error:', err)
      toast('下载失败，请重试', 'short')
    })
  } catch (err) {
    console.warn('downloadMusic error:', err)
    toast('下载失败: ' + (err instanceof Error ? err.message : '未知错误'), 'short')
  }
}
