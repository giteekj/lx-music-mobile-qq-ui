import { View } from 'react-native'
import { useTheme } from '@/store/theme/hook'
import { useNavActiveId, useStatusbarHeight } from '@/store/common/hook'
import { useI18n } from '@/lang'
import { createStyle } from '@/utils/tools'
import { Icon } from '@/components/common/Icon'
import Text from '@/components/common/Text'
import StatusBar from '@/components/common/StatusBar'
import { scaleSizeH } from '@/utils/pixelRatio'
import { HEADER_HEIGHT } from '@/config/constant'
import SearchTypeSelector from '@/screens/Home/Views/Search/SearchTypeSelector'

const headerComponents: Partial<Record<string, React.ReactNode>> = {
  nav_search: <SearchTypeSelector />,
}

const PAGE_DISPLAY_NAMES: Record<string, string> = {
  nav_search: '首页',
  nav_songlist: '音乐馆',
  nav_top: '排行榜',
  nav_love: '我的',
  nav_setting: '设置',
}

const Header = () => {
  const theme = useTheme()
  const navActiveId = useNavActiveId()
  const t = useI18n()
  const statusBarHeight = useStatusbarHeight()

  return (
    <>
      <StatusBar />
      <View style={{
        ...styles.container,
        height: scaleSizeH(HEADER_HEIGHT) + statusBarHeight,
        paddingTop: statusBarHeight,
        backgroundColor: theme['c-main-background'],
      }}>
        <View style={styles.left}>
          <View style={{
            ...styles.logoContainer,
            backgroundColor: theme['c-primary-alpha-200'],
          }}>
            <Icon name="logo" color={theme['c-primary-font']} size={20} />
          </View>
          <Text size={18} color={theme['c-font']} style={styles.titleText}>
            {PAGE_DISPLAY_NAMES[navActiveId] || t(navActiveId)}
          </Text>
        </View>
        {headerComponents[navActiveId] ?? null}
      </View>
    </>
  )
}

const styles = createStyle({
  container: {
    paddingRight: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  left: {
    flex: 1,
    flexDirection: 'row',
    paddingLeft: 12,
    alignItems: 'center',
    height: '100%',
  },
  logoContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  titleText: {
    fontWeight: '600',
  },
})

export default Header
