import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#F59E0B",
        tabBarInactiveTintColor: "#6B7280",
        tabBarStyle: {
          backgroundColor: "#1F2937",
          borderTopWidth: 1,
          borderTopColor: "#374151",
          paddingBottom: 5,
          paddingTop: 5,
          marginBottom: 15,
          height: 60,
        },
        headerStyle: {
          backgroundColor: "#111827",
          elevation: 1,
          shadowOpacity: 0.3,
        },
        headerTitleStyle: {
          fontWeight: "bold",
          fontSize: 20,
          color: "#F9FAFB",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Discover",
          headerTitle: "Daekho - Discover",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="toprated"
        options={{
          title: "Top Rated",
          headerTitle: "Top Rated Movies",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "star" : "star-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="nowplaying"
        options={{
          title: "Now Playing",
          headerTitle: "Now Playing",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "play" : "play-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerTitle: "Your Profile",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
