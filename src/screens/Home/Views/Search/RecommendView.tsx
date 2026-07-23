import React, { memo } from 'react'
import { View, TouchableOpacity, ScrollView } from 'react-native'
import Text from '@/components/common/Text'
import { useTheme } from '@/store/theme/hook'
import { createStyle } from '@/utils/tools'
import { Icon } from '@/components/common/Icon'

const Card = memo(({ title, subtitle, color, icon, onPress }: {
  title: string
  subtitle: string
  color: string
  icon: string
  onPress?: () => void
}) => {
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={[styles.card, { backgroundColor: color }]}>
      <View style={styles.cardContent}>
        <Text size={18} color="#fff" style={styles.cardTitle}>{title}</Text>
        <Text size={12} color="rgba(255,255,255,0.85)" numberOfLines={2}>{subtitle}</Text>
      </View>
      <View style={styles.cardPlay}>
        <Icon name={icon as any} color="#fff" rawSize={20} />
      </View>
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

export default () => {
  const theme = useTheme()

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.container}>
      {/* Top Cards */}
      <View style={styles.cardsRow}>
        <Card
          title="For You"
          subtitle="猜你喜欢 - 沉浸刷歌"
          color="#5B8DEF"
          icon="play"
        />
        <Card
          title="Daily 30"
          subtitle="每日30首推荐"
          color="#FF8F5C"
          icon="play"
        />
      </View>

      {/* Hot Tags */}
      <SectionTitle title="热门搜索" />
      <View style={styles.tagRow}>
        {['周杰伦', '邓紫棋', '陈奕迅', '林俊杰', '薛之谦', '毛不易', '周深', '张杰'].map(tag => (
          <View key={tag} style={[styles.tag, { backgroundColor: theme['c-primary-light-800-alpha-300'] }]}>
            <Text size={12} color={theme['c-font-label']}>{tag}</Text>
          </View>
        ))}
      </View>

      {/* Recommend Section */}
      <SectionTitle title="歌单推荐" />
      <View style={styles.playlistRow}>
        {[1, 2, 3].map(i => (
          <View key={i} style={[styles.playlistCard, { backgroundColor: theme['c-primary-light-800-alpha-300'] }]}>
            <View style={[styles.playlistCover, { backgroundColor: theme['c-primary-alpha-200'] }]}>
              <Icon name="album" color={theme['c-primary-alpha-500']} rawSize={30} />
            </View>
            <Text size={12} color={theme['c-font']} numberOfLines={2} style={styles.playlistTitle}>
              {i === 1 ? '90后校园记忆：MP3里的青春岁月' : i === 2 ? '回忆｜九零后耳熟能详的音乐记忆' : '国语经典老歌百听不厌'}
            </Text>
          </View>
        ))}
      </View>
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
    padding: 14,
    justifyContent: 'space-between',
    flexDirection: 'row',
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
  },
  playlistTitle: {
    marginTop: 8,
    marginHorizontal: 4,
    marginBottom: 8,
    lineHeight: 18,
  },
})
