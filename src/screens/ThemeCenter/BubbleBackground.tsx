import React, { useEffect, useRef, memo } from 'react'
import { View, Animated, Dimensions, Easing } from 'react-native'
import { useTheme } from '@/store/theme/hook'

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window')

interface BubbleProps {
  delay: number
  size: number
  startX: number
  duration: number
  color: string
}

const Bubble = memo(({ delay, size, startX, duration, color }: BubbleProps) => {
  const translateY = useRef(new Animated.Value(SCREEN_H + size)).current
  const opacity = useRef(new Animated.Value(0)).current
  const scale = useRef(new Animated.Value(0.6)).current

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: -size * 2,
            duration,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(opacity, {
              toValue: 0.55,
              duration: duration * 0.15,
              easing: Easing.ease,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0,
              duration: duration * 0.25,
              easing: Easing.ease,
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(scale, {
              toValue: 1,
              duration: duration * 0.3,
              easing: Easing.out(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(scale, {
              toValue: 0.7,
              duration: duration * 0.7,
              easing: Easing.in(Easing.ease),
              useNativeDriver: true,
            }),
          ]),
        ]),
      ])
    )
    anim.start()
    return () => {
      anim.stop()
    }
  }, [delay, duration, size, translateY, opacity, scale])

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: startX,
        bottom: -size,
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
        opacity,
        transform: [{ translateY }, { scale }],
      }}
    />
  )
})

export default memo(({ count = 18 }: { count?: number }) => {
  const theme = useTheme()
  const bubbles = useRef<BubbleProps[]>([])

  if (!bubbles.current.length) {
    const baseColor = theme['c-primary']
    for (let i = 0; i < count; i++) {
      bubbles.current.push({
        delay: Math.random() * 4000,
        size: 8 + Math.random() * 24,
        startX: Math.random() * (SCREEN_W - 40) + 20,
        duration: 6000 + Math.random() * 5000,
        color: baseColor,
      })
    }
  }

  return (
    <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden' }}>
      {bubbles.current.map((b, i) => (
        <Bubble key={i} {...b} />
      ))}
    </View>
  )
})
