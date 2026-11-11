import { useEffect } from "react";
import {
    Button,
    Pressable,
    StyleSheet,
    Text,
    useWindowDimensions,
    View,
} from "react-native";
import { GestureDetector, usePanGesture } from "react-native-gesture-handler";
import Animated, {
    createAnimatedComponent,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

type SnapPoints = `${number}%`;

interface Props {
  show: boolean;
  onClose: () => void;
  snapPoint?: SnapPoints[];
}

const PressableComponent = createAnimatedComponent(Pressable);

const BORDER_RADIUS = 30;

function BottomSheet({ onClose, show, snapPoint }: Props) {
  const { height, width } = useWindowDimensions();
  const showBottomSheet = useSharedValue(false);

  const translateY = useSharedValue(0);

  const pan = usePanGesture({
    onUpdate: (props) => {
      translateY.value = props.translationY;
    },
    onFinalize: () => {
      if (translateY.value > 80) scheduleOnRN(onClose);
      translateY.value = 0;
    },
  });

  const styledBottomSheetContainer = useAnimatedStyle(() => ({
    transform: [
      {
        translateY:
          translateY.value > 0
            ? Math.max(translateY.value, 0)
            : withTiming(showBottomSheet.value ? 0 : height),
      },
    ],
  }));

  const styledBottomSheedOverlay = useAnimatedStyle(() => ({
    backgroundColor: "#00000050",
    opacity: Math.exp(-translateY.value / 200),
  }));

  useEffect(() => {
    showBottomSheet.value = show;
  }, [show]);

  return (
    <>
      {show && (
        <PressableComponent
          onPress={onClose}
          style={[
            styles.container,
            { height, width, backgroundColor: "#00000000" },
            styledBottomSheedOverlay,
          ]}
        ></PressableComponent>
      )}
      <Animated.View
        style={[
          styles.containerBottomSheet,
          { width },
          styledBottomSheetContainer,
        ]}
      >
        <GestureDetector gesture={pan}>
          <View style={styles.panGestureContainer}>
            <View style={[styles.panGesture, { width: width * 0.2 }]}></View>
          </View>
        </GestureDetector>
        <View>
          {Array.from({ length: 2 }).map((_, i) => (
            <Text key={i} style={{ marginVertical: 10 }}>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ducimus
              atque, illum error doloribus id numquam quis iure perspiciatis
              repellendus nisi sint, rem, impedit iste eos facilis consectetur
              provident aliquam similique sed. Corporis id voluptatum enim
              numquam deleniti voluptas dolorem illo. Ipsa id voluptates optio
              autem est qui doloribus sed suscipit officiis quas veritatis ut
              incidunt, cum provident tenetur illo corrupti consequatur atque,
              amet aut cupiditate quae illum. Consequatur a maiores magnam
              facilis sunt illo officiis quibusdam deleniti reprehenderit quia
              non quisquam dolore perferendis veniam quos blanditiis delectus,
              fuga facere itaque?
            </Text>
          ))}
        </View>
        <Button title="CLOSE" onPress={onClose} />
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    flex: 1,
  },
  containerBottomSheet: {
    backgroundColor: "#fff",
    position: "absolute",
    borderTopEndRadius: BORDER_RADIUS,
    borderTopStartRadius: BORDER_RADIUS,
    padding: 18,
    bottom: 0,
  },
  panGestureContainer: {
    display: "flex",
    justifyContent: "center",
    paddingVertical: 4,
    flex: 1,
    width: "100%",
  },
  panGesture: {
    backgroundColor: "#00000030",
    borderRadius: 9999,
    height: 6,
    marginHorizontal: "auto",
    marginBottom: 12,
  },
});

export default BottomSheet;
