import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import fontSize, { moderateScale } from '../utils/metrix';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleLogin = async () => {
    setEmailError('');
    setPasswordError('');

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    let hasError = false;

    if (!trimmedEmail) {
      setEmailError('Email is required');
      hasError = true;
    }
    if (!trimmedPassword) {
      setPasswordError('Password is required');
      hasError = true;
    }

    if (hasError) return;

    setLoading(true);
    try {
      const userCredential = await auth().signInWithEmailAndPassword(trimmedEmail, trimmedPassword);
      
      // ✅ Store email in AsyncStorage
      await AsyncStorage.setItem('userEmail', trimmedEmail);

      navigation.replace('Main');
    } catch (err) {
      console.log('Login Error Code:', err.code);
      switch (err.code) {
        case 'auth/user-not-found':
        case 'auth/invalid-email':
          setEmailError('Invalid or non-existing email.');
          break;
        case 'auth/wrong-password':
          setPasswordError('Incorrect password.');
          break;
        case 'auth/too-many-requests':
          setPasswordError('Too many attempts. Try again later.');
          break;
        case 'auth/network-request-failed':
          setPasswordError('Network error. Please check your connection.');
          break;
        default:
          setPasswordError('Login failed. Try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />

      <View style={styles.iconBox}>
        <Ionicons name="checkmark" size={moderateScale(40)} color="#fff" />
      </View>

      <Text style={styles.heading}>Welcome Back!</Text>

      {/* Email */}
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={[styles.input, emailError && styles.inputError]}
          placeholder="Enter your email"
          placeholderTextColor="#999"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            if (text) setEmailError('');
          }}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
      </View>

      {/* Password */}
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={[
              styles.input,
              styles.passwordInput,
              passwordError && styles.inputError,
              { right: moderateScale(18) },
            ]}
            placeholder="Enter your password"
            placeholderTextColor="#999"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (text) setPasswordError('');
            }}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? 'eye-off' : 'eye'}
              size={moderateScale(20)}
              color="#666"
              style={styles.eyeIcon}
            />
          </TouchableOpacity>
        </View>
        {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
      </View>

      {/* Login Button */}
      <TouchableOpacity style={styles.signupBtn} onPress={handleLogin} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.signupText}>Log in</Text>}
      </TouchableOpacity>

      <Text style={styles.orText}>or continue with</Text>

      <View style={styles.socialRow}>
        <TouchableOpacity style={[styles.socialBtn, { backgroundColor: '#3b5998' }]}>
          <FontAwesome name="facebook" size={moderateScale(20)} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.socialBtn, { backgroundColor: '#db4437' }]}>
          <FontAwesome name="google" size={moderateScale(20)} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.socialBtn, { backgroundColor: '#000' }]}>
          <MaterialCommunityIcons name="apple" size={moderateScale(22)} color="#fff" />
        </TouchableOpacity>
      </View>

      <Text style={styles.loginLink}>
        Don’t have an account?{' '}
        <Text style={styles.loginClickable} onPress={() => navigation.navigate('Signup')}>
          Sign up
        </Text>
      </Text>
    </View>
  );
};

export default Login;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: moderateScale(24),
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: moderateScale(130),
  },
  iconBox: {
    width: moderateScale(100),
    height: moderateScale(100),
    borderRadius: moderateScale(20),
    backgroundColor: '#6C63FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: moderateScale(30),
  },
  heading: {
    fontSize: fontSize(25),
    fontWeight: '700',
    color: '#352E84',
    marginBottom: moderateScale(40),
  },
  inputWrapper: {
    width: '100%',
    marginBottom: moderateScale(16),
  },
  label: {
    fontSize: fontSize(13),
    color: '#666',
    marginBottom: moderateScale(6),
    marginLeft: moderateScale(4),
    fontWeight: '700',
  },
  input: {
    backgroundColor: '#F2F3F7',
    borderRadius: moderateScale(12),
    paddingHorizontal: moderateScale(16),
    fontSize: fontSize(14),
    color: '#333',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F3F7',
    borderRadius: moderateScale(12),
    paddingHorizontal: moderateScale(16),
  },
  passwordInput: {
    flex: 1,
    paddingVertical: moderateScale(12),
  },
  eyeIcon: {
    marginLeft: moderateScale(8),
  },
  inputError: {
    borderColor: 'red',
    borderWidth: 1,
  },
  errorText: {
    color: 'red',
    fontSize: fontSize(13),
    marginTop: moderateScale(4),
    marginLeft: moderateScale(4),
    fontWeight: '500',
  },
  signupBtn: {
    backgroundColor: '#6C63FF',
    width: '100%',
    paddingVertical: moderateScale(14),
    borderRadius: moderateScale(24),
    alignItems: 'center',
    marginTop: moderateScale(8),
    elevation: 2,
  },
  signupText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: fontSize(16),
  },
  orText: {
    marginVertical: moderateScale(25),
    color: '#888',
    fontSize: fontSize(14),
  },
  socialRow: {
    flexDirection: 'row',
    columnGap: moderateScale(16),
    marginBottom: moderateScale(30),
  },
  socialBtn: {
    width: moderateScale(48),
    height: moderateScale(48),
    borderRadius: moderateScale(24),
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginLink: {
    color: '#999',
    fontSize: fontSize(14),
  },
  loginClickable: {
    color: '#6C63FF',
    fontWeight: '600',
    fontSize: fontSize(14),
  },
});
