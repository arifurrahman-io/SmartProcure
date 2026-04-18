import { Platform, View, Text, StyleSheet } from "react-native";

export default function RequestTimeline({ items = [] }) {
  return (
    <View style={styles.card}>
      <Text style={styles.heading}>Timeline</Text>

      {items.length === 0 ? (
        <Text style={styles.emptyText}>No timeline activity yet.</Text>
      ) : (
        items.map((item, index) => (
          <View key={index} style={styles.row}>
            <View style={styles.leftCol}>
              <View style={styles.dot} />
              {index !== items.length - 1 ? <View style={styles.line} /> : null}
            </View>

            <View style={styles.content}>
              <Text style={styles.title}>{item.title}</Text>
              {item.description ? (
                <Text style={styles.description}>{item.description}</Text>
              ) : null}
              {item.time ? <Text style={styles.time}>{item.time}</Text> : null}
            </View>
          </View>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 14,
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
  heading: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 14,
  },
  emptyText: {
    fontSize: 13,
    color: "#64748B",
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  leftCol: {
    width: 24,
    alignItems: "center",
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#4F46E5",
    marginTop: 4,
  },
  line: {
    width: 2,
    flex: 1,
    backgroundColor: "#E2E8F0",
    marginTop: 4,
    minHeight: 42,
  },
  content: {
    flex: 1,
    paddingLeft: 8,
    paddingBottom: 18,
  },
  title: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },
  description: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 18,
    color: "#64748B",
  },
  time: {
    marginTop: 6,
    fontSize: 11,
    color: "#94A3B8",
  },
});
