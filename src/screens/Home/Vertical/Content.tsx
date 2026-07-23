import { useCallback } from 'react'
import { View } from 'react-native'
import Header from './Header'
import Main from './Main'
import BottomTabBar from '@/components/common/BottomTabBar'
import { setNavActiveId } from '@/core/common'
import { useNavActiveId } from '@/store/common/hook'
import { useTheme } from '@/store/theme/hook'
import { createStyle } from '@/utils/tools'

const PAGE_TAB_MAP: Record<string, string> = {
  nav_search: 'tab_home',
  nav_songlist: 'tab_music_hall',
  nav_top: 'tab_music_hall',
  nav_love: 'tab_my',
  nav_setting: 'tab_my',
}

const getActiveTab = (navId: string): string => {
  return PAGE_TAB_MAP[navId] || 'tab_home'
}

const TAB_PAGE_MAP: Record<string, string> = {
  tab_home: 'nav_search',
  tab_music_hall: 'nav_songlist',
  tab_my: 'nav_love',
}

const Content = () => {
  const theme = useTheme()
  const navActiveId = useNavActiveId()

  const handleTabPress = useCallback((tabId: string) => {
    const pageId = TAB_PAGE_MAP[tabId]
    if (pageId) {
      setNavActiveId(pageId)
    }
  }, [])

  const activeTab = getActiveTab(navActiveId)

  return (
    <View style={[styles.container, { backgroundColor: theme['c-main-background'] }]}>
      <Header />
      <Main />
      <BottomTabBar activeTab={activeTab} onTabPress={handleTabPress} />
    </View>
  )
}

const styles = createStyle({
  container: {
    flex: 1,
  },
})

export default Content
