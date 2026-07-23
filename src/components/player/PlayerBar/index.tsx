import { memo, useMemo } from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import { useKeyboard } from '@/utils/hooks'

import Pic from './components/Pic'
import Title from './components/Title'
import PlayInfo from './components/PlayInfo'
import ControlBtn from './components/ControlBtn'
import { createStyle } from '@/utils/tools'
import { useTheme } from '@/store/theme/hook'
import { useSettingValue } from '@/store/setting/hook'
import { scaleSizeW } from '@/utils/pixelRatio'
import { useIsPlay } from '@/store/player/hook'
import { togglePlay } from '@/core/player/player'
import { Icon } from '@/components/common/Icon'


export default memo(({ isHome = false }: { isHome?: boolean }) => {
  const { keyboardShown } = useKeyboard()
  const theme = useTheme()
  const autoHidePlayBar = useSettingValue('common.autoHidePlayBar')

  const playerComponent = useMemo(() => (
    <View style={{ ...styles.container, backgroundColor: theme['c-main-background'] }}>
      {/* 顶部细线 */}
      <View style={[styles.topLine, { backgroundColor: theme['c-primary-alpha-200'] }]} />
      <View style={styles.content}>
        <Pic isHome={isHome} />
        <TouchableOpacity style={styles.center} activeOpacity={0.7} onPress={togglePlay}>
          <Title isHome={isHome} />
          <PlayInfo isHome={isHome} />
        </TouchableOpacity>
        <View style={styles.right}>
          <ControlBtn />
        </View>
      </View>
    </View>
  ), [theme, isHome])

  return autoHidePlayBar && keyboardShown ? null : playerComponent
})

const styles = createStyle({
  container: {
    width: '100%',
    paddingHorizontal: scaleSizeW(8),
    paddingVertical: scaleSizeW(6),
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  topLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: StyleSheet.hairlineWidth,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  center: {
    flexDirection: 'column',
    flexGrow: 1,
    flexShrink: 1,
    paddingLeft: scaleSizeW(10),
    paddingRight: scaleSizeW(8),
    justifyContent: 'center',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    flexGrow: 0,
    flexShrink: 0,
  },
})
