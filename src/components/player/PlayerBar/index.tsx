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
    <View style={styles.wrapper}>
      <View style={{ ...styles.container, backgroundColor: theme['c-main-background'] }}>
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
    </View>
  ), [theme, isHome])

  return autoHidePlayBar && keyboardShown ? null : playerComponent
})

const styles = createStyle({
  wrapper: {
    paddingHorizontal: scaleSizeW(10),
    paddingBottom: scaleSizeW(6),
    paddingTop: scaleSizeW(2),
  },
  container: {
    width: '100%',
    borderRadius: scaleSizeW(16),
    paddingHorizontal: scaleSizeW(10),
    paddingVertical: scaleSizeW(7),
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(128, 128, 128, 0.12)',
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
