import { memo } from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import { useTheme } from '@/store/theme/hook'
import { Icon } from '@/components/common/Icon'
import Text from '@/components/common/Text'
import { createStyle } from '@/utils/tools'
import { scaleSizeW } from '@/utils/pixelRatio'

export interface TabItem {
  id: string
  label: string
  icon: string
}

export const TAB_ITEMS: TabItem[] = [
  { id: 'nav_search', label: '首页', icon: 'home' },
  { id: 'nav_songlist', label: '音乐馆', icon: 'album' },
  { id: 'nav_top', label: '排行榜', icon: 'list' },
  { id: 'nav_love', label: '我的', icon: 'love' },
  { id: 'nav_setting', label: '设置', icon: 'cog' },
]

interface BottomTabBarProps {
  activeTab: string
  onTabPress: (tabId: string) => void
}

export default memo(({ activeTab, onTabPress }: BottomTabBarProps) => {
  const theme = useTheme()

  return (
    <View style={[styles.container, { backgroundColor: theme['c-main-background'], borderTopColor: theme['c-primary-alpha-300'] }]}>
      {TAB_ITEMS.map(tab => {
        const isActive = activeTab === tab.id
        return (
          <TouchableOpacity
            key={tab.id}
            style={styles.tab}
            onPress={() => onTabPress(tab.id)}
            activeOpacity={0.7}
          >
            <Icon
              name={tab.icon}
              size={22}
              color={isActive ? theme['c-primary-font'] : theme['c-500']}
            />
            <Text
              size={10}
              color={isActive ? theme['c-primary-font'] : theme['c-500']}
              style={styles.tabLabel}
            >
              {tab.label}
            </Text>
            {isActive && (
              <View style={[styles.activeIndicator, { backgroundColor: theme['c-primary'] }]} />
            )}
          </TouchableOpacity>
        )
      })}
    </View>
  )
})

const INDICATOR_WIDTH = scaleSizeW(16)
const INDICATOR_HEIGHT = 3

const styles = createStyle({
  container: {
    flexDirection: 'row',
    height: 56,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingBottom: 4,
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  tabLabel: {
    marginTop: 2,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 2,
    width: INDICATOR_WIDTH,
    height: INDICATOR_HEIGHT,
    borderRadius: INDICATOR_HEIGHT / 2,
  },
})
