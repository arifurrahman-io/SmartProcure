import { ScrollView, StyleSheet } from "react-native";
import ScreenWrapper from "../../components/common/ScreenWrapper";
import AppHeader from "../../components/common/AppHeader";
import ProfileHeader from "../../components/profile/ProfileHeader";
import ProfileMenuItem from "../../components/profile/ProfileMenuItem";
import LogoutButton from "../../components/profile/LogoutButton";

export default function ProfileScreen({ navigation }) {
  const user = {
    name: "Arifur Rahman",
    email: "arifur@email.com",
    role: "Admin",
    campus: "Banasree",
  };

  const handleLogout = () => {
    console.log("logout");
    navigation.replace("Login");
  };

  return (
    <ScreenWrapper>
      <AppHeader title="Profile" onBack={() => navigation.goBack()} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <ProfileHeader
          name={user.name}
          email={user.email}
          role={user.role}
          campus={user.campus}
        />

        <ProfileMenuItem
          title="Settings"
          subtitle="Theme, preferences and app behavior"
          icon="settings-outline"
          onPress={() => navigation.navigate("Settings")}
        />

        <ProfileMenuItem
          title="Notifications"
          subtitle="View all recent alerts and updates"
          icon="notifications-outline"
          onPress={() => navigation.navigate("Notifications")}
        />

        <ProfileMenuItem
          title="My Requests"
          subtitle="See requests you have submitted"
          icon="folder-open-outline"
          onPress={() => navigation.navigate("MyRequests")}
        />

        <ProfileMenuItem
          title="Purchase History"
          subtitle="Completed and archived procurements"
          icon="time-outline"
          onPress={() => navigation.navigate("HistoryList")}
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
