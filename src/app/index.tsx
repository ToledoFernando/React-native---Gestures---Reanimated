import Container from "@/components/Container";
import BottomSheet from "@/components/ui/BottomSheet";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

function Index() {
  const [show, setShow] = useState<boolean>(false);

  const handleChange = () => setShow((prev) => !prev);

  return (
    <Container>
      <View>
        <TouchableOpacity
          style={{ padding: 20, backgroundColor: "cyan" }}
          onPress={handleChange}
        >
          <Text>PRESS</Text>
        </TouchableOpacity>
      </View>
      <BottomSheet onClose={handleChange} show={show} />
    </Container>
  );
}

export default Index;
