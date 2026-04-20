import { useEffect, useState } from "react";
import {
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import ScreenWrapper from "../../components/common/ScreenWrapper";
import AppHeader from "../../components/common/AppHeader";
import AppButton from "../../components/common/AppButton";
import AppInput from "../../components/common/AppInput";
import ProfileMenuItem from "../../components/profile/ProfileMenuItem";

import ROUTES from "../../navigation/routes";
import useUiStore from "../../store/useUiStore";
import useAuthStore from "../../store/useAuthStore";
import useAppTheme from "../../hooks/useAppTheme";
import useAuth from "../../hooks/useAuth";
import useUserRole from "../../hooks/useUserRole";
import { updateUserProfile } from "../../services/firebase/userService";
import { getErrorMessage } from "../../utils/errorHandler";
import { getRoleLabel } from "../../utils/roleHelpers";
import {
  showErrorToast,
  showInfoToast,
  showSuccessToast,
} from "../../utils/toast";

const buildProfileForm = (profile = {}) => ({
  name: profile?.name || profile?.displayName || "",
  campus: profile?.campus || "",
  shift: profile?.shift || "",
  designation: profile?.designation || "",
  phoneNumber: profile?.phoneNumber || "",
});

const getProfilePreferences = (profile = {}) => profile?.preferences || {};

const getNotificationPreferences = (profile = {}) =>
  getProfilePreferences(profile)?.notifications || {};

const isValidThemeMode = (mode) => ["light", "dark", "system"].includes(mode);

export default function SettingsScreen({ navigation }) {
  const {
    themeMode,
    setThemeMode,
    pushEnabled,
    emailEnabled,
    setPushEnabled,
    setEmailEnabled,
  } = useUiStore();

  const setProfile = useAuthStore((state) => state.setProfile);
  const { theme, isDark } = useAppTheme();
  const { profile, resetPassword } = useAuth();
  const { isAdmin, isMember } = useUserRole();

  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [profileForm, setProfileForm] = useState(buildProfileForm(profile));
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [savingPreference, setSavingPreference] = useState(null);

  const roleLabel = getRoleLabel(profile?.role);
  const userId = profile?.id || profile?.uid || null;
  const switchTrackColor = {
    false: isDark ? "#334155" : "#CBD5E1",
    true: theme.colors.primary,
  };
  const switchThumbColor = Platform.OS === "android" ? "#FFFFFF" : undefined;
  const notificationSubtitle = isAdmin
    ? "Approval queues, user changes, reports, and system alerts"
    : isMember
      ? "Request status, quotation updates, and purchase instructions"
      : "Account and app updates";

  useEffect(() => {
    setProfileForm(buildProfileForm(profile));
  }, [profile]);

  useEffect(() => {
    if (!profile) return;

    const preferences = getProfilePreferences(profile);
    const notificationPreferences = getNotificationPreferences(profile);

    if (typeof notificationPreferences.pushEnabled === "boolean") {
      setPushEnabled(notificationPreferences.pushEnabled);
    }

    if (typeof notificationPreferences.emailEnabled === "boolean") {
      setEmailEnabled(notificationPreferences.emailEnabled);
    }

    if (isValidThemeMode(preferences.themeMode)) {
      setThemeMode(preferences.themeMode);
    }
  }, [profile?.id, setEmailEnabled, setPushEnabled, setThemeMode]);

  const navigateToRequestScreen = (screen) => {
    navigation.navigate(ROUTES.REQUESTS, {
      screen,
    });
  };

  const updateProfileForm = (field, value) => {
    setProfileForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const saveUserPreferences = async (updates = {}) => {
    if (!userId) {
      throw new Error("Unable to save settings without a user profile.");
    }

    const currentPreferences = getProfilePreferences(profile);
    const nextPreferences = {
      ...currentPreferences,
      ...updates,
      notifications: {
        ...(currentPreferences.notifications || {}),
        ...(updates.notifications || {}),
      },
    };

    await updateUserProfile(userId, {
      preferences: nextPreferences,
    });

    setProfile({
      ...profile,
      preferences: nextPreferences,
    });
  };

  const requestWebPushPermission = async () => {
    if (Platform.OS !== "web") {
      return "preference-only";
    }

    if (typeof window === "undefined" || !("Notification" in window)) {
      throw new Error("Push notifications are not supported in this browser.");
    }

    if (window.Notification.permission === "granted") {
      return "granted";
    }

    if (window.Notification.permission === "denied") {
      throw new Error("Push notifications are blocked in this browser.");
    }

    const permission = await window.Notification.requestPermission();

    if (permission !== "granted") {
      throw new Error("Push notification permission was not granted.");
    }

    return permission;
  };

  const handlePushToggle = async (value) => {
    const previousValue = pushEnabled;

    try {
      setSavingPreference("push");

      const permission = value ? await requestWebPushPermission() : "disabled";

      setPushEnabled(value);
      await saveUserPreferences({
        notifications: {
          pushEnabled: value,
          pushPermission: permission,
          pushUpdatedAt: new Date().toISOString(),
        },
      });

      showSuccessToast(
        "Push Notifications",
        value ? "Enabled for this account" : "Disabled for this account",
      );
    } catch (error) {
      setPushEnabled(previousValue);
      showErrorToast(
        "Push Notification Failed",
        getErrorMessage(error, "Unable to update push notifications"),
      );
    } finally {
      setSavingPreference(null);
    }
  };

  const handleEmailToggle = async (value) => {
    const previousValue = emailEnabled;

    if (value && !profile?.email) {
      setEmailEnabled(false);
      showErrorToast("Email Missing", "Add an email before enabling alerts");
      return;
    }

    try {
      setSavingPreference("email");
      setEmailEnabled(value);

      await saveUserPreferences({
        notifications: {
          emailEnabled: value,
          emailAddress: profile?.email || "",
          emailUpdatedAt: new Date().toISOString(),
        },
      });

      showSuccessToast(
        "Email Notifications",
        value ? "Enabled for this account" : "Disabled for this account",
      );
    } catch (error) {
      setEmailEnabled(previousValue);
      showErrorToast(
        "Email Notification Failed",
        getErrorMessage(error, "Unable to update email notifications"),
      );
    } finally {
      setSavingPreference(null);
    }
  };

  const handleThemeToggle = async (value) => {
    const previousMode = themeMode;
    const mode = value ? "dark" : "light";

    try {
      setSavingPreference("theme");
      setThemeMode(mode);

      await saveUserPreferences({
        themeMode: mode,
        themeUpdatedAt: new Date().toISOString(),
      });

      showSuccessToast(
        "Theme Updated",
        value ? "Dark mode enabled" : "Light mode enabled",
      );
    } catch (error) {
      setThemeMode(previousMode);
      showErrorToast(
        "Theme Update Failed",
        getErrorMessage(error, "Unable to update theme"),
      );
    } finally {
      setSavingPreference(null);
    }
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

  const handleSaveProfile = async () => {
    if (!userId) {
      showErrorToast("Profile Missing", "Unable to update this profile");
      return;
    }

    const payload = {
      name: profileForm.name.trim(),
      campus: profileForm.campus.trim(),
      shift: profileForm.shift.trim(),
      designation: profileForm.designation.trim(),
      phoneNumber: profileForm.phoneNumber.trim(),
    };

    if (!payload.name) {
      showErrorToast("Name Required", "Please enter your full name");
      return;
    }

    try {
      setIsSavingProfile(true);
      await updateUserProfile(userId, payload);
      setProfile({
        ...profile,
        ...payload,
      });
      setProfileModalVisible(false);
      showSuccessToast("Profile Updated", "Your profile details were saved");
    } catch (error) {
      showErrorToast(
        "Update Failed",
        getErrorMessage(error, "Unable to update your profile"),
      );
    } finally {
      setIsSavingProfile(false);
    }
  };

  return (
    <ScreenWrapper>
      <AppHeader title="Settings" onBack={() => navigation.goBack()} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
          Account
        </Text>

        <ProfileMenuItem
          title="Edit Profile"
          subtitle="Update your name, campus, shift, and contact details"
          icon="person-circle-outline"
          onPress={() => setProfileModalVisible(true)}
        />

        <ProfileMenuItem
          title="Role"
          subtitle={
            isAdmin
              ? "Admin access includes approvals, users, and reports"
              : isMember
                ? "Member access includes requests, quotations, and instructions"
                : "Ask an admin to assign the correct access"
          }
          icon="shield-checkmark-outline"
          rightText={roleLabel}
        />

        <ProfileMenuItem
          title="Change Password"
          subtitle="Send a password reset link to your email"
          icon="lock-closed-outline"
          onPress={handleChangePassword}
        />

        <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
          Preferences
        </Text>

        <View
          style={[
            styles.switchCard,
            {
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <View style={styles.switchTextWrap}>
            <Text style={[styles.switchTitle, { color: theme.colors.text }]}>
              Push Notifications
            </Text>
            <Text
              style={[
                styles.switchSubtitle,
                { color: theme.colors.textSecondary },
              ]}
            >
              {notificationSubtitle}
            </Text>
          </View>
          <Switch
            value={pushEnabled}
            onValueChange={handlePushToggle}
            disabled={savingPreference === "push"}
            trackColor={switchTrackColor}
            thumbColor={switchThumbColor}
          />
        </View>

        <View
          style={[
            styles.switchCard,
            {
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <View style={styles.switchTextWrap}>
            <Text style={[styles.switchTitle, { color: theme.colors.text }]}>
              Email Notifications
            </Text>
            <Text
              style={[
                styles.switchSubtitle,
                { color: theme.colors.textSecondary },
              ]}
            >
              Get important account and procurement updates in your inbox
            </Text>
          </View>
          <Switch
            value={emailEnabled}
            onValueChange={handleEmailToggle}
            disabled={savingPreference === "email"}
            trackColor={switchTrackColor}
            thumbColor={switchThumbColor}
          />
        </View>

        <View
          style={[
            styles.switchCard,
            {
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <View style={styles.switchTextWrap}>
            <Text style={[styles.switchTitle, { color: theme.colors.text }]}>
              Dark Mode
            </Text>
            <Text
              style={[
                styles.switchSubtitle,
                { color: theme.colors.textSecondary },
              ]}
            >
              Use the dark theme on this device
            </Text>
          </View>
          <Switch
            value={themeMode === "dark" || isDark}
            onValueChange={handleThemeToggle}
            disabled={savingPreference === "theme"}
            trackColor={switchTrackColor}
            thumbColor={switchThumbColor}
          />
        </View>

        {isAdmin ? (
          <>
            <Text
              style={[
                styles.sectionTitle,
                { color: theme.colors.textSecondary },
              ]}
            >
              Admin Controls
            </Text>

            <ProfileMenuItem
              title="Manage Members"
              subtitle="Create, edit, promote, disable, or delete members"
              icon="people-outline"
              onPress={() => navigation.navigate(ROUTES.USER_MANAGEMENT)}
            />

            <ProfileMenuItem
              title="Pending Approvals"
              subtitle="Review procurement requests waiting for approval"
              icon="checkmark-done-outline"
              onPress={() => navigation.navigate(ROUTES.PENDING_APPROVALS)}
            />

            <ProfileMenuItem
              title="Reports"
              subtitle="Open procurement and campus performance reports"
              icon="bar-chart-outline"
              onPress={() => navigation.navigate(ROUTES.REPORTS)}
            />
          </>
        ) : isMember ? (
          <>
            <Text
              style={[
                styles.sectionTitle,
                { color: theme.colors.textSecondary },
              ]}
            >
              Member Shortcuts
            </Text>

            <ProfileMenuItem
              title="Create Request"
              subtitle="Start a new procurement request"
              icon="add-circle-outline"
              onPress={() => navigateToRequestScreen(ROUTES.CREATE_REQUEST)}
            />

            <ProfileMenuItem
              title="My Requests"
              subtitle="Track requests submitted from your account"
              icon="folder-open-outline"
              onPress={() => navigateToRequestScreen(ROUTES.MY_REQUESTS)}
            />
          </>
        ) : (
          <>
            <Text
              style={[
                styles.sectionTitle,
                { color: theme.colors.textSecondary },
              ]}
            >
              Access
            </Text>

            <ProfileMenuItem
              title="Role Review Needed"
              subtitle="Ask an admin to assign your member access"
              icon="alert-circle-outline"
              rightText="Limited"
            />
          </>
        )}

        <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
          About
        </Text>

        <ProfileMenuItem
          title="Notification Center"
          subtitle="View recent alerts and updates"
          icon="notifications-outline"
          onPress={() => navigation.navigate(ROUTES.NOTIFICATIONS)}
        />

        <ProfileMenuItem
          title="Terms & Privacy"
          subtitle="Ask your administrator for institutional policy details"
          icon="document-text-outline"
          onPress={() =>
            showInfoToast("Terms & Privacy", "Please contact your system admin")
          }
        />

        <ProfileMenuItem
          title="App Version"
          subtitle="Current installed version"
          icon="information-circle-outline"
          rightText="1.0.0"
        />
      </ScrollView>

      <ProfileFormModal
        visible={profileModalVisible}
        form={profileForm}
        roleLabel={roleLabel}
        isAdmin={isAdmin}
        isMember={isMember}
        loading={isSavingProfile}
        theme={theme}
        onChange={updateProfileForm}
        onClose={() => setProfileModalVisible(false)}
        onSave={handleSaveProfile}
      />
    </ScreenWrapper>
  );
}

function ProfileFormModal({
  visible,
  form,
  roleLabel,
  isAdmin,
  isMember,
  loading,
  theme,
  onChange,
  onClose,
  onSave,
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View
        style={[
          styles.modalOverlay,
          { backgroundColor: theme.colors.overlay },
        ]}
      >
        <View
          style={[
            styles.modalCard,
            { backgroundColor: theme.colors.card },
          ]}
        >
          <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
            Edit Profile
          </Text>
          <Text
            style={[
              styles.modalSubtitle,
              { color: theme.colors.textSecondary },
            ]}
          >
            {isAdmin
              ? "Keep your admin contact details current."
              : isMember
                ? "Keep your member details current for request routing."
                : "Keep your account details current."}
          </Text>

          <ScrollView showsVerticalScrollIndicator={false}>
            <AppInput
              label="Full Name"
              value={form.name}
              onChangeText={(value) => onChange("name", value)}
              placeholder="Enter your full name"
            />

            <View
              style={[
                styles.readOnlyField,
                {
                  backgroundColor: theme.colors.background,
                  borderColor: theme.colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.readOnlyLabel,
                  { color: theme.colors.textSecondary },
                ]}
              >
                Role
              </Text>
              <Text style={[styles.readOnlyValue, { color: theme.colors.text }]}>
                {roleLabel}
              </Text>
              <Text
                style={[
                  styles.readOnlyHint,
                  { color: theme.colors.textSecondary },
                ]}
              >
                {isAdmin
                  ? "Change member roles from User Management."
                  : "Ask an admin if your role is incorrect."}
              </Text>
            </View>

            <AppInput
              label="Campus"
              value={form.campus}
              onChangeText={(value) => onChange("campus", value)}
              placeholder="Enter campus"
            />

            <AppInput
              label="Shift"
              value={form.shift}
              onChangeText={(value) => onChange("shift", value)}
              placeholder="Enter shift"
            />

            <AppInput
              label="Designation"
              value={form.designation}
              onChangeText={(value) => onChange("designation", value)}
              placeholder="Enter designation"
            />

            <AppInput
              label="Phone Number"
              value={form.phoneNumber}
              onChangeText={(value) => onChange("phoneNumber", value)}
              placeholder="Enter phone number"
              keyboardType="phone-pad"
            />
          </ScrollView>

          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[
                styles.cancelButton,
                { borderColor: theme.colors.border },
              ]}
              onPress={onClose}
              activeOpacity={0.85}
              disabled={loading}
            >
              <Text
                style={[
                  styles.cancelText,
                  { color: theme.colors.textSecondary },
                ]}
              >
                Cancel
              </Text>
            </TouchableOpacity>

            <View style={styles.saveButtonWrap}>
              <AppButton
                title={loading ? "Saving..." : "Save Changes"}
                onPress={onSave}
                loading={loading}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 24,
  },
  sectionTitle: {
    marginTop: 6,
    marginBottom: 10,
    fontSize: 13,
    fontWeight: "800",
    color: "#475569",
    textTransform: "uppercase",
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.45)",
    justifyContent: "center",
    padding: 16,
  },
  modalCard: {
    maxHeight: "90%",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 18,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0F172A",
  },
  modalSubtitle: {
    marginTop: 6,
    marginBottom: 16,
    fontSize: 13,
    lineHeight: 20,
    color: "#64748B",
  },
  readOnlyField: {
    marginBottom: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#F8FAFC",
    padding: 12,
  },
  readOnlyLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: "#475569",
  },
  readOnlyValue: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: "800",
    color: "#0F172A",
  },
  readOnlyHint: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 17,
    color: "#64748B",
  },
  modalActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 14,
  },
  cancelButton: {
    minHeight: 48,
    borderRadius: 8,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  cancelText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#64748B",
  },
  saveButtonWrap: {
    flex: 1,
  },
});
