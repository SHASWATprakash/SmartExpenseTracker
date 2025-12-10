// src/components/PrimaryButton.tsx
import React from 'react';
import {
  TouchableOpacity,
  Text,
  ViewStyle,
  TextStyle,
  GestureResponderEvent,
} from 'react-native';
import { Colors, Spacing, Shadows } from '../theme';

type Props = {
  title: string;
  onPress?: (e: GestureResponderEvent) => void;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle | TextStyle[];
  disabled?: boolean;
  activeOpacity?: number;
};

export default function PrimaryButton({
  title,
  onPress,
  style,
  textStyle,
  disabled = false,
  activeOpacity = 0.85,
}: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={activeOpacity}
      disabled={disabled}
      style={[
        {
          backgroundColor: Colors.cardBg,
          paddingVertical: Spacing.sm,
          paddingHorizontal: Spacing.lg,
          borderRadius: 10,
          alignItems: 'center',
          justifyContent: 'center',
          ...Shadows.card,
        },
        style,
      ]}
    >
      <Text style={[{ color: Colors.primary, fontWeight: '600', fontSize: 16 }, textStyle]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}
