import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const router = useRouter();

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    console.log('Attempting to sign in with:', email);
    setLoading(true);
    try {
      if (isLogin) {
        console.log('Calling signIn...');
        await signIn(email, password);
        console.log('SignIn successful');
        // Add a small delay and then manually navigate
        setTimeout(() => {
          console.log('Manually navigating after successful sign in...');
          router.replace('/');
        }, 1000);
      } else {
        console.log('Calling signUp...');
        await signUp(email, password);
        console.log('SignUp successful');
        // Add a small delay and then manually navigate
        setTimeout(() => {
          console.log('Manually navigating after successful sign up...');
          router.replace('/');
        }, 1000);
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      Alert.alert('Error', error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleManualNavigation = () => {
    console.log('Manual navigation button pressed');
    router.replace('/');
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ 
          flex: 1, 
          justifyContent: 'center', 
          paddingHorizontal: 24, 
          backgroundColor: '#F9FAFB' 
        }}>
          <View style={{ 
            backgroundColor: 'white', 
            borderRadius: 8, 
            padding: 24, 
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}>
            <Text style={{ 
              fontSize: 30, 
              fontWeight: 'bold', 
              textAlign: 'center', 
              marginBottom: 32, 
              color: '#1F2937' 
            }}>
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </Text>
            
            <View style={{ marginBottom: 16 }}>
              <Text style={{ color: '#374151', marginBottom: 8, fontWeight: '500' }}>Email</Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: '#D1D5DB',
                  borderRadius: 8,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  backgroundColor: 'white',
                  fontSize: 16,
                }}
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={{ marginBottom: 24 }}>
              <Text style={{ color: '#374151', marginBottom: 8, fontWeight: '500' }}>Password</Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: '#D1D5DB',
                  borderRadius: 8,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  backgroundColor: 'white',
                  fontSize: 16,
                }}
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
              />
            </View>

            <TouchableOpacity
              style={{
                backgroundColor: loading ? '#9CA3AF' : '#2563EB',
                paddingVertical: 12,
                borderRadius: 8,
                marginBottom: 16,
              }}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={{
                color: 'white',
                textAlign: 'center',
                fontWeight: '600',
                fontSize: 18,
              }}>
                {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Sign Up')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ paddingVertical: 8 }}
              onPress={() => setIsLogin(!isLogin)}
            >
              <Text style={{ color: '#2563EB', textAlign: 'center' }}>
                {isLogin 
                  ? "Don't have an account? Sign up" 
                  : "Already have an account? Sign in"
                }
              </Text>
            </TouchableOpacity>

            {/* Manual navigation button for debugging */}
            <TouchableOpacity
              style={{
                backgroundColor: '#10B981',
                paddingVertical: 8,
                borderRadius: 8,
                marginTop: 16,
              }}
              onPress={handleManualNavigation}
            >
              <Text style={{
                color: 'white',
                textAlign: 'center',
                fontWeight: '500',
              }}>
                Go to App (Debug)
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
