import { Stack } from "expo-router";
import { PostsProvider } from "../../src/context/PostsContext";

export default function RootLayout() {
  return (
    <PostsProvider>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: "Home",
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="post/[slug]"
          options={{
            title: "Article",
            headerShown: true,
          }}
        />
      </Stack>
    </PostsProvider>
  );
}
