import { Tabs } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { PostsProvider } from "../context/PostsContext";

const TabsLayout = () => {
  const { user } = useAuth();

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: "#5CB85C",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerTitle: "Home",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="home" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(auth)"
        options={{
          title: user ? "Profile" : "Login",
          headerTitle: user ? "Profile" : "Login",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="user" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="post/[slug]"
        options={{
          href: null, // Hide from tabs
          headerTitle: "Article",
        }}
      />
    </Tabs>
  );
};

const RootLayout = () => {
  return (
    <AuthProvider>
      <PostsProvider>
        <TabsLayout />
      </PostsProvider>
    </AuthProvider>
  );
};

export default RootLayout;
