import { useState, useRef, useCallback, useMemo, forwardRef, useImperativeHandle } from 'react'
import { Animated, View, TouchableOpacity } from 'react-native'

import Text from '@/components/common/Text'
import Button from '@/components/common/Button'
import { Icon } from '@/components/common/Icon'
import { useTheme } from '@/store/theme/hook'
import { createStyle } from '@/utils/tools'
import { BorderWidths } from '@/theme'

export type SelectMode = 'single' | 'range'

export interface MultipleModeBarProps {
  onSwitchMode: (mode: SelectMode) => void
  onSelectAll: (isAll: boolean) => void
  onExitSelectMode: () => void
  onAddToPlaylist?: () => void
  onShowMoreActions?: (position: { x: number, y: number, w: number, h: number }) => void
}
export interface MultipleModeBarType {
  show: () => void
  setVisibleBar: (visible: boolean) => void
  setIsSelectAll: (isAll: boolean) => void
  setSelectedCount: (count: number) => void
  setSwitchMode: (mode: SelectMode) => void
  exitSelectMode: () => void
}

export default forwardRef<MultipleModeBarType, MultipleModeBarProps>(({ onSelectAll, onSwitchMode, onExitSelectMode, onAddToPlaylist, onShowMoreActions }, ref) => {
  // const isGetDetailFailedRef = useRef(false)
  const [visible, setVisible] = useState(false)
  const [animatePlayed, setAnimatPlayed] = useState(true)
  const animFade = useRef(new Animated.Value(0)).current
  const animTranslateY = useRef(new Animated.Value(0)).current
  const [selectMode, setSelectMode] = useState<SelectMode>('single')
  const [isSelectAll, setIsSelectAll] = useState(false)
  const [selectedCount, setSelectedCount] = useState(0)
  const [visibleBar, setVisibleBar] = useState(true)
  const theme = useTheme()
  const moreActionsRef = useRef<TouchableOpacity>(null)

  const handleShowMoreActions = useCallback(() => {
    if (!onShowMoreActions || !moreActionsRef.current?.measure) return
    moreActionsRef.current.measure((fx, fy, width, height, px, py) => {
      onShowMoreActions({ x: Math.ceil(px), y: Math.ceil(py), w: Math.ceil(width), h: Math.ceil(height) })
    })
  }, [onShowMoreActions])

  useImperativeHandle(ref, () => ({
    show() {
      handleShow()
    },
    setVisibleBar(visible) {
      setVisibleBar(visible)
    },
    setIsSelectAll(isAll) {
      setIsSelectAll(isAll)
    },
    setSelectedCount(count) {
      setSelectedCount(count)
    },
    setSwitchMode(mode: SelectMode) {
      setSelectMode(mode)
    },
    exitSelectMode() {
      handleHide()
    },
  }))

  const handleShow = useCallback(() => {
    // console.log('show List')
    setVisible(true)
    setAnimatPlayed(false)
    requestAnimationFrame(() => {
      animTranslateY.setValue(-20)

      Animated.parallel([
        Animated.timing(animFade, {
          toValue: 0.92,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(animTranslateY, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setAnimatPlayed(true)
      })
    })
  }, [animFade, animTranslateY])

  const handleHide = useCallback(() => {
    setAnimatPlayed(false)
    Animated.parallel([
      Animated.timing(animFade, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(animTranslateY, {
        toValue: -20,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(finished => {
      if (!finished) return
      setVisible(false)
      setAnimatPlayed(true)
    })
  }, [animFade, animTranslateY])


  const animaStyle = useMemo(() => ({
    ...styles.container,
    // backgroundColor: theme['c-content-background'],
    borderBottomColor: theme['c-border-background'],
    opacity: visibleBar ? animFade : 0, // Bind opacity to animated value
    transform: [
      { translateY: animTranslateY },
    ],
  }), [animFade, animTranslateY, theme, visibleBar])

  const handleSelectAll = useCallback(() => {
    const selectAll = !isSelectAll
    setIsSelectAll(selectAll)
    onSelectAll(selectAll)
  }, [isSelectAll, onSelectAll])

  const component = useMemo(() => {
    return (
      <Animated.View style={animaStyle}>
        <View style={styles.countInfo}>
          <Text size={14} color={theme['c-primary-font']}>{global.i18n.t('list_selected_count', { count: selectedCount })}</Text>
        </View>
        <View style={styles.switchBtn}>
          <Button onPress={() => { onSwitchMode('single') }} style={{ ...styles.btn, backgroundColor: selectMode == 'single' ? theme['c-button-background'] : 'rgba(0,0,0,0)' }}>
            <Text color={theme['c-button-font']}>{global.i18n.t('list_select_single')}</Text>
          </Button>
          <Button onPress={() => { onSwitchMode('range') }} style={{ ...styles.btn, backgroundColor: selectMode == 'range' ? theme['c-button-background'] : 'rgba(0,0,0,0)' }}>
            <Text color={theme['c-button-font']}>{global.i18n.t('list_select_range')}</Text>
          </Button>
        </View>
        <TouchableOpacity onPress={handleSelectAll} style={styles.btn}>
          <Text color={theme['c-button-font']}>{global.i18n.t(isSelectAll ? 'list_select_unall' : 'list_select_all')}</Text>
        </TouchableOpacity>
        {onAddToPlaylist && (
          <TouchableOpacity onPress={onAddToPlaylist} style={styles.actionBtn} disabled={selectedCount === 0}>
            <Icon name="add-music" size={18} color={selectedCount > 0 ? theme['c-button-font'] : theme['c-350']} />
          </TouchableOpacity>
        )}
        {onShowMoreActions && (
          <TouchableOpacity ref={moreActionsRef} onPress={handleShowMoreActions} style={styles.actionBtn} disabled={selectedCount === 0}>
            <Icon name="dots-vertical" size={16} color={selectedCount > 0 ? theme['c-button-font'] : theme['c-350']} />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={onExitSelectMode} style={styles.btn}>
          <Text color={theme['c-button-font']}>{global.i18n.t('list_select_cancel')}</Text>
        </TouchableOpacity>
      </Animated.View>
    )
  }, [animaStyle, selectMode, theme, handleSelectAll, isSelectAll, selectedCount, onExitSelectMode, onSwitchMode, onAddToPlaylist, onShowMoreActions, handleShowMoreActions])

  return !visible && animatePlayed ? null : component
})

const styles = createStyle({
  container: {
    flex: 1,
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: BorderWidths.normal,
  },
  countInfo: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  switchBtn: {
    flexDirection: 'row',
    flex: 1,
  },
  btn: {
    paddingLeft: 14,
    paddingRight: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtn: {
    width: 40,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
