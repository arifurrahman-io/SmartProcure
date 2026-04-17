import { View, TextInput, StyleSheet, Text } from "react-native";
import { Colors } from "../../constants/colors";

export default function AppInput({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  multiline = false,
  keyboardType = "default",
  autoCapitalize = "sentences",
  autoCorrect = true,
}) {
  return (
    <View style={styles.wrapper}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        multiline={multiline}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoCorrect={autoCorrect}
        style={[styles.input, multiline && styles.multiline]}
        placeholderTextColor="#94A3B8"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 6,
    fontWeight: "600",
    color: Colors.text,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  multiline: {
    minHeight: 100,
    textAlignVertical: "top",
  },
});
