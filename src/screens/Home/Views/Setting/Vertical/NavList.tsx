import { memo, useCallback, useState } from 'react'
import { TouchableOpacity, ScrollView } from 'react-native'

import { useTheme } from '@/store/theme/hook'
import { createStyle } from '@/utils/tools'
import Text from '@/components/common/Text'
import { SETTING_SCREENS, type SettingScreenIds } from '../Main'
import { useI18n } from '@/lang'


const ListItem = memo(({ id, activeId, onPress }: {
  onPress: (item: SettingScreenIds) => void
  activeId: string
  id: SettingScreenIds
}) => {
  const theme = useTheme()
  const t = useI18n()

  const active = activeId == id

  const handlePress = () => {
    onPress(id)
  }

  return (
    <TouchableOpacity
      style={{
        ...styles.listItem,
        backgroundColor: active ? theme['c-primary-alpha-100'] : theme['c-primary-light-900-alpha-200'],
      }}
      activeOpacity={0.7}
      onPress={handlePress}
    >
      <Text numberOfLines={1} size={13} color={active ? '#fff' : theme['c-font']}>{t(`setting_${id}`)}</Text>
    </TouchableOpacity>
  )
}, (prevProps, nextProps) => {
  return !!(prevProps.id === nextProps.id &&
    prevProps.activeId != nextProps.id &&
    nextProps.activeId != nextProps.id
  )
})


export default ({ onChangeId }: {
  onChangeId: (id: SettingScreenIds) => void
}) => {
  const [activeId, setActiveId] = useState(global.lx.settingActiveId)

  const handleChangeId = useCallback((id: SettingScreenIds) => {
    onChangeId(id)
    setActiveId(id)
    global.lx.settingActiveId = id
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <ScrollView horizontal style={styles.container} contentContainerStyle={styles.contentContainer} keyboardShouldPersistTaps={'always'} showsHorizontalScrollIndicator={false}>
      {
        SETTING_SCREENS.map(id => <ListItem key={id} id={id} activeId={activeId} onPress={handleChangeId} />)
      }
    </ScrollView>
  )
}


const styles = createStyle({
  container: {
    height: 52,
    flexGrow: 0,
    flexShrink: 0,
  },
  contentContainer: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
    alignItems: 'center',
  },
  listItem: {
    height: 34,
    paddingHorizontal: 14,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
