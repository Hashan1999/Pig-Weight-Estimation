import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const GuideOverlay = () => {
  return (
    <View style={styles.overlay} pointerEvents="none">
      <View style={styles.horizontalLine} />
      <View style={[styles.verticalLine, { left: '30%' }]} />
      <View style={[styles.verticalLine, { right: '30%' }]} />
      <View style={styles.textContainer}>
        <Text style={styles.text}>Stand ~2.0 m from the pig</Text>
        <Text style={styles.text}>Hold phone at ~0.75 m height</Text>
        <Text style={styles.text}>Capture pig side view only</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  horizontalLine: {
    position: 'absolute',
    top: '50%',
    width: '80%',
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  verticalLine: {
    position: 'absolute',
    top: '15%',
    bottom: '15%',
    width: 2,
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  textContainer: {
    position: 'absolute',
    top: 20,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  text: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default GuideOverlay;
