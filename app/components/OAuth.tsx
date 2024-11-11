import { Image, Text, View } from "react-native";
import CustomButton from "./CustomButton";
import { icons } from "@/constants";

const OAuth = () => {
  const handleGoogleSignIn = () => {
    console.log("Sign in with Google");
  };

  return (
    <View>
      <View className="flex flex-row justify-center items-center mt-4 gap-x-3">
        <View className="flex-1 h-[1px] bg-neutral-200" />
        <Text className="text-lg">OR</Text>
        <View className="flex-1 h-[1px] bg-neutral-200" />
      </View>

      <CustomButton
        className="mt-5 w-full shadow-none"
        title="Login with Google"
        bgVariant="outline"
        textVariant="primary"
        onPress={handleGoogleSignIn}
        IconLeft={() => (
          <Image className="w-5 h-5 mx-2" source={icons.google} />
        )}
      />
    </View>
  );
};

export default OAuth;
