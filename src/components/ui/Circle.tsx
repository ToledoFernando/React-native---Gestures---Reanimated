import { StyleSheet, View } from "react-native";
import {
  GestureDetector,
  usePanGesture,
  usePinchGesture,
  useSimultaneousGestures,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

function CircleExample() {
  const scale = useSharedValue(1);
  const startScale = useSharedValue(1);

  const valueX = useSharedValue(0);
  const valueY = useSharedValue(0);

  const startX = useSharedValue(0);
  const startY = useSharedValue(0);

  const pan = usePanGesture({
    onBegin: () => {
      startX.value = valueX.value;
      startY.value = valueY.value;
    },
    onUpdate: (event) => {
      valueX.value = startX.value + event.translationX;
      valueY.value = startY.value + event.translationY;
    },
  });

  const pinch = usePinchGesture({
    onBegin: () => {
      startScale.value = scale.value;
    },
    onUpdate: (props) => {
      scale.value = startScale.value * props.scale;
    },
  });

  const stylesAnimated = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: valueY.value,
        },
        {
          translateX: valueX.value,
        },
        {
          scale: scale.value,
        },
      ],
    };
  });

  const gestures = useSimultaneousGestures(pan, pinch);

  return (
    <View style={styles.container}>
      <GestureDetector gesture={gestures}>
        <Animated.View style={[styles.object, stylesAnimated]}></Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  object: {
    width: 300,
    height: 300,
    borderRadius: 99999,
    backgroundColor: "green",
  },
});

export default CircleExample;
