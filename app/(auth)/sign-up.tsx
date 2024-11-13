import InputField from "@/app/components/InputField";
import { icons, images } from "@/constants";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";
import CustomButton from "../components/CustomButton";
import OAuth from "../components/OAuth";
import { useSignUp } from "@clerk/clerk-expo";
import ReactNativeModal from "react-native-modal";
import { fetchAPI } from "../libs/fetch";

const VerificationContent = ({
  pendingVerification,
  setPendingVerification,
  onPressVerify,
}: any) => {
  return (
    <View className="bg-white px-7 py-9 rounded-2xl min-h-[350px]">
      <Text className="text-2xl text-center font-JakartaExtraBold mb-2">
        Verification
      </Text>
      <Text className="text-JakartaSemiBold mb-5">
        We're sent a verification code to your email
      </Text>

      <InputField
        label="Code"
        value={pendingVerification.code}
        placeholder="123456"
        keyboardType="numeric"
        icon={icons.lock}
        onChangeText={(value) =>
          setPendingVerification({ ...pendingVerification, code: value })
        }
      />
      {pendingVerification.error && (
        <Text className="text-red-500 text-center">
          {pendingVerification.error}
        </Text>
      )}

      <CustomButton
        title="Verify email"
        onPress={onPressVerify}
        className="mt-5 bg-success-500"
      />
    </View>
  );
};

const SuccessContent = ({ closeModal }: any) => {
  return (
    <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
      <Image
        source={images.check}
        className="w-[110px] h-[110px] mx-auto my-5"
      />
      <Text className="text-3xl text-center font-JakartaSemiBold">
        Verified
      </Text>
      <Text className="text-base text-gray-400 text-center mt-2">
        You have successfully verified your email
      </Text>
      <CustomButton title="Browse home" onPress={closeModal} className="mt-5" />
    </View>
  );
};
const SignUp = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [pendingVerification, setPendingVerification] = useState({
    code: "",
    error: "",
    state: "default",
  });

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const onSignUpPress = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      await signUp.create({
        emailAddress: form.email,
        password: form.password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      setPendingVerification((prev) => ({ ...prev, state: "pending" }));
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));

      setPendingVerification((prev) => ({
        ...prev,
        error: err.errors[0].longMessage,
      }));
    }
  };

  const onPressVerify = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: pendingVerification.code,
      });

      if (completeSignUp.status === "complete") {
        await fetchAPI(`/(api)/user`, {
          method: "POST",
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            clerkId: completeSignUp.createdUserId,
          }),
        });
        await setActive({ session: completeSignUp.createdSessionId });
        setPendingVerification((prev) => ({
          ...prev,
          state: "success",
        }));
      } else {
        setPendingVerification((prev) => ({
          ...prev,
          state: "failed",
          error: "verification failed",
        }));
        console.error(JSON.stringify(completeSignUp, null, 2));
      }
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));

      setPendingVerification((prev) => ({
        ...prev,
        state: "failed",
        error: err.errors[0].longMessage,
      }));
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 bg-white">
        <View className="relative w-full h-[250px]">
          <Image source={images.signUpCar} className="w-full h-[250px] z-0" />
          <Text className="text-2xl text-black font-JakartaSemiBold absolute bottom-5 left-5">
            Create your account
          </Text>
        </View>
        <View className="p-5">
          <InputField
            label="Name"
            value={form.name}
            placeholder="Enter your name"
            icon={icons.person}
            onChangeText={(value) => setForm({ ...form, name: value })}
          />
          <InputField
            label="Email"
            value={form.email}
            placeholder="Enter your email"
            icon={icons.email}
            onChangeText={(value) => setForm({ ...form, email: value })}
          />
          <InputField
            label="Password"
            value={form.password}
            placeholder="Enter your password"
            icon={icons.lock}
            secureTextEntry={true}
            onChangeText={(value) => setForm({ ...form, password: value })}
          />

          {pendingVerification.error && (
            <Text className="text-red-500 text-center">
              {pendingVerification.error}
            </Text>
          )}
          <CustomButton
            title="Sign Up"
            onPress={onSignUpPress}
            className="mt-6"
          />
          <OAuth />
          <Link
            href="/sign-in"
            className="text-lg text-center text-general-200 mt-10"
          >
            <Text className="text-secondary-500">
              Already have an account?{" "}
              <Text className="text-primary-500">Login</Text>
            </Text>
          </Link>
        </View>

        {/* verification modal */}
        <ReactNativeModal
          isVisible={
            pendingVerification.state === "pending" ||
            pendingVerification.state === "success"
          }
        >
          {pendingVerification.state === "pending" && (
            <VerificationContent
              pendingVerification={pendingVerification}
              setPendingVerification={setPendingVerification}
              onPressVerify={onPressVerify}
            />
          )}
          {pendingVerification.state === "success" && (
            <SuccessContent
              closeModal={() => {
                setPendingVerification((prev) => ({
                  ...prev,
                  state: "default",
                }));
                router.push("/(root)/(tabs)/home");
              }}
            />
          )}
        </ReactNativeModal>
      </View>
    </ScrollView>
  );
};

export default SignUp;
