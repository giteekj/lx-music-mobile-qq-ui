import React, { memo, useCallback, useEffect, useState } from 'react'
import { View, TouchableOpacity, ScrollView, ImageBackground, ActivityIndicator } from 'react-native'
import Text from '@/components/common/Text'
import { useTheme } from '@/store/theme/hook'
import { createStyle } from '@/utils/tools'
import { Icon } from '@/components/common/Icon'
import Image from '@/components/common/Image'
import { getRecommendSonglists, playDailyRecommend, playForYou } from '@/core/recommend'
import { type ListInfoItem } from '@/store/songlist/state'
import { navigations } from '@/navigation'
import commonState from '@/store/common/state'

const FOR_YOU_IMG = require('@/resources/images/for_you_card.png')
const DAILY_30_IMG = require('@/resources/images/daily_30_card.png')

const HOT_TAGS = ['周杰伦', '邓紫棋', '陈奕迅', '林俊杰', '薛之谦', '毛不易', '周深', '张杰']

const Card = memo(({ title, subtitle, icon, image, onPress }: {
  title: string
  subtitle: string
  icon: string
  image: any
  onPress?: () => void
}) => {
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={styles.card}>
      <ImageBackground source={image} resizeMode="cover" imageStyle={{ borderRadius: 14 }} style={styles.cardBg}>
        <View style={styles.cardOverlay}>
          <View style={styles.cardContent}>
            <Text size={18} color="#fff" style={styles.cardTitle}>{title}</Text>
            <Text size={12} color="rgba(255,255,255,0.9)" numberOfLines={2}>{subtitle}</Text>
          </View>
          <View style={styles.cardPlay}>
            <Icon name={icon as any} color="#fff" rawSize={20} />
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  )
})

const SectionTitle = memo(({ title }: { title: string }) => {
  const theme = useTheme()
  return (
    <View style={styles.sectionHeader}>
      <Text size={17} color={theme['c-font']} style={styles.sectionTitle}>{title}</Text>
    </View>
  )
})

const PlaylistCard = memo(({ item, onPress }: { item: ListInfoItem; onPress: (item: ListInfoItem) => void }) => {
  const theme = useTheme()
  const handlePress = () => onPress(item)
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={handlePress} style={styles.playlistCard}>
      <View style={[styles.playlistCover, { backgroundColor: theme['c-primary-alpha-200'] }]}>
        {item.img ? (
          <Image url={item.img} style={{ width: '100%', height: '100%', borderRadius: 12 }} />
        ) : (
          <Icon name="album" color={theme['c-primary-alpha-500']} rawSize={30} />
        )}
      </View>
      <Text size={12} color={theme['c-font']} numberOfLines={2} style={styles.playlistTitle}>{item.name}</Text>
    </TouchableOpacity>
  )
})

export interface RecommendViewProps {
  onSearch: (keyword: string) => void
}

export default ({ onSearch }: RecommendViewProps) => {
  const [songlists, setSonglists] = useState<ListInfoItem[]>([])
  const [loading, setLoading] = useState(false)
  const theme = useTheme()

  useEffect(() => {
    let isMounted = true
    setLoading(true)
    void getRecommendSonglists(6).then(list => {
      if (!isMounted) return
      setSonglists(list)
      setLoading(false)
    }).catch(() => {
      if (isMounted) setLoading(false)
    })
    return () => { isMounted = false }
  }, [])

  const handleTagPress = useCallback((tag: string) => {
    onSearch(tag)
  }, [onSearch])

  const handlePlayForYou = useCallback(() => {
    void playForYou()
  }, [])

  const handlePlayDaily = useCallback(() => {
    void playDailyRecommend()
  }, [])

  const handleOpenSonglist = useCallback((item: ListInfoItem) => {
    navigations.pushSonglistDetailScreen(commonState.componentIds.home!, item)
  }, [])

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.container}>
      {/* Top Cards */}
      <View style={styles.cardsRow}>
        <Card
          title="For You"
          subtitle="猜你喜欢 - 沉浸刷歌"
          image={FOR_YOU_IMG}
          icon="play"
          onPress={handlePlayForYou}
        />
        <Card
          title="Daily 30"
          subtitle="每日30首推荐"
          image={DAILY_30_IMG}
          icon="play"
          onPress={handlePlayDaily}
        />
      </View>

      {/* Hot Tags */}
      <SectionTitle title="热门搜索" />
      <View style={styles.tagRow}>
        {HOT_TAGS.map(tag => (
          <TouchableOpacity key={tag} activeOpacity={0.7} onPress={() => handleTagPress(tag)} style={[styles.tag, { backgroundColor: theme['c-primary-light-800-alpha-300'] }]}>
            <Text size={12} color={theme['c-font-label']}>{tag}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Recommend Section */}
      <SectionTitle title="歌单推荐" />
      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator color={theme['c-primary']} />
        </View>
      ) : (
        <View style={styles.playlistRow}>
          {songlists.length ? (
            songlists.map(item => <PlaylistCard key={`${item.source}_${item.id}`} item={item} onPress={handleOpenSonglist} />)
          ) : (
            [1, 2, 3].map(i => (
              <View key={i} style={[styles.playlistCard, { backgroundColor: theme['c-primary-light-800-alpha-300'] }]}>
                <View style={[styles.playlistCover, { backgroundColor: theme['c-primary-alpha-200'] }]}>
                  <Icon name="album" color={theme['c-primary-alpha-500']} rawSize={30} />
                </View>
                <Text size={12} color={theme['c-font']} numberOfLines={2} style={styles.playlistTitle}>
                  {i === 1 ? '90后校园记忆：MP3里的青春岁月' : i === 2 ? '回忆｜九零后耳熟能详的音乐记忆' : '国语经典老歌百听不厌'}
                </Text>
              </View>
            ))
          )}
        </View>
      )}
    </ScrollView>
  )
}

const styles = createStyle({
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  cardsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  card: {
    flex: 1,
    height: 110,
    borderRadius: 14,
    overflow: 'hidden',
  },
  cardBg: {
    flex: 1,
  },
  cardOverlay: {
    flex: 1,
    padding: 14,
    justifyContent: 'space-between',
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.22)',
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  cardTitle: {
    fontWeight: 'bold',
    marginBottom: 6,
  },
  cardPlay: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  sectionHeader: {
    marginTop: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontWeight: '600',
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  tag: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
  },
  playlistRow: {
    flexDirection: 'row',
    gap: 12,
  },
  playlistCard: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  playlistCover: {
    width: '100%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    overflow: 'hidden',
  },
  playlistTitle: {
    marginTop: 8,
    marginHorizontal: 4,
    marginBottom: 8,
    lineHeight: 18,
  },
  loadingWrap: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
