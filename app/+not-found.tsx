import { Link, Stack } from "expo-router";
import { View, Text } from "react-native";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View className="flex-1 items-center justify-center bg-white">
        <Text>This screen doesn't exist.</Text>
        <Link href="/" className="mt-15 p-15">
          <Text>Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}
