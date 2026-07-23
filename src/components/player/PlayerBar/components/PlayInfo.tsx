import { memo, useCallback, useState } from 'react'
import { View, StyleSheet } from 'react-native'

import Progress, { ProgressPlain } from '@/components/player/Progress'
import Status from './Status'
import { useProgress } from '@/store/player/hook'
import { useTheme } from '@/store/theme/hook'
import { createStyle } from '@/utils/tools'
import Text from '@/components/common/Text'
import { COMPONENT_IDS } from '@/config/constant'
import { usePageVisible } from '@/store/common/hook'
import { scaleSizeH, scaleSizeW, scaleSizeWR } from '@/utils/pixelRatio'
import { useBufferProgress } from '@/plugins/player'
import { useSettingValue } from '@/store/setting/hook'

const FONT_SIZE = 11
const PADDING_TOP_RAW = 1.2
const PADDING_TOP = Math.round(scaleSizeWR(PADDING_TOP_RAW))
const MARGIN_TOP = Math.round(scaleSizeH(1))
const PADDING_TOP_PROGRESS = PADDING_TOP + MARGIN_TOP

const PlayTimeCurrent = ({ timeStr }: { timeStr: string }) => {
  const theme = useTheme()
  return <Text size={FONT_SIZE} color={theme['c-500']}>{timeStr}</Text>
}

const PlayTimeMax = memo(({ timeStr }: { timeStr: string }) => {
  const theme = useTheme()
  return <Text size={FONT_SIZE} color={theme['c-500']}>{timeStr}</Text>
})

export default ({ isHome }: { isHome: boolean }) => {
  const theme = useTheme()
  const [autoUpdate, setAutoUpdate] = useState(true)
  const { maxPlayTimeStr, nowPlayTimeStr, progress, maxPlayTime } = useProgress(autoUpdate)
  const buffered = useBufferProgress()
  const allowProgressBarSeek = useSettingValue('common.allowProgressBarSeek')

  usePageVisible([COMPONENT_IDS.home], useCallback((visible) => {
    if (isHome) setAutoUpdate(visible)
  }, [isHome]))

  return (
    <View style={stylesRaw.container}>
      <View style={styles.leftContent}>
        <Status autoUpdate={autoUpdate} />
      </View>
      <View style={[StyleSheet.absoluteFill, stylesRaw.progress]}>
        {
          allowProgressBarSeek
            ? <Progress progress={progress} duration={maxPlayTime} buffered={buffered} paddingTop={PADDING_TOP_PROGRESS} />
            : <ProgressPlain progress={progress} duration={maxPlayTime} buffered={buffered} paddingTop={PADDING_TOP_PROGRESS} />
        }
      </View>
    </View>
  )
}

const styles = createStyle({
  leftContent: {
    flexGrow: 1,
    flexShrink: 1,
    paddingRight: 5,
  },
})

const stylesRaw = StyleSheet.create({
  container: {
    maxHeight: scaleSizeH(24),
    flexGrow: 1,
    flexShrink: 0,
    paddingTop: PADDING_TOP,
    paddingHorizontal: scaleSizeW(2),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progress: {
    marginBottom: MARGIN_TOP,
    zIndex: 100,
  },
})
