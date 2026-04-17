import { ScrollView, StyleSheet, View, Text, Switch } from "react-native";
import { useState } from "react";
import ScreenWrapper from "../../components/common/ScreenWrapper";
import AppHeader from "../../components/common/AppHeader";
import ProfileMenuItem from "../../components/profile/ProfileMenuItem";

export default function SettingsScreen({ navigation }) {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <ScreenWrapper>
      <AppHeader title="Settings" onBack={() => navigation.goBack()} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.switchCard}>
          <View style={styles.switchTextWrap}>
            <Text style={styles.switchTitle}>Push Notifications</Text>
            <Text style={styles.switchSubtitle}>
              Receive instant alerts for requests, quotations and approvals
            </Text>
          </View>
          <Switch value={pushEnabled} onValueChange={setPushEnabled} />
        </View>

        <View style={styles.switchCard}>
          <View style={styles.switchTextWrap}>
            <Text style={styles.switchTitle}>Email Notifications</Text>
            <Text style={styles.switchSubtitle}>
              Get important updates in your email inbox
            </Text>
          </View>
          <Switch value={emailEnabled} onValueChange={setEmailEnabled} />
        </View>

        <View style={styles.switchCard}>
          <View style={styles.switchTextWrap}>
            <Text style={styles.switchTitle}>Dark Mode</Text>
            <Text style={styles.switchSubtitle}>
              Enable dark theme for the app interface
            </Text>
          </View>
          <Switch value={darkMode} onValueChange={setDarkMode} />
        </View>

        <ProfileMenuItem
          title="Change Password"
          subtitle="Update your account password"
          icon="lock-closed-outline"
          onPress={() => console.log("change password")}
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
          onPress={() => console.log("terms")}
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
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#EEF2F7",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
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
