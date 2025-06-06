import { Stack } from "expo-router";

const AuthLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="login"
        options={{
          title: "Sign In",
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="register"
        options={{
          title: "Sign Up",
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="edit-profile"
        options={{
          title: "Edit Profile",
          presentation: "modal",
        }}
      />
    </Stack>
  );
};

export default AuthLayout;
