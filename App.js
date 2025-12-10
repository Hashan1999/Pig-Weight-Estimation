import React, { useEffect, useRef, useState } from 'react';
import { Alert, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import GuideOverlay from './components/GuideOverlay';

const DESIRED_RATIO = '4:3';

export default function App() {
  const cameraRef = useRef(null);
  const [cameraPermission, requestCameraPermission] = Camera.useCameraPermissions();
  const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();
  const [isReady, setIsReady] = useState(false);
  const [ratio, setRatio] = useState(DESIRED_RATIO);

  useEffect(() => {
    requestCameraPermission();
    requestMediaPermission();
  }, []);

  const onCameraReady = async () => {
    setIsReady(true);
    if (cameraRef.current) {
      try {
        const supportedRatios = await cameraRef.current.getSupportedRatiosAsync();
        if (supportedRatios.includes(DESIRED_RATIO)) {
          setRatio(DESIRED_RATIO);
        } else if (supportedRatios.length > 0) {
          setRatio(supportedRatios[0]);
        }
      } catch (error) {
        console.warn('Error fetching supported ratios', error);
      }
    }
  };

  const handleCapture = async () => {
    if (!cameraRef.current || !isReady) {
      return;
    }

    if (!mediaPermission || mediaPermission.status !== 'granted') {
      const { status } = await requestMediaPermission();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Storage permission is required to save photos.');
        return;
      }
    }

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 1,
        skipProcessing: true,
        exif: true,
      });

      console.log('Captured photo URI:', photo.uri);
      if (photo && photo.exif) {
        console.log('EXIF metadata:', photo.exif);
      }
      console.log('Dimensions:', photo.width, 'x', photo.height);

      await MediaLibrary.saveToLibraryAsync(photo.uri);
      Alert.alert('Photo saved', `Saved to library. URI: ${photo.uri}`);
    } catch (error) {
      console.error('Failed to capture or save photo', error);
      Alert.alert('Capture error', 'Could not save photo. Please try again.');
    }
  };

  if (!cameraPermission || cameraPermission.status === null) {
    return null;
  }

  if (!cameraPermission.granted) {
    return (
      <SafeAreaView style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          Camera permission is required to take pig photos.
        </Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestCameraPermission}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden />
      <Camera
        ref={cameraRef}
        style={styles.camera}
        type={CameraType.back}
        zoom={0}
        ratio={ratio}
        useCamera2Api
        onCameraReady={onCameraReady}
      />
      <GuideOverlay />
      <View style={styles.bottomBar} pointerEvents="box-none">
        <View style={styles.instructions}>
          <Text style={styles.instructionsText}>Frame the pig between the guide lines.</Text>
          <Text style={styles.instructionsText}>Keep phone level and avoid zooming.</Text>
          <Text style={styles.instructionsText}>Landscape only, rear main camera.</Text>
        </View>
        <TouchableOpacity style={styles.captureButton} onPress={handleCapture}>
          <View style={styles.innerCaptureButton} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    ...StyleSheet.absoluteFillObject,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  captureButton: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 4,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  innerCaptureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#fff',
  },
  instructions: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    maxWidth: '65%',
  },
  instructionsText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  permissionButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
