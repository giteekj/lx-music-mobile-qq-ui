import { useCallback } from 'react'
import { View } from 'react-native'
import Header from './Header'
import Main from './Main'
import BottomTabBar from '@/components/common/BottomTabBar'
import { setNavActiveId } from '@/core/common'
import { useNavActiveId } from '@/store/common/hook'
import { useTheme } from '@/store/theme/hook'
import { createStyle } from '@/utils/tools'

const Content = () => {
  const theme = useTheme()
  const navActiveId = useNavActiveId()

  const handleTabPress = useCallback((tabId: Parameters<typeof setNavActiveId>[0]) => {
    setNavActiveId(tabId)
  }, [])

  return (
    <View style={[styles.container, { backgroundColor: theme['c-main-background'] }]}>
      <Header />
      <Main />
      <BottomTabBar activeTab={navActiveId} onTabPress={handleTabPress} />
    </View>
  )
}

const styles = createStyle({
  container: {
    flex: 1,
  },
})

export default Content
