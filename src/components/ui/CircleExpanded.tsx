import { StyleSheet, useWindowDimensions } from "react-native";
import { GestureDetector, usePanGesture } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const defaultSize = 75;
const defaultSpacing = 16;

function CircleExpanded() {
  const isTap = useSharedValue(false);
  const isExpanded = useSharedValue(false);

  const valueY = useSharedValue(0);

  const { height, width } = useWindowDimensions();

  const panButton = usePanGesture({
    onTouchesUp: () => {
      if (!isExpanded.value) {
        isExpanded.value = true;
      }
    },
    onTouchesCancel: () => (isTap.value = false),
    onDeactivate: () => (isTap.value = false),
    onFinalize: () => {
      if (!isExpanded.value && isTap.value) isExpanded.value = true;
      isTap.value = false;
    },
    onBegin: () => {
      if (!isExpanded.value) isTap.value = true;
    },
  });

  const panContainer = usePanGesture({
    onBegin: () => {
      if (!isExpanded.value) return;
    },
    onUpdate: (event) => {
      if (!isExpanded.value) return;
      valueY.value = event.translationY;
    },
    onFinalize: () => {
      if (valueY.value > 300) {
        isExpanded.value = false;
        valueY.value = 0;
      } else {
        valueY.value = 0;
      }
    },
  });

  const stylesInTap = useAnimatedStyle(() => ({
    transform: [
      {
        scale: withTiming(isTap.value ? 0.8 : 1, { duration: 150 }),
      },
    ],
  }));

  const stylesContent = useAnimatedStyle(() => ({
    width: withTiming(isExpanded.value ? width : defaultSize),
    height: withTiming(isExpanded.value ? height : defaultSize),
    borderRadius: withTiming(isExpanded.value ? 0 : 100),

    transform: [
      {
        translateY: withTiming(isExpanded.value ? valueY.value : 0),
      },
    ],
  }));

  const stylesContainer = useAnimatedStyle(() => ({
    bottom: withTiming(isExpanded.value ? 0 : defaultSpacing),
    right: withTiming(isExpanded.value ? 0 : defaultSpacing),
  }));

  const stylesIcon = useAnimatedStyle(() => ({
    opacity: withTiming(isExpanded.value ? 0 : 1, {
      duration: isExpanded.value ? 150 : 600,
    }),
  }));

  return (
    <GestureDetector gesture={panButton}>
      <Animated.View style={[styles.container, stylesContainer, stylesInTap]}>
        <GestureDetector gesture={panContainer}>
          <Animated.View style={[styles.content, stylesContent]}>
            <Animated.Text style={[styles.IconPlus, stylesIcon]}>
              +
            </Animated.Text>
          </Animated.View>
        </GestureDetector>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
  },
  content: {
    backgroundColor: "green",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  IconPlus: {
    color: "#fff",
    fontSize: 40,
  },
});

export default CircleExpanded;
