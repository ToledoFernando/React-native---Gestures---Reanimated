import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

interface Props {
  children: ReactNode;
  justifyContent?: "center" | "flex-end" | "flex-start";
  alignItems?: "center" | "flex-end" | "flex-start";
}

function Container({
  children,
  justifyContent = "center",
  alignItems = "center",
}: Props) {
  return (
    <View style={[styles.container, { justifyContent, alignItems }]}>
      {children}
    </View>
  );
}

export default Container;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 6,
    paddingVertical: 32,
    backgroundColor: "#fff",
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
});
