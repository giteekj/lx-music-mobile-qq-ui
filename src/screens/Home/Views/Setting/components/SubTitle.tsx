import { memo } from 'react'

import { View } from 'react-native'
import { createStyle } from '@/utils/tools'
import Text from '@/components/common/Text'
import { useTheme } from '@/store/theme/hook'

export default memo(({ title, children }: {
  title: string
  children: React.ReactNode | React.ReactNode[]
}) => {
  const theme = useTheme()
  return (
    <View style={styles.container}>
      <Text style={styles.title} size={14} color={theme['c-font-label']}>{title}</Text>
      {children}
    </View>
  )
})


const styles = createStyle({
  container: {
    paddingLeft: 14,
    paddingRight: 14,
    marginBottom: 16,
  },
  title: {
    marginBottom: 8,
    fontWeight: '500',
  },
})
