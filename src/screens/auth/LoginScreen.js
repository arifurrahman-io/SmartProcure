import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import ScreenWrapper from "../../components/common/ScreenWrapper";
import AppInput from "../../components/common/AppInput";
import AppButton from "../../components/common/AppButton";

import { validateLoginForm } from "../../utils/validators";
import { getErrorMessage } from "../../utils/errorHandler";
import { showErrorToast, showSuccessToast } from "../../utils/toast";
import useAuth from "../../hooks/useAuth";
import useUiStore from "../../store/useUiStore";

export default function LoginScreen({ navigation }) {
  const setGlobalLoading = useUiStore((state) => state.setGlobalLoading);
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleLogin = async () => {
    Keyboard.dismiss();

    const trimmedForm = {
      email: form.email.trim(),
      password: form.password,
    };

    const validationErrors = validateLoginForm(trimmedForm);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      showErrorToast("Validation Error", Object.values(validationErrors)[0]);
      return;
    }

    try {
      setLoading(true);
      setGlobalLoading(true);
      setErrors({});

      await login(trimmedForm);

      showSuccessToast("Login Successful", "Welcome back to SmartProcure");

      // Navigation manually করার দরকার নেই যদি AppNavigator auth store / auth listener observe করে
      // AuthProvider + AppNavigator automatic redirect handle করবে
    } catch (error) {
      showErrorToast(
        "Login Failed",
        getErrorMessage(error, "Please try again"),
      );
    } finally {
      setLoading(false);
      setGlobalLoading(false);
    }
  };

  return (
    <ScreenWrapper>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.container}>
          <View style={styles.topSection}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>SP</Text>
            </View>

            <Text style={styles.welcome}>Welcome Back</Text>
            <Text style={styles.subtitle}>
              Login to manage purchase requests, quotations, approvals, and
              audit-ready records.
            </Text>
          </View>

          <View style={styles.formCard}>
            <AppInput
              label="Email Address"
              placeholder="Enter your email"
              value={form.email}
              onChangeText={(text) => handleChange("email", text)}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {errors.email ? (
              <Text style={styles.errorText}>{errors.email}</Text>
            ) : null}

            <View style={styles.passwordWrap}>
              <AppInput
                label="Password"
                placeholder="Enter your password"
                value={form.password}
                onChangeText={(text) => handleChange("password", text)}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />

              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword((prev) => !prev)}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#64748B"
                />
              </TouchableOpacity>
            </View>

            {errors.password ? (
              <Text style={styles.errorText}>{errors.password}</Text>
            ) : null}

            <TouchableOpacity
              style={styles.forgotWrap}
              onPress={() => navigation.navigate("ForgotPassword")}
              activeOpacity={0.8}
              disabled={loading}
            >
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>

            <AppButton
              title="Login"
              onPress={handleLogin}
              loading={loading}
              style={styles.loginButton}
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Official SmartProcure access for purchase committee members only.
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
  },
  topSection: {
    marginBottom: 28,
    alignItems: "center",
  },
  logoCircle: {
    width: 74,
    height: 74,
    borderRadius: 8,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  logoText: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "800",
  },
  welcome: {
    fontSize: 30,
    fontWeight: "800",
    color: "#0F172A",
    textAlign: "center",
  },
  subtitle: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 22,
    color: "#64748B",
    textAlign: "center",
  },
  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    ...Platform.select({
      web: {
        boxShadow: "0 10px 28px rgba(15, 23, 42, 0.06)",
      },
      default: {
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        elevation: 2,
      },
    }),
  },
  passwordWrap: {
    position: "relative",
  },
  eyeButton: {
    position: "absolute",
    right: 14,
    top: 40,
    zIndex: 10,
    padding: 4,
  },
  errorText: {
    marginTop: -8,
    marginBottom: 10,
    fontSize: 12,
    color: "#DC2626",
    fontWeight: "600",
  },
  forgotWrap: {
    alignSelf: "flex-end",
    marginTop: -4,
    marginBottom: 16,
  },
  forgotText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#4F46E5",
  },
  loginButton: {
    marginTop: 6,
  },
  footer: {
    marginTop: 24,
    alignItems: "center",
  },
  footerText: {
    textAlign: "center",
    fontSize: 12,
    lineHeight: 18,
    color: "#94A3B8",
  },
});
