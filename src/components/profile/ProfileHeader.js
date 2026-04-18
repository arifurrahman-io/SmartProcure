import { Platform, View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileHeader({ name, email, role, campus }) {
  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Ionicons name="person" size={28} color="#fff" />
      </View>

      <View style={styles.info}>
        <Text style={styles.name}>{name || "User Name"}</Text>
        <Text style={styles.email}>{email || "user@email.com"}</Text>

        <View style={styles.metaRow}>
          {role ? <Tag text={role} /> : null}
          {campus ? <Tag text={campus} /> : null}
        </View>
      </View>
    </View>
  );
}

function Tag({ text }) {
  return (
    <View style={styles.tag}>
      <Text style={styles.tagText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    ...Platform.select({
      web: {
        boxShadow: "0 8px 24px rgba(15, 23, 42, 0.05)",
      },
      default: {
        shadowColor: "#000",
        shadowOpacity: 0.04,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
        elevation: 2,
      },
    }),
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
  },
  email: {
    marginTop: 4,
    fontSize: 13,
    color: "#64748B",
  },
  metaRow: {
    flexDirection: "row",
    marginTop: 10,
    gap: 8,
    flexWrap: "wrap",
  },
  tag: {
    backgroundColor: "#EEF4FF",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#4338CA",
  },
});
