import React, { memo, useEffect, useState } from 'react'
import {
  View, ScrollView, TouchableOpacity, Image,
} from 'react-native'
import Text from '@/components/common/Text'
import { useTheme } from '@/store/theme/hook'
import { createStyle } from '@/utils/tools'
import { Icon } from '@/components/common/Icon'
import { useI18n } from '@/lang'
import { pushThemeCenterScreen } from '@/navigation/navigation'
import { COMPONENT_IDS } from '@/config/constant'
import { getListMusics } from '@/core/list'
import { LIST_IDS } from '@/config/constant'
import { setNavActiveId } from '@/core/common'
import commonState from '@/store/common/state'

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

export default () => {
  const t = useI18n()
  const theme = useTheme()
  const [loveCount, setLoveCount] = useState('0')

  useEffect(() => {
    const updateLoveCount = () => {
      void getListMusics(LIST_IDS.LOVE).then(list => setLoveCount(`${list.length}`))
    }
    const handleListUpdate = (ids: string[]) => {
      if (ids.includes(LIST_IDS.LOVE)) updateLoveCount()
    }
    updateLoveCount()
    global.app_event.on('myListMusicUpdate', handleListUpdate)
    return () => global.app_event.off('myListMusicUpdate', handleListUpdate)
  }, [])

  const handleOpenSettings = () => {
    setNavActiveId('nav_setting')
  }

  const handleOpenThemeCenter = () => {
    pushThemeCenterScreen(commonState.componentIds[COMPONENT_IDS.home])
  }

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
          <QuickEntry icon="love" label="收藏" count={loveCount} color="#ff6b6b" />
          <QuickEntry icon="download-2" label="本地" color="#4ecdc4" />
          <QuickEntry icon="comment" label="有声" color="#45b7d1" />
          <QuickEntry icon="music_time" label="最近" color="#f7b731" />
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
        <SectionHeader title="最近播放" />
        <View style={styles.emptyRecent}>
          <Icon name="music_time" color={theme['c-font-label']} rawSize={40} />
          <Text size={14} color={theme['c-font-label']} style={{ marginTop: 8 }}>暂无最近播放记录</Text>
        </View>
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
})
