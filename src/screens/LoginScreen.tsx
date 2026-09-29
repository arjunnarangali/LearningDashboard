import React from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useLoginForm} from '../hooks/useLoginForm';
import {RootStackParamList} from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export function LoginScreen({navigation}: Props) {
  const {email, password, loading, error, emailError, changeEmail, changePassword, submit} =
    useLoginForm(() => navigation.replace('Dashboard'));

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.brandMark}><Text style={styles.brandLetter}>L</Text></View>
        <Text style={styles.eyebrow}>LEARNING DASHBOARD</Text>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Sign in to continue your learning journey.</Text>

        <Text style={styles.label}>Email</Text>
        <TextInput
          accessibilityLabel="Email"
          autoCapitalize="none"
          autoComplete="email"
          autoCorrect={false}
          keyboardType="email-address"
          onChangeText={changeEmail}
          placeholder="you@example.com"
          placeholderTextColor="#9297AA"
          returnKeyType="next"
          style={[styles.input, emailError ? styles.inputError : null]}
          value={email}
        />
        {emailError ? <Text style={styles.fieldError}>{emailError}</Text> : null}

        <Text style={[styles.label, styles.passwordLabel]}>Password</Text>
        <TextInput
          accessibilityLabel="Password"
          autoCapitalize="none"
          autoComplete="password"
          onChangeText={changePassword}
          onSubmitEditing={submit}
          placeholder="At least 6 characters"
          placeholderTextColor="#9297AA"
          returnKeyType="go"
          secureTextEntry
          style={styles.input}
          value={password}
        />

        {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
        <Pressable
          accessibilityRole="button"
          disabled={loading}
          onPress={submit}
          style={({pressed}) => [styles.button, pressed && !loading ? styles.pressed : null]}>
          {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>Sign in</Text>}
        </Pressable>
        <Text style={styles.demoHint}>Demo: any valid email and a 6+ character password</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: '#F6F7FB'},
  content: {flexGrow: 1, justifyContent: 'center', paddingHorizontal: 28, paddingVertical: 40},
  brandMark: {width: 54, height: 54, borderRadius: 18, backgroundColor: '#5B5CE2', alignItems: 'center', justifyContent: 'center', marginBottom: 28},
  brandLetter: {fontSize: 26, fontWeight: '800', color: '#FFFFFF'},
  eyebrow: {fontSize: 11, letterSpacing: 1.8, fontWeight: '800', color: '#5B5CE2', marginBottom: 10},
  title: {fontSize: 34, lineHeight: 40, fontWeight: '800', color: '#20253A'},
  subtitle: {fontSize: 15, lineHeight: 22, color: '#72788D', marginTop: 8, marginBottom: 34},
  label: {fontSize: 13, fontWeight: '700', color: '#34394D', marginBottom: 8},
  passwordLabel: {marginTop: 20},
  input: {height: 54, borderRadius: 14, borderWidth: 1, borderColor: '#E3E5ED', backgroundColor: '#FFFFFF', paddingHorizontal: 16, color: '#20253A', fontSize: 15},
  inputError: {borderColor: '#D94D5C'},
  fieldError: {fontSize: 12, color: '#C43D4C', marginTop: 6},
  error: {fontSize: 13, color: '#C43D4C', marginTop: 14},
  button: {height: 54, borderRadius: 15, backgroundColor: '#5B5CE2', alignItems: 'center', justifyContent: 'center', marginTop: 26},
  buttonText: {fontSize: 15, fontWeight: '700', color: '#FFFFFF'},
  pressed: {opacity: 0.82},
  demoHint: {fontSize: 12, textAlign: 'center', color: '#9297AA', marginTop: 18},
});
