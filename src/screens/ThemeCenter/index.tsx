import React, { memo, useCallback, useMemo, useState } from 'react'
import { View, ScrollView, TouchableOpacity, Dimensions, ImageBackground, ImageSourcePropType } from 'react-native'
import Text from '@/components/common/Text'
import { useTheme } from '@/store/theme/hook'
import { createStyle } from '@/utils/tools'
import themes from '@/theme/themes/themes'
import { setTheme } from '@/core/theme'
import { useI18n } from '@/lang'
import { Icon } from '@/components/common/Icon'
import BubbleBackground from './BubbleBackground'
import { BG_IMAGES } from '@/theme/themes/index'

const THEME_WIDTH = (Dimensions.get('window').width - 48) / 2
const ANIME_THEME_IDS = ['anime_sky', 'anime_sunset', 'anime_starry', 'anime_sakura']

const ThemeCard = memo(({ theme, isActive, onPress }: {
  theme: LX.Theme
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
            <Icon name="checkbox-marked" color="#fff" rawSize={12} />
          </View>
        )}
      </View>
    </TouchableOpacity>
  )
}, (prev, next) => prev.isActive === next.isActive && prev.theme.id === next.theme.id)

const FeaturedThemeCard = memo(({ theme, isActive, onPress }: {
  theme: LX.Theme
  isActive: boolean
  onPress: () => void
}) => {
  const bgImage = BG_IMAGES[theme.config.extInfo['bg-image'] as keyof typeof BG_IMAGES] as ImageSourcePropType | undefined
  const primaryColor = theme.config.themeColors['c-primary']

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={styles.featuredWrapper}>
      <ImageBackground
        source={bgImage}
        resizeMode="cover"
        imageStyle={{ borderRadius: 16 }}
        style={[styles.featuredCard, { borderColor: isActive ? primaryColor : 'transparent' }]}
      >
        <View style={styles.featuredOverlay}>
          <Text size={16} color="#fff" style={styles.featuredName} numberOfLines={1}>{theme.name}</Text>
          <Text size={11} color="rgba(255,255,255,0.9)" numberOfLines={1}>动漫主题</Text>
        </View>
        {isActive && (
          <View style={[styles.featuredActiveBadge, { backgroundColor: primaryColor }]}>
            <Icon name="checkbox-marked" color="#fff" rawSize={12} />
          </View>
        )}
      </ImageBackground>
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

  const { animeThemes, normalThemes } = useMemo(() => {
    const anime: LX.Theme[] = []
    const normal: LX.Theme[] = []
    for (const item of themes as unknown as LX.Theme[]) {
      if (ANIME_THEME_IDS.includes(item.id)) anime.push(item)
      else normal.push(item)
    }
    return { animeThemes: anime, normalThemes: normal }
  }, [])

  return (
    <View style={{ flex: 1, backgroundColor: theme['c-content-background'] }}>
      <BubbleBackground />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('theme_center_title') ?? '装扮中心'}</Text>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.sectionTitle} size={16} color={theme['c-font']}>动漫主题</Text>
        <View style={styles.featuredGrid}>
          {animeThemes.map(item => (
            <FeaturedThemeCard
              key={item.id}
              theme={item}
              isActive={activeId === item.id}
              onPress={() => handlePress(item.id)}
            />
          ))}
        </View>

        <Text style={styles.sectionTitle} size={16} color={theme['c-font']}>推荐主题</Text>
        <View style={styles.grid}>
          {normalThemes.map(item => (
            <ThemeCard
              key={item.id}
              theme={item}
              isActive={activeId === item.id}
              onPress={() => handlePress(item.id)}
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
  header: {
    height: 56,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  sectionTitle: {
    marginTop: 8,
    marginBottom: 16,
    fontWeight: '600',
  },
  featuredGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  featuredWrapper: {
    width: THEME_WIDTH,
    marginBottom: 16,
  },
  featuredCard: {
    height: 120,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
  },
  featuredOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.28)',
  },
  featuredName: {
    fontWeight: 'bold',
    marginBottom: 2,
  },
  featuredActiveBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
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
