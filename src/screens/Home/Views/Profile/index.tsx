import React, { memo, useEffect, useState, useCallback } from 'react'
import {
  View, ScrollView, TouchableOpacity, Image, FlatList,
} from 'react-native'
import Text from '@/components/common/Text'
import { useTheme } from '@/store/theme/hook'
import { createStyle } from '@/utils/tools'
import { Icon } from '@/components/common/Icon'
import { useI18n } from '@/lang'
import { pushThemeCenterScreen, pushMyListDetailScreen } from '@/navigation/navigation'
import { COMPONENT_IDS, LIST_IDS } from '@/config/constant'
import { getListMusics } from '@/core/list'
import { setNavActiveId } from '@/core/common'
import commonState from '@/store/common/state'
import { getPlayHistory } from '@/utils/data'
import { playList } from '@/core/player/player'
import { setTempList } from '@/core/list'
import Badge from '@/components/common/Badge'
import { scaleSizeH } from '@/utils/pixelRatio'

const QuickEntry = memo(({ icon, label, count, onPress, color }: {
  icon: string
  label: string
  count?: string
  onPress?: () => void
  color?: string
}) => {
  const theme = useTheme()
  return (
    <TouchableOpacity style={styles.entryItem} activeOpacity={0.6} onPress={onPress}>
      <View style={[styles.entryIconWrap, { backgroundColor: color ? color + '20' : theme['c-primary-light-800-alpha-300'] }]}>
        <Icon name={icon as any} color={color || theme['c-primary']} rawSize={22} />
      </View>
      <Text size={13} color={theme['c-font']} style={styles.entryLabel}>{label}</Text>
      {count ? <Text size={11} color={theme['c-font-label']}>{count}</Text> : null}
    </TouchableOpacity>
  )
})

const SectionHeader = memo(({ title, onMore }: { title: string; onMore?: () => void }) => {
  const theme = useTheme()
  return (
    <View style={styles.sectionHeader}>
      <Text size={16} color={theme['c-font']} style={styles.sectionTitle}>{title}</Text>
      {onMore ? (
        <TouchableOpacity onPress={onMore} style={styles.moreBtn}>
          <Text size={13} color={theme['c-primary']}>更多</Text>
          <Icon name="chevron-right" color={theme['c-primary']} rawSize={14} />
        </TouchableOpacity>
      ) : null}
    </View>
  )
})

const RecentSongItem = memo(({ item, index, onPress, theme }: {
  item: LX.Music.MusicInfo
  index: number
  onPress: (item: LX.Music.MusicInfo, index: number) => void
  theme: any
}) => (
  <TouchableOpacity
    style={[styles.recentSongItem, { backgroundColor: theme['c-primary-light-900-alpha-300'] }]}
    activeOpacity={0.6}
    onPress={() => onPress(item, index)}
  >
    <View style={styles.recentSongInfo}>
      <Text size={14} color={theme['c-font']} numberOfLines={1}>{item.name}</Text>
      <View style={styles.recentSongMeta}>
        {item.source ? <Badge>{item.source.toUpperCase()}</Badge> : null}
        <Text size={11} color={theme['c-font-label']} numberOfLines={1} style={{ flexShrink: 1, marginLeft: 4 }}>
          {item.singer || ''}
        </Text>
      </View>
    </View>
    <Icon name="play-outline" color={theme['c-primary']} rawSize={28} />
  </TouchableOpacity>
))

export default () => {
  const t = useI18n()
  const theme = useTheme()
  const [loveCount, setLoveCount] = useState('0')
  const [recentSongs, setRecentSongs] = useState<LX.Music.MusicInfo[]>([])

  const updateLoveCount = useCallback(() => {
    void getListMusics(LIST_IDS.LOVE).then(list => setLoveCount(`${list.length}`))
  }, [])

  const updateRecentSongs = useCallback(async() => {
    const history = await getPlayHistory()
    setRecentSongs(history.slice(0, 5))
  }, [])

  useEffect(() => {
    updateLoveCount()
    updateRecentSongs()

    const handleListUpdate = (ids: string[]) => {
      if (ids.includes(LIST_IDS.LOVE)) updateLoveCount()
    }
    const handlePlayHistoryUpdate = () => {
      void updateRecentSongs()
    }

    global.app_event.on('myListMusicUpdate', handleListUpdate)
    global.app_event.on('playHistoryUpdate', handlePlayHistoryUpdate)
    return () => {
      global.app_event.off('myListMusicUpdate', handleListUpdate)
      global.app_event.off('playHistoryUpdate', handlePlayHistoryUpdate)
    }
  }, [updateLoveCount, updateRecentSongs])

  const handleOpenSettings = () => {
    setNavActiveId('nav_setting')
  }

  const handleOpenThemeCenter = () => {
    const id = commonState.componentIds[COMPONENT_IDS.home]
    if (id) pushThemeCenterScreen(id)
  }

  const handleOpenLove = () => {
    const id = commonState.componentIds[COMPONENT_IDS.home]
    if (id) pushMyListDetailScreen(id, {
      listId: LIST_IDS.LOVE,
      title: '我的收藏',
      mode: 'list',
    })
  }

  const handleOpenHistory = () => {
    const id = commonState.componentIds[COMPONENT_IDS.home]
    if (id) pushMyListDetailScreen(id, {
      title: '最近播放',
      mode: 'history',
    })
  }

  const handleOpenLocal = () => {
    const id = commonState.componentIds[COMPONENT_IDS.home]
    if (id) pushMyListDetailScreen(id, {
      listId: LIST_IDS.DEFAULT,
      title: '试听列表',
      mode: 'list',
    })
  }

  const handleOpenSonglist = () => {
    setNavActiveId('nav_songlist')
  }

  const handlePlayRecent = useCallback((item: LX.Music.MusicInfo, index: number) => {
    void setTempList('playHistory', recentSongs as LX.Music.MusicInfoOnline[]).then(() => {
      void playList(LIST_IDS.TEMP, index)
    })
  }, [recentSongs])

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme['c-content-background'] }}>
      {/* User Header */}
      <View style={[styles.userHeader, { backgroundColor: theme['c-primary-light-900-alpha-500'] }]}>
        <View style={styles.userInfo}>
          <View style={styles.avatarWrap}>
            <Image source={require('@/resources/images/defaultUser.jpg')} style={styles.avatar} />
          </View>
          <View style={styles.userMeta}>
            <Text size={18} color={theme['c-font']} style={styles.userName}>音乐爱好者</Text>
            <Text size={12} color={theme['c-font-label']}>VIP 会员</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.settingsBtn} onPress={handleOpenSettings}>
          <Icon name="setting" color={theme['c-font']} rawSize={22} />
        </TouchableOpacity>
      </View>

      {/* Quick Entries */}
      <View style={[styles.entriesCard, { backgroundColor: theme['c-primary-light-1000'] }]}>
        <View style={styles.entriesRow}>
          <QuickEntry icon="love" label="收藏" count={loveCount} color="#ff6b6b" onPress={handleOpenLove} />
          <QuickEntry icon="album" label="试听" color="#4ecdc4" onPress={handleOpenLocal} />
          <QuickEntry icon="list-order" label="歌单" color="#45b7d1" onPress={handleOpenSonglist} />
          <QuickEntry icon="music_time" label="最近" color="#f7b731" onPress={handleOpenHistory} />
        </View>
      </View>

      {/* Theme Center Entry */}
      <View style={[styles.menuCard, { backgroundColor: theme['c-primary-light-1000'] }]}>
        <TouchableOpacity style={styles.menuItem} activeOpacity={0.6} onPress={handleOpenThemeCenter}>
          <View style={[styles.menuIconWrap, { backgroundColor: theme['c-primary-light-800-alpha-300'] }]}>
            <Icon name="slider" color={theme['c-primary']} rawSize={18} />
          </View>
          <Text size={15} color={theme['c-font']} style={styles.menuText}>装扮中心</Text>
          <Icon name="chevron-right" color={theme['c-font-label']} rawSize={16} />
        </TouchableOpacity>
        <View style={[styles.divider, { backgroundColor: theme['c-border-background'] }]} />
        <TouchableOpacity style={styles.menuItem} activeOpacity={0.6} onPress={handleOpenSettings}>
          <View style={[styles.menuIconWrap, { backgroundColor: theme['c-primary-light-800-alpha-300'] }]}>
            <Icon name="setting" color={theme['c-primary']} rawSize={18} />
          </View>
          <Text size={15} color={theme['c-font']} style={styles.menuText}>设置</Text>
          <Icon name="chevron-right" color={theme['c-font-label']} rawSize={16} />
        </TouchableOpacity>
      </View>

      {/* Recent Play */}
      <View style={[styles.menuCard, { backgroundColor: theme['c-primary-light-1000'] }]}>
        <SectionHeader title="最近播放" onMore={recentSongs.length > 0 ? handleOpenHistory : undefined} />
        {recentSongs.length === 0 ? (
          <View style={styles.emptyRecent}>
            <Icon name="music_time" color={theme['c-font-label']} rawSize={40} />
            <Text size={14} color={theme['c-font-label']} style={{ marginTop: 8 }}>暂无播放记录</Text>
            <Text size={12} color={theme['c-font-label']} style={{ marginTop: 4 }}>播放歌曲后会自动记录</Text>
          </View>
        ) : (
          <View style={styles.recentList}>
            {recentSongs.map((item, index) => (
              <RecentSongItem
                key={`${item.id}_${index}`}
                item={item}
                index={index}
                onPress={handlePlayRecent}
                theme={theme}
              />
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  )
}

const styles = createStyle({
  userHeader: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: 'hidden',
    backgroundColor: '#ddd',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  avatar: {
    width: 64,
    height: 64,
  },
  userMeta: {
    marginLeft: 16,
  },
  userName: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  settingsBtn: {
    padding: 8,
  },
  entriesCard: {
    marginHorizontal: 16,
    marginTop: -10,
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  entriesRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  entryItem: {
    alignItems: 'center',
    minWidth: 60,
  },
  entryIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  entryLabel: {
    marginBottom: 2,
  },
  menuCard: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    paddingVertical: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  menuIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuText: {
    flex: 1,
  },
  divider: {
    height: 1,
    marginHorizontal: 16,
    opacity: 0.5,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontWeight: '600',
  },
  moreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptyRecent: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  recentList: {
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  recentSongItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 6,
  },
  recentSongInfo: {
    flex: 1,
    marginRight: 8,
  },
  recentSongMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
})
