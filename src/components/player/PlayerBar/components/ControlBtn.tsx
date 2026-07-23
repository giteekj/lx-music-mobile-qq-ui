import { TouchableOpacity } from 'react-native'
import { Icon } from '@/components/common/Icon'
import { useIsPlay } from '@/store/player/hook'
import { useTheme } from '@/store/theme/hook'
import { playNext, playPrev, togglePlay } from '@/core/player/player'
import { createStyle } from '@/utils/tools'
import { useHorizontalMode } from '@/utils/hooks'
import { scaleSizeW } from '@/utils/pixelRatio'

const BTN_SIZE = scaleSizeW(22)

const handlePlayPrev = () => {
  void playPrev()
}
const handlePlayNext = () => {
  void playNext()
}

const PlayPrevBtn = () => {
  const theme = useTheme()

  return (
    <TouchableOpacity style={styles.controlBtn} activeOpacity={0.5} onPress={handlePlayPrev}>
      <Icon name='prevMusic' color={theme['c-font']} size={BTN_SIZE} rawSize={BTN_SIZE} />
    </TouchableOpacity>
  )
}

const PlayNextBtn = () => {
  const theme = useTheme()

  return (
    <TouchableOpacity style={styles.controlBtn} activeOpacity={0.5} onPress={handlePlayNext}>
      <Icon name='nextMusic' color={theme['c-font']} size={BTN_SIZE} rawSize={BTN_SIZE} />
    </TouchableOpacity>
  )
}

const TogglePlayBtn = () => {
  const isPlay = useIsPlay()
  const theme = useTheme()

  return (
    <TouchableOpacity
      style={{ ...styles.playBtn, backgroundColor: theme['c-primary-alpha-100'] }}
      activeOpacity={0.6}
      onPress={togglePlay}
    >
      <Icon name={isPlay ? 'pause' : 'play'} color="#fff" size={BTN_SIZE - 2} rawSize={BTN_SIZE - 2} />
    </TouchableOpacity>
  )
}

export default () => {
  const isHorizontalMode = useHorizontalMode()
  return (
    <>
      { isHorizontalMode ? <PlayPrevBtn /> : null }
      <TogglePlayBtn />
      <PlayNextBtn />
    </>
  )
}

const styles = createStyle({
  controlBtn: {
    width: scaleSizeW(40),
    height: scaleSizeW(40),
    justifyContent: 'center',
    alignItems: 'center',
  },
  playBtn: {
    width: scaleSizeW(38),
    height: scaleSizeW(38),
    borderRadius: scaleSizeW(19),
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: scaleSizeW(2),
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
})
