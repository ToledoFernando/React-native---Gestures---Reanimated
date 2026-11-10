import Container from "@/components/Container";
import { useCallback, useState } from "react";
import {
  Alert,
  LayoutChangeEvent,
  StyleSheet,
  Text,
  Vibration,
  View,
} from "react-native";
import { GestureDetector, usePanGesture } from "react-native-gesture-handler";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

const HEICHT = 50;

function ButtonSlide() {
  const [containerWidth, setcontainerWidth] = useState<number>(0);

  const maxTranslate = Math.max(containerWidth - HEICHT - 6 * 2, 0);

  const startX = useSharedValue(0);
  const valueX = useSharedValue(0);
  const progress = useSharedValue(0);

  const handleSuccess = useCallback(() => {
    setTimeout(() => {
      Vibration.vibrate(100);
      Alert.alert("¡Completado!", "Acción realizada correctamente.");

      valueX.value = withTiming(0);
      progress.value = withTiming(0);
    }, 1000);
  }, []);

  const pan = usePanGesture({
    onBegin: () => {
      startX.value = valueX.value;
    },
    onUpdate: (props) => {
      const next = startX.value + props.translationX;
      valueX.value = Math.min(Math.max(next, 0), maxTranslate);
      progress.value = valueX.value / maxTranslate;
    },
    onTouchesUp: () => {
      if (progress.value < 1) {
        valueX.set(withTiming(0));
        progress.set(withTiming(0));
      } else {
        scheduleOnRN(handleSuccess);
      }
    },
  });

  const stylesAnimated = useAnimatedStyle(() => ({
    transform: [{ translateX: valueX.value }],
  }));

  const backgroundColor = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      ["#e3e3e3", "#1fce2c"],
    ),
  }));

  const textOpacityPlaceHolder = useAnimatedStyle(() => ({
    opacity: 1 - progress.value,
  }));

  const completedTextStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
  }));

  const handleLayoutWidth = (event: LayoutChangeEvent) => {
    const width = event.nativeEvent.layout.width;
    setcontainerWidth(width);
  };

  return (
    <Container justifyContent="flex-end">
      <Animated.View
        onLayout={handleLayoutWidth}
        style={[styles.container, backgroundColor]}
      >
        <GestureDetector gesture={pan}>
          <Animated.View style={[styles.buttom, stylesAnimated]}>
            <Text style={styles.textButtom}>{">"}</Text>
          </Animated.View>
        </GestureDetector>

        <View style={styles.placeholderContainer}>
          <Animated.Text
            style={[styles.textPlaceholder, textOpacityPlaceHolder]}
          >
            Arrastra el boton
          </Animated.Text>
        </View>

        <View style={[styles.placeholderContainer, styles.containerSuccess]}>
          <Animated.Text
            style={[
              styles.textPlaceholder,
              { color: "#fff", fontSize: 20 },
              completedTextStyle,
            ]}
          >
            Completo
          </Animated.Text>
        </View>
      </Animated.View>
    </Container>
  );
}

export default ButtonSlide;

const styles = StyleSheet.create({
  container: {
    padding: 6,
    borderRadius: 9999,
    width: "80%",
  },
  buttom: {
    position: "absolute",
    top: 6,
    zIndex: 30,
    left: 6,
    backgroundColor: "#fff",
    width: HEICHT,
    height: HEICHT,
    borderRadius: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  textButtom: {
    fontSize: 32,
  },
  placeholderContainer: {
    backgroundColor: "#00000000",
    width: "100%",
    height: HEICHT,
    borderRadius: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  textPlaceholder: {
    textAlign: "center",
    fontSize: 16,
  },
  containerSuccess: {
    height: "100%",
    marginTop: 6,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    flexDirection: "column",
    position: "absolute",
  },
});
