import { Platform, ScrollView, StyleSheet, View, Text, Switch } from "react-native";

import ScreenWrapper from "../../components/common/ScreenWrapper";
import AppHeader from "../../components/common/AppHeader";
import ProfileMenuItem from "../../components/profile/ProfileMenuItem";

import ROUTES from "../../navigation/routes";
import useUiStore from "../../store/useUiStore";
import useAppTheme from "../../hooks/useAppTheme";
import useAuth from "../../hooks/useAuth";
import { getErrorMessage } from "../../utils/errorHandler";
import {
  showErrorToast,
  showInfoToast,
  showSuccessToast,
} from "../../utils/toast";

export default function SettingsScreen({ navigation }) {
  const {
    themeMode,
    setThemeMode,
    pushEnabled,
    emailEnabled,
    setPushEnabled,
    setEmailEnabled,
  } = useUiStore();

  const { isDark } = useAppTheme();
  const { profile, resetPassword } = useAuth();

  // =========================
  // Handlers
  // =========================

  const handlePushToggle = (value) => {
    setPushEnabled(value);
    showInfoToast("Push Notifications", value ? "Enabled" : "Disabled");
  };

  const handleEmailToggle = (value) => {
    setEmailEnabled(value);
    showInfoToast("Email Notifications", value ? "Enabled" : "Disabled");
  };

  const handleThemeToggle = (value) => {
    const mode = value ? "dark" : "light";
    setThemeMode(mode);

    showInfoToast(
      "Theme Updated",
      value ? "Dark mode enabled" : "Light mode enabled",
    );
  };

  const handleChangePassword = async () => {
    const email = profile?.email;

    if (!email) {
      showErrorToast("Email Not Found", "Unable to send a reset link");
      return;
    }

    try {
      await resetPassword(email);
      showSuccessToast("Reset Link Sent", "Check your email inbox");
    } catch (error) {
      showErrorToast(
        "Reset Failed",
        getErrorMessage(error, "Unable to send password reset email"),
      );
    }
  };

  return (
    <ScreenWrapper>
      <AppHeader title="Settings" onBack={() => navigation.goBack()} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Push Notification */}
        <View style={styles.switchCard}>
          <View style={styles.switchTextWrap}>
            <Text style={styles.switchTitle}>Push Notifications</Text>
            <Text style={styles.switchSubtitle}>
              Receive instant alerts for requests, quotations and approvals
            </Text>
          </View>
          <Switch
            value={pushEnabled ?? true}
            onValueChange={handlePushToggle}
          />
        </View>

        {/* Email Notification */}
        <View style={styles.switchCard}>
          <View style={styles.switchTextWrap}>
            <Text style={styles.switchTitle}>Email Notifications</Text>
            <Text style={styles.switchSubtitle}>
              Get important updates in your email inbox
            </Text>
          </View>
          <Switch
            value={emailEnabled ?? false}
            onValueChange={handleEmailToggle}
          />
        </View>

        {/* Theme */}
        <View style={styles.switchCard}>
          <View style={styles.switchTextWrap}>
            <Text style={styles.switchTitle}>Dark Mode</Text>
            <Text style={styles.switchSubtitle}>
              Enable dark theme for the app interface
            </Text>
          </View>
          <Switch value={isDark} onValueChange={handleThemeToggle} />
        </View>

        {/* Actions */}
        <ProfileMenuItem
          title="Change Password"
          subtitle="Update your account password"
          icon="lock-closed-outline"
          onPress={handleChangePassword}
        />

        <ProfileMenuItem
          title="App Version"
          subtitle="Current installed version"
          icon="information-circle-outline"
          rightText="1.0.0"
        />

        <ProfileMenuItem
          title="Terms & Privacy"
          subtitle="Read app terms and privacy policy"
          icon="document-text-outline"
          onPress={() =>
            showInfoToast("Terms & Privacy", "Please contact your system admin")
          }
        />

        <ProfileMenuItem
          title="Notification Settings"
          subtitle="Advanced notification preferences"
          icon="notifications-outline"
          onPress={() => navigation.navigate(ROUTES.NOTIFICATIONS)}
        />
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 24,
  },
  switchCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    ...Platform.select({
      web: {
        boxShadow: "0 8px 22px rgba(15, 23, 42, 0.04)",
      },
      default: {
        shadowColor: "#000",
        shadowOpacity: 0.03,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
        elevation: 1,
      },
    }),
  },
  switchTextWrap: {
    flex: 1,
  },
  switchTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },
  switchSubtitle: {
    marginTop: 4,
    fontSize: 12,
    color: "#64748B",
    lineHeight: 18,
  },
});
