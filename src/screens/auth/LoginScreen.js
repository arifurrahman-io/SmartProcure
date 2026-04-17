import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import ScreenWrapper from "../../components/common/ScreenWrapper";
import AppInput from "../../components/common/AppInput";
import AppButton from "../../components/common/AppButton";

export default function LoginScreen({ navigation }) {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLogin = async () => {
    try {
      setLoading(true);

      // TODO: Firebase login logic here
      console.log("Login data:", form);

      // Example navigation after login
      // navigation.replace("MainTabs");
    } catch (error) {
      console.log("Login error:", error);
    } finally {
      setLoading(false);
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
            />

            <AppInput
              label="Password"
              placeholder="Enter your password"
              value={form.password}
              onChangeText={(text) => handleChange("password", text)}
              secureTextEntry
            />

            <TouchableOpacity
              style={styles.forgotWrap}
              onPress={() => navigation.navigate("ForgotPassword")}
              activeOpacity={0.8}
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
  },
  welcome: {
    fontSize: 30,
    fontWeight: "800",
    color: "#0F172A",
  },
  subtitle: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 22,
    color: "#64748B",
  },
  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: "#EEF2F7",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
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
