import { Platform, View, Text, StyleSheet } from "react-native";

export default function InstructionStatusTracker({
  currentStatus = "Approved",
}) {
  const steps = ["Approved", "Purchase In Progress", "Delivered", "Completed"];

  const currentIndex = steps.findIndex(
    (step) => step.toLowerCase() === String(currentStatus).toLowerCase(),
  );

  return (
    <View style={styles.card}>
      <Text style={styles.heading}>Instruction Progress</Text>

      {steps.map((step, index) => {
        const isDone = index <= currentIndex;
        const isLast = index === steps.length - 1;

        return (
          <View key={step} style={styles.row}>
            <View style={styles.leftCol}>
              <View style={[styles.dot, isDone && styles.activeDot]} />
              {!isLast ? (
                <View style={[styles.line, isDone && styles.activeLine]} />
              ) : null}
            </View>

            <View style={styles.content}>
              <Text style={[styles.title, isDone && styles.activeTitle]}>
                {step}
              </Text>
              <Text style={styles.subtitle}>
                {isDone ? "Completed step" : "Pending step"}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
    marginBottom: 14,
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
  heading: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 14,
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
    backgroundColor: "#CBD5E1",
    marginTop: 4,
  },
  activeDot: {
    backgroundColor: "#4F46E5",
  },
  line: {
    width: 2,
    minHeight: 40,
    backgroundColor: "#E2E8F0",
    marginTop: 4,
  },
  activeLine: {
    backgroundColor: "#4F46E5",
  },
  content: {
    flex: 1,
    paddingLeft: 8,
    paddingBottom: 18,
  },
  title: {
    fontSize: 14,
    fontWeight: "700",
    color: "#94A3B8",
  },
  activeTitle: {
    color: "#0F172A",
  },
  subtitle: {
    marginTop: 4,
    fontSize: 12,
    color: "#64748B",
  },
});
