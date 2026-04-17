import { Modal, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import AppButton from "../common/AppButton";
import AppInput from "../common/AppInput";

export default function CompletionNoteModal({
  visible,
  onClose,
  onSubmit,
  loading = false,
  defaultValue = "",
}) {
  const [note, setNote] = useState(defaultValue);

  useEffect(() => {
    if (visible) {
      setNote(defaultValue || "");
    }
  }, [visible, defaultValue]);

  const handleSubmit = () => {
    onSubmit?.(note.trim());
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Complete Purchase</Text>

          <Text style={styles.message}>
            Add a short completion note for delivery, verification, or receiving
            status.
          </Text>

          <View style={styles.inputWrap}>
            <AppInput
              label="Completion Note"
              placeholder="Write delivery or completion note"
              value={note}
              onChangeText={setNote}
              multiline
            />
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <View style={styles.confirmWrap}>
              <AppButton
                title="Mark as Completed"
                onPress={handleSubmit}
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
  overlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.45)",
    justifyContent: "center",
    padding: 20,
  },
  modal: {
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 18,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
  },
  message: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 21,
    color: "#64748B",
  },
  inputWrap: {
    marginTop: 16,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  cancelBtn: {
    paddingVertical: 12,
    paddingRight: 14,
  },
  cancelText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#64748B",
  },
  confirmWrap: {
    flex: 1,
  },
});
