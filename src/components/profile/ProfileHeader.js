import { View, Text, StyleSheet } from "react-native";
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
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EEF2F7",
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 999,
    backgroundColor: "#4F46E5",
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
    borderRadius: 999,
  },
  tagText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#4338CA",
  },
});
