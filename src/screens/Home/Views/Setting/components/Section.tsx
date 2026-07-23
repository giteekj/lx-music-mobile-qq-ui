import { View } from 'react-native'

import { createStyle } from '@/utils/tools'
import { useTheme } from '@/store/theme/hook'
import Text from '@/components/common/Text'


interface Props {
  title: string
  children: React.ReactNode | React.ReactNode[]
}

export default ({ title, children }: Props) => {
  const theme = useTheme()

  return (
    <View style={{ ...styles.container, backgroundColor: theme['c-primary-light-900-alpha-200'] }}>
      <View style={styles.titleRow}>
        <View style={{ ...styles.titleIndicator, backgroundColor: theme['c-primary'] }} />
        <Text style={styles.title} size={16} >{title}</Text>
      </View>
      <View>
        {children}
      </View>
    </View>
  )
}


const styles = createStyle({
  container: {
    borderRadius: 14,
    paddingTop: 14,
    paddingBottom: 6,
    marginBottom: 14,
    overflow: 'hidden',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingLeft: 14,
  },
  titleIndicator: {
    width: 4,
    height: 16,
    borderRadius: 2,
    marginRight: 8,
  },
  title: {
    fontWeight: '600',
  },
})
