import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../contexts/AuthContext";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const router = useRouter();

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    console.log("Attempting to sign in with:", email);
    setLoading(true);
    try {
      if (isLogin) {
        console.log("Calling signIn...");
        await signIn(email, password);
        console.log("SignIn successful");
        // Add a small delay and then manually navigate
        setTimeout(() => {
          console.log("Manually navigating after successful sign in...");
          router.replace("/");
        }, 1000);
      } else {
        console.log("Calling signUp...");
        await signUp(email, password);
        console.log("SignUp successful");
        // Add a small delay and then manually navigate
        setTimeout(() => {
          console.log("Manually navigating after successful sign up...");
          router.replace("/");
        }, 1000);
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      Alert.alert("Error", error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleManualNavigation = () => {
    console.log("Manual navigation button pressed");
    router.replace("/");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            paddingHorizontal: 24,
            backgroundColor: "#111827",
          }}
        >
          <View
            style={{
              backgroundColor: "#1F2937",
              borderRadius: 16,
              padding: 24,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.3,
              shadowRadius: 16,
              elevation: 8,
            }}
          >
            <Text
              style={{
                fontSize: 32,
                fontWeight: "bold",
                textAlign: "center",
                marginBottom: 32,
                color: "#F9FAFB",
              }}
            >
              {isLogin ? "🎬 Welcome Back" : "🚀 Create Account"}
            </Text>

            <View style={{ marginBottom: 16 }}>
              <Text
                style={{ color: "#F9FAFB", marginBottom: 8, fontWeight: "600" }}
              >
                Email
              </Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: "#374151",
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  backgroundColor: "#374151",
                  fontSize: 16,
                  color: "#F9FAFB",
                }}
                placeholder="Enter your email"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={{ marginBottom: 24 }}>
              <Text
                style={{ color: "#F9FAFB", marginBottom: 8, fontWeight: "600" }}
              >
                Password
              </Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: "#374151",
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  backgroundColor: "#374151",
                  fontSize: 16,
                  color: "#F9FAFB",
                }}
                placeholder="Enter your password"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
              />
            </View>

            <TouchableOpacity
              style={{
                backgroundColor: loading ? "#6B7280" : "#F59E0B",
                paddingVertical: 14,
                borderRadius: 12,
                marginBottom: 16,
              }}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text
                style={{
                  color: loading ? "#D1D5DB" : "#1F2937",
                  textAlign: "center",
                  fontWeight: "700",
                  fontSize: 18,
                }}
              >
                {loading
                  ? "Please wait..."
                  : isLogin
                  ? "🎬 Sign In"
                  : "🚀 Sign Up"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ paddingVertical: 8 }}
              onPress={() => setIsLogin(!isLogin)}
            >
              <Text
                style={{
                  color: "#F59E0B",
                  textAlign: "center",
                  fontWeight: "600",
                }}
              >
                {isLogin
                  ? "Don't have an account? Sign up"
                  : "Already have an account? Sign in"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
