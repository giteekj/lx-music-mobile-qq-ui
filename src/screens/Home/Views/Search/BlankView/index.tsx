import Text from '@/components/common/Text'
import { Icon } from '@/components/common/Icon'
import { useI18n } from '@/lang'
import { useSettingValue } from '@/store/setting/hook'
import { useTheme } from '@/store/theme/hook'
import { createStyle } from '@/utils/tools'
import { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { ScrollView, View } from 'react-native'
import HistorySearch, { type HistorySearchType } from './HistorySearch'
import HotSearch, { type HotSearchType } from './HotSearch'
import RecommendView from '../RecommendView'

interface BlankViewProps {
  onSearch: (keyword: string) => void
}
type Source = LX.OnlineSource | 'all'

export interface BlankViewType {
  show: (source: Source) => void
}

export default forwardRef<BlankViewType, BlankViewProps>(({ onSearch }, ref) => {
  const [visible, setVisible] = useState(false)
  const hotSearchRef = useRef<HotSearchType>(null)
  const historySearchRef = useRef<HistorySearchType>(null)
  const isShowHotSearch = useSettingValue('search.isShowHotSearch')
  const isShowHistorySearch = useSettingValue('search.isShowHistorySearch')
  const t = useI18n()
  const theme = useTheme()

  const handleShow = (source: Source) => {
    hotSearchRef.current?.show(source)
    historySearchRef.current?.show()
  }

  useImperativeHandle(ref, () => ({
    show(source) {
      if (visible) handleShow(source)
      else {
        setVisible(true)
        requestAnimationFrame(() => {
          handleShow(source)
        })
      }
    },
  }), [visible])

  if (!visible) return null

  return (
    <ScrollView style={{ flex: 1 }}>
      {/* QQ Music Style Recommendations */}
      <RecommendView />

      {/* Original Hot Search & History */}
      {isShowHotSearch || isShowHistorySearch ? (
        <View style={styles.content}>
          {isShowHotSearch ? <HotSearch ref={hotSearchRef} onSearch={onSearch} /> : null}
          {isShowHistorySearch ? <HistorySearch ref={historySearchRef} onSearch={onSearch} /> : null}
        </View>
      ) : (
        <View style={styles.welcome}>
          <View style={[styles.welcomeIcon, { backgroundColor: theme['c-primary-alpha-100'] }]}>
            <Icon name="logo" size={40} color={theme['c-primary-font']} />
          </View>
          <Text size={24} color={theme['c-font']} style={styles.welcomeTitle}>LX Music</Text>
          <Text size={14} color={theme['c-font-label']}>{t('search__welcome')}</Text>
        </View>
      )}
    </ScrollView>
  )
})


const styles = createStyle({
  content: {
    paddingBottom: 15,
    paddingLeft: 15,
    paddingRight: 15,
  },
  welcome: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  welcomeIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  welcomeTitle: {
    fontWeight: '600',
    marginBottom: 8,
  },
})
