import { ScrollView, StyleSheet } from "react-native";

import ScreenWrapper from "../../components/common/ScreenWrapper";
import AppHeader from "../../components/common/AppHeader";
import ProfileHeader from "../../components/profile/ProfileHeader";
import ProfileMenuItem from "../../components/profile/ProfileMenuItem";
import LogoutButton from "../../components/profile/LogoutButton";
import EmptyState from "../../components/common/EmptyState";
import AppLoader from "../../components/common/AppLoader";

import ROUTES from "../../navigation/routes";
import useAuth from "../../hooks/useAuth";
import { getRoleLabel } from "../../utils/roleHelpers";
import { showErrorToast, showSuccessToast } from "../../utils/toast";

export default function ProfileScreen({ navigation }) {
  const { profile, isLoading, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      showSuccessToast("Logged out", "You have been signed out successfully");
      // AppNavigator auth-state অনুযায়ী redirect করবে
    } catch (error) {
      showErrorToast("Logout Failed", error?.message || "Please try again");
    }
  };

  if (isLoading) {
    return (
      <ScreenWrapper>
        <AppHeader title="Profile" onBack={() => navigation.goBack()} />
        <AppLoader />
      </ScreenWrapper>
    );
  }

  if (!profile) {
    return (
      <ScreenWrapper>
        <AppHeader title="Profile" onBack={() => navigation.goBack()} />
        <EmptyState text="User profile not found" />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <AppHeader title="Profile" onBack={() => navigation.goBack()} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <ProfileHeader
          name={profile?.name || profile?.displayName || "User"}
          email={profile?.email || "-"}
          role={getRoleLabel(profile?.role)}
          campus={profile?.campus || "-"}
        />

        <ProfileMenuItem
          title="Settings"
          subtitle="Theme, preferences and app behavior"
          icon="settings-outline"
          onPress={() => navigation.navigate(ROUTES.SETTINGS)}
        />

        <ProfileMenuItem
          title="Notifications"
          subtitle="View all recent alerts and updates"
          icon="notifications-outline"
          onPress={() => navigation.navigate(ROUTES.NOTIFICATIONS)}
        />

        <ProfileMenuItem
          title="My Requests"
          subtitle="See requests you have submitted"
          icon="folder-open-outline"
          onPress={() => navigation.navigate(ROUTES.MY_REQUESTS)}
        />

        <ProfileMenuItem
          title="Purchase History"
          subtitle="Completed and archived procurements"
          icon="time-outline"
          onPress={() => navigation.navigate(ROUTES.HISTORY_LIST)}
        />

        <ProfileMenuItem
          title="Help & Support"
          subtitle="Contact support or get assistance"
          icon="help-circle-outline"
          onPress={() => console.log("support")}
        />

        <ProfileMenuItem
          title="Delete Account"
          subtitle="This action may require admin confirmation"
          icon="trash-outline"
          danger
          onPress={() => console.log("delete account")}
        />

        <LogoutButton onPress={handleLogout} />
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 24,
  },
});
