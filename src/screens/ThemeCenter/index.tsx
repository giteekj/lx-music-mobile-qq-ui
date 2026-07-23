import React, { memo, useCallback, useState } from 'react'
import { View, ScrollView, TouchableOpacity, Dimensions } from 'react-native'
import Text from '@/components/common/Text'
import { useTheme } from '@/store/theme/hook'
import { createStyle } from '@/utils/tools'
import themes from '@/theme/themes/themes'
import { setTheme } from '@/core/theme'
import Header from '@/components/common/Header'
import { useI18n } from '@/lang'
import { Icon } from '@/components/common/Icon'

const THEME_WIDTH = (Dimensions.get('window').width - 48) / 2

const ThemeCard = memo(({ theme, isActive, onPress }: {
  theme: typeof themes[number]
  isActive: boolean
  onPress: () => void
}) => {
  const currentTheme = useTheme()
  const primaryColor = theme.config.themeColors['c-primary']
  const bgColor = theme.isDark ? '#1a1a1a' : '#f5f5f5'

  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress} style={styles.cardWrapper}>
      <View style={[styles.card, { backgroundColor: bgColor, borderColor: isActive ? primaryColor : 'transparent' }]}>
        <View style={[styles.colorPreview, { backgroundColor: primaryColor }]}>
          <View style={[styles.previewCircle, { backgroundColor: theme.config.themeColors['c-primary-light-400'] }]} />
          <View style={[styles.previewBar, { backgroundColor: theme.config.themeColors['c-primary-light-200'] }]} />
        </View>
        <View style={styles.cardInfo}>
          <Text size={14} color={theme.isDark ? '#fff' : '#333'} numberOfLines={1}>{theme.name}</Text>
          <Text size={11} color={theme.isDark ? '#888' : '#999'}>{theme.isDark ? '深色' : '浅色'}</Text>
        </View>
        {isActive && (
          <View style={[styles.activeBadge, { backgroundColor: primaryColor }]}>
            <Icon name="check" color="#fff" rawSize={12} />
          </View>
        )}
      </View>
    </TouchableOpacity>
  )
}, (prev, next) => prev.isActive === next.isActive && prev.theme.id === next.theme.id)

export default () => {
  const t = useI18n()
  const theme = useTheme()
  const [activeId, setActiveId] = useState(theme.id)

  const handlePress = useCallback((id: string) => {
    setActiveId(id)
    setTheme(id)
  }, [])

  return (
    <View style={{ flex: 1, backgroundColor: theme['c-content-background'] }}>
      <Header>
        <Text style={styles.headerTitle}>{t('theme_center_title') ?? '装扮中心'}</Text>
      </Header>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.sectionTitle} size={16} color={theme['c-font']}>推荐主题</Text>
        <View style={styles.grid}>
          {themes.map(t => (
            <ThemeCard
              key={t.id}
              theme={t}
              isActive={activeId === t.id}
              onPress={() => handlePress(t.id)}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  )
}

const styles = createStyle({
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionTitle: {
    marginBottom: 16,
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cardWrapper: {
    width: THEME_WIDTH,
    marginBottom: 16,
  },
  card: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  colorPreview: {
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  previewCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  previewBar: {
    width: 48,
    height: 8,
    borderRadius: 4,
  },
  cardInfo: {
    padding: 12,
  },
  activeBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
