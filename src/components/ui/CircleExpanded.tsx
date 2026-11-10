import { StyleSheet, Text, useWindowDimensions } from "react-native";
import { GestureDetector, useTapGesture } from "react-native-gesture-handler";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";

const defaultSize = 70;
const defaultSpacing = 16;

function CircleExpanded() {
  const isTap = useSharedValue(false);

  const { height, width } = useWindowDimensions();

  const size = useSharedValue(defaultSize);

  const tap = useTapGesture({
    onBegin: () => {
      if (isTap.value) isTap.value = false;
      else isTap.value = true;
    },
  });

  const stylesContent = useAnimatedStyle(() => ({
    width: withTiming(isTap.value ? width : defaultSize),
    height: withTiming(isTap.value ? height : defaultSize),
    borderRadius: withTiming(isTap.value ? 0 : 100),
  }));

  const stylesContainer = useAnimatedStyle(() => ({
    bottom: withTiming(isTap.value ? 0 : defaultSpacing),
    right: withTiming(isTap.value ? 0 : defaultSpacing),
  }));

  return (
    <GestureDetector gesture={tap}>
      <Animated.View style={[styles.container, stylesContainer]}>
        <Animated.View style={[styles.content, stylesContent]}>
          <Text style={{ color: "#fff" }}>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dicta,
            iusto.
          </Text>
        </Animated.View>
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
  },
});

export default CircleExpanded;
