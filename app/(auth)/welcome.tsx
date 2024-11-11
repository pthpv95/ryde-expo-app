import { router } from "expo-router";
import { onboarding } from "@/constants";
import { useRef, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Swiper from "react-native-swiper";
import CustomButton from "../components/CustomButton";

const Onboarding = () => {
  const ref = useRef<Swiper>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const isLastIndex = activeIndex === onboarding.length - 1;
  return (
    <SafeAreaView className="flex h-full items-center justify-between bg-white">
      <TouchableOpacity
        className="w-full flex justify-end items-end p-5"
        onPress={() => router.replace("/(auth)/sign-up")}
      >
        <Text className="text-black text-md font-JakartaBold">Skip</Text>
      </TouchableOpacity>
      <Swiper
        ref={ref}
        loop={false}
        dot={
          <View className="w-[32px] h-[4px] mx-1 bg-[#E2E8F0] rounded-full" />
        }
        activeDot={
          <View className="w-[32px] h-[4px] mx-1 bg-[#028cff] rounded-full" />
        }
        index={activeIndex}
        onIndexChanged={(index) => setActiveIndex(index)}
      >
        {onboarding.map((item) => (
          <View className="flex items-center justify-center p-5" key={item.id}>
            <Image
              source={item.image}
              className="w-full h-[300px]"
              resizeMode="contain"
            />
            <View className="flex flex-row items-center justify-center w-full mt-10">
              <Text className="text-black text-3xl font-bold mx-10 text-center">
                {item.title}
              </Text>
            </View>
            <Text className="text-lg text-center mx-10 mt-3 text-[#858585] font-JakartaSemiBold">
              {item.description}
            </Text>
          </View>
        ))}
      </Swiper>
      <CustomButton
        onPress={() => {
          if (isLastIndex) {
            router.replace("/(auth)/sign-up");
          } else {
            ref.current?.scrollBy(1);
          }
        }}
        title={isLastIndex ? "Get Started" : "Next"}
        textVariant="default"
        className="w-11/12 mt-10"
      />
    </SafeAreaView>
  );
};

export default Onboarding;
