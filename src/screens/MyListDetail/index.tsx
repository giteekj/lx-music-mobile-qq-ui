import React, { memo, useCallback, useEffect, useState } from 'react'
import {
  View, FlatList, TouchableOpacity,
} from 'react-native'
import Text from '@/components/common/Text'
import { useTheme } from '@/store/theme/hook'
import { createStyle } from '@/utils/tools'
import { Icon } from '@/components/common/Icon'
import StatusBar from '@/components/common/StatusBar'
import PageContent from '@/components/PageContent'
import PlayerBar from '@/components/player/PlayerBar'
import Badge from '@/components/common/Badge'
import { Navigation } from 'react-native-navigation'
import { LIST_IDS, LIST_ITEM_HEIGHT } from '@/config/constant'
import { getListMusics, setTempList } from '@/core/list'
import { playList } from '@/core/player/player'
import { getPlayHistory, clearPlayHistory } from '@/utils/data'
import { useI18n } from '@/lang'
import { scaleSizeH } from '@/utils/pixelRatio'

const ITEM_HEIGHT = scaleSizeH(LIST_ITEM_HEIGHT)

type Mode = 'list' | 'history'

interface Props {
  componentId: string
  listId?: string
  title?: string
  mode?: Mode
}

export default ({ componentId, listId, title, mode = 'list' }: Props) => {
  const t = useI18n()
  const theme = useTheme()
  const [songs, setSongs] = useState<LX.Music.MusicInfo[]>([])
  const [loading, setLoading] = useState(true)
  const isHistory = mode === 'history'

  const loadData = useCallback(async() => {
    setLoading(true)
    try {
      if (isHistory) {
        const history = await getPlayHistory()
        setSongs(history)
      } else if (listId) {
        const list = await getListMusics(listId)
        setSongs(list)
      }
    } catch (err) {
      console.warn('loadData error', err)
    } finally {
      setLoading(false)
    }
  }, [isHistory, listId])

  useEffect(() => {
    void loadData()
    if (isHistory) {
      const handler = () => void loadData()
      global.app_event.on('playHistoryUpdate', handler)
      return () => global.app_event.off('playHistoryUpdate', handler)
    } else if (listId) {
      const handler = (ids: string[]) => {
        if (ids.includes(listId!)) void loadData()
      }
      global.app_event.on('myListMusicUpdate', handler)
      return () => global.app_event.off('myListMusicUpdate', handler)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleBack = useCallback(() => {
    void Navigation.pop(componentId)
  }, [componentId])

  const handlePlayAll = useCallback(() => {
    if (!songs.length) return
    const targetListId = isHistory ? LIST_IDS.TEMP : listId!
    if (isHistory) {
      void setTempList('playHistory', songs as LX.Music.MusicInfoOnline[]).then(() => {
        void playList(LIST_IDS.TEMP, 0)
      })
    } else {
      void playList(targetListId, 0)
    }
  }, [songs, isHistory, listId])

  const handleShufflePlay = useCallback(() => {
    if (!songs.length) return
    const shuffled = [...songs].sort(() => Math.random() - 0.5)
    if (isHistory) {
      void setTempList('playHistory', shuffled as LX.Music.MusicInfoOnline[]).then(() => {
        void playList(LIST_IDS.TEMP, 0)
      })
    } else {
      void playList(listId!, 0)
    }
  }, [songs, isHistory, listId])

  const handlePlayItem = useCallback((item: LX.Music.MusicInfo, index: number) => {
    if (isHistory) {
      void setTempList('playHistory', songs as LX.Music.MusicInfoOnline[]).then(() => {
        void playList(LIST_IDS.TEMP, index)
      })
    } else {
      void playList(listId!, index)
    }
  }, [songs, isHistory, listId])

  const handleClearHistory = useCallback(() => {
    void clearPlayHistory().then(() => {
      setSongs([])
      global.app_event.playHistoryUpdate()
    })
  }, [])

  const headerTitle = title || (isHistory ? '最近播放' : '收藏')

  const renderItem = useCallback(({ item, index }: { item: LX.Music.MusicInfo, index: number }) => {
    const singer = item.singer || ''
    return (
      <SongItem
        item={item}
        index={index}
        onPress={handlePlayItem}
        theme={theme}
      />
    )
  }, [handlePlayItem, theme])

  return (
    <PageContent>
      <StatusBar />
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme['c-primary-light-900-alpha-500'] }]}>
        <TouchableOpacity style={styles.backBtn} onPress={handleBack} activeOpacity={0.6}>
          <Icon name="chevron-left" color={theme['c-font']} rawSize={26} />
        </TouchableOpacity>
        <Text size={18} color={theme['c-font']} style={styles.headerTitle}>{headerTitle}</Text>
        {isHistory && songs.length > 0 ? (
          <TouchableOpacity style={styles.clearBtn} onPress={handleClearHistory} activeOpacity={0.6}>
            <Icon name="remove" color={theme['c-font-label']} rawSize={20} />
          </TouchableOpacity>
        ) : (
          <View style={styles.clearBtn} />
        )}
      </View>

      {/* Action Bar */}
      {songs.length > 0 && (
        <View style={[styles.actionBar, { backgroundColor: theme['c-primary-light-1000'] }]}>
          <TouchableOpacity style={styles.actionBtn} onPress={handlePlayAll} activeOpacity={0.6}>
            <View style={[styles.actionIconWrap, { backgroundColor: theme['c-primary-light-800-alpha-300'] }]}>
              <Icon name="play-outline" color={theme['c-primary']} rawSize={20} />
            </View>
            <Text size={13} color={theme['c-font']}>播放全部</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={handleShufflePlay} activeOpacity={0.6}>
            <View style={[styles.actionIconWrap, { backgroundColor: theme['c-primary-light-800-alpha-300'] }]}>
              <Icon name="list-random" color={theme['c-primary']} rawSize={20} />
            </View>
            <Text size={13} color={theme['c-font']}>随机播放</Text>
          </TouchableOpacity>
          <View style={styles.countWrap}>
            <Text size={13} color={theme['c-font-label']}>{songs.length} 首</Text>
          </View>
        </View>
      )}

      {/* Song List */}
      {loading ? (
        <View style={styles.emptyWrap}>
          <Text size={14} color={theme['c-font-label']}>加载中...</Text>
        </View>
      ) : songs.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Icon name="album" color={theme['c-font-label']} rawSize={48} />
          <Text size={14} color={theme['c-font-label']} style={{ marginTop: 12 }}>
            {isHistory ? '暂无播放记录' : '暂无收藏歌曲'}
          </Text>
          <Text size={12} color={theme['c-font-label']} style={{ marginTop: 4 }}>
            {isHistory ? '播放歌曲后会自动记录' : '去发现好音乐收藏吧'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={songs}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          getItemLayout={(_, index) => ({ length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index })}
          contentContainerStyle={{ paddingBottom: 80 }}
          removeClippedSubviews
          initialNumToRender={20}
          maxToRenderPerBatch={20}
        />
      )}
      <PlayerBar />
    </PageContent>
  )
}

const SongItem = memo(({ item, index, onPress, theme }: {
  item: LX.Music.MusicInfo
  index: number
  onPress: (item: LX.Music.MusicInfo, index: number) => void
  theme: any
}) => {
  const singer = item.singer || ''
  return (
    <TouchableOpacity
      style={[styles.songItem, { height: ITEM_HEIGHT }]}
      activeOpacity={0.6}
      onPress={() => onPress(item, index)}
    >
      <Text style={styles.songIndex} size={13} color={theme['c-300']}>{index + 1}</Text>
      <View style={styles.songInfo}>
        <Text color={theme['c-font']} numberOfLines={1}>{item.name}</Text>
        <View style={styles.songMeta}>
          {item.source ? <Badge>{item.source.toUpperCase()}</Badge> : null}
          <Text style={styles.songSinger} size={11} color={theme['c-500']} numberOfLines={1}>
            {singer}
          </Text>
        </View>
      </View>
      {item.interval ? (
        <Text size={12} color={theme['c-250']} numberOfLines={1}>{item.interval}</Text>
      ) : null}
    </TouchableOpacity>
  )
})

const styles = createStyle({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 12,
    paddingHorizontal: 8,
  },
  backBtn: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  clearBtn: {
    padding: 8,
    width: 44,
    alignItems: 'center',
  },
  actionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 20,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countWrap: {
    flex: 1,
    alignItems: 'flex-end',
  },
  songItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  songIndex: {
    width: 32,
    textAlign: 'center',
  },
  songInfo: {
    flex: 1,
    marginLeft: 8,
    justifyContent: 'center',
  },
  songMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    gap: 6,
  },
  songSinger: {
    flexShrink: 1,
  },
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 60,
  },
})
