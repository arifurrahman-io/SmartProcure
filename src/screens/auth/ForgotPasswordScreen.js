import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import ScreenWrapper from "../../components/common/ScreenWrapper";
import AppHeader from "../../components/common/AppHeader";
import AppInput from "../../components/common/AppInput";
import AppButton from "../../components/common/AppButton";
import useAuth from "../../hooks/useAuth";
import { showErrorToast, showSuccessToast } from "../../utils/toast";
import { getErrorMessage } from "../../utils/errorHandler";

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();

  const handleResetPassword = async () => {
    const safeEmail = email.trim();

    if (!safeEmail) {
      showErrorToast("Email Required", "Enter your registered email address");
      return;
    }

    try {
      setLoading(true);

      await resetPassword(safeEmail);
      showSuccessToast("Reset Link Sent", "Check your email inbox");

      navigation.goBack();
    } catch (error) {
      console.log("Reset error:", error);
      showErrorToast(
        "Reset Failed",
        getErrorMessage(error, "Unable to send password reset email"),
      );
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
        <AppHeader title="Forgot Password" onBack={() => navigation.goBack()} />

        <View style={styles.container}>
          <View style={styles.card}>
            <Text style={styles.title}>Reset Your Password</Text>
            <Text style={styles.subtitle}>
              Enter your registered email address. We will send a password reset
              link to your inbox.
            </Text>

            <AppInput
              label="Email Address"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />

            <AppButton
              title="Send Reset Link"
              onPress={handleResetPassword}
              loading={loading}
              style={styles.button}
            />
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
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: "#EEF2F7",
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0F172A",
  },
  subtitle: {
    marginTop: 10,
    marginBottom: 20,
    fontSize: 14,
    lineHeight: 22,
    color: "#64748B",
  },
  button: {
    marginTop: 6,
  },
});
