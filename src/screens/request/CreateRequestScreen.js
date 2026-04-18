import { useMemo, useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

import ScreenWrapper from "../../components/common/ScreenWrapper";
import AppHeader from "../../components/common/AppHeader";
import AppInput from "../../components/common/AppInput";
import AppButton from "../../components/common/AppButton";

import useRequests from "../../hooks/useRequests";
import { validateRequestForm } from "../../utils/validators";
import {
  createFormChangeHandler,
  getTrimmedFormValues,
} from "../../utils/formHelpers";
import { getErrorMessage } from "../../utils/errorHandler";
import { showErrorToast, showSuccessToast } from "../../utils/toast";

const URGENCY_OPTIONS = ["Low", "Medium", "High"];

const INITIAL_FORM = {
  title: "",
  itemName: "",
  category: "",
  campus: "",
  shift: "",
  quantity: "",
  budget: "",
  reason: "",
  neededBy: "",
  urgency: "Medium",
};

const formatDateForInput = (date) => {
  if (!date) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const parseInputDate = (value) => {
  if (!value) return new Date();

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return new Date();
  }

  return parsed;
};

export default function CreateRequestScreen({ navigation }) {
  const [values, setValues] = useState(INITIAL_FORM);
  const [saving, setSaving] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const { submitRequest } = useRequests(false);

  const handleChange = createFormChangeHandler(setValues);

  const selectedDate = useMemo(() => {
    return parseInputDate(values.neededBy);
  }, [values.neededBy]);

  const handleDateChange = (_, date) => {
    if (Platform.OS !== "ios") {
      setShowDatePicker(false);
    }

    if (date) {
      handleChange("neededBy", formatDateForInput(date));
    }
  };

  const openDatePicker = () => {
    setShowDatePicker(true);
  };

  const handleSubmit = async () => {
    const trimmedValues = getTrimmedFormValues(values);
    const validationErrors = validateRequestForm(trimmedValues);

    if (Object.keys(validationErrors).length > 0) {
      showErrorToast("Validation Error", Object.values(validationErrors)[0]);
      return;
    }

    try {
      setSaving(true);

      const payload = {
        ...trimmedValues,
        quantity: Number(trimmedValues.quantity),
        budget: Number(trimmedValues.budget),
        estimatedBudget: Number(trimmedValues.budget),
        urgency: trimmedValues.urgency || "Medium",
        status: "pending",
      };

      const result = await submitRequest(payload);

      if (!result?.success) {
        throw new Error(result?.error || "Failed to create request");
      }

      showSuccessToast(
        "Request Submitted",
        "Your purchase request has been created successfully",
      );

      navigation.goBack();
    } catch (error) {
      showErrorToast(
        "Submit Failed",
        getErrorMessage(error, "Failed to create request"),
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScreenWrapper>
      <AppHeader title="Create Request" onBack={() => navigation.goBack()} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <AppInput
          label="Title"
          value={values.title}
          onChangeText={(value) => handleChange("title", value)}
          placeholder="Enter request title"
        />

        <AppInput
          label="Item Name"
          value={values.itemName}
          onChangeText={(value) => handleChange("itemName", value)}
          placeholder="Enter item name"
        />

        <AppInput
          label="Category"
          value={values.category}
          onChangeText={(value) => handleChange("category", value)}
          placeholder="Enter category"
        />

        <AppInput
          label="Campus"
          value={values.campus}
          onChangeText={(value) => handleChange("campus", value)}
          placeholder="Enter campus"
        />

        <AppInput
          label="Shift"
          value={values.shift}
          onChangeText={(value) => handleChange("shift", value)}
          placeholder="Enter shift"
        />

        <AppInput
          label="Quantity"
          value={values.quantity}
          onChangeText={(value) => handleChange("quantity", value)}
          placeholder="Enter quantity"
          keyboardType="numeric"
        />

        <AppInput
          label="Budget"
          value={values.budget}
          onChangeText={(value) => handleChange("budget", value)}
          placeholder="Enter estimated budget"
          keyboardType="numeric"
        />

        <View style={styles.fieldBlock}>
          <Text style={styles.label}>Urgency</Text>
          <View style={styles.urgencyRow}>
            {URGENCY_OPTIONS.map((level) => {
              const isActive = values.urgency === level;

              return (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.urgencyChip,
                    isActive && styles.urgencyChipActive,
                  ]}
                  onPress={() => handleChange("urgency", level)}
                  activeOpacity={0.85}
                >
                  <Text
                    style={[
                      styles.urgencyChipText,
                      isActive && styles.urgencyChipTextActive,
                    ]}
                  >
                    {level}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {Platform.OS === "web" ? (
          <AppInput
            label="Needed By"
            value={values.neededBy}
            onChangeText={(value) => handleChange("neededBy", value)}
            placeholder="YYYY-MM-DD"
          />
        ) : (
          <View style={styles.fieldBlock}>
            <Text style={styles.label}>Needed By</Text>

            <TouchableOpacity
              style={styles.dateInput}
              onPress={openDatePicker}
              activeOpacity={0.85}
            >
              <Text
                style={[
                  styles.dateInputText,
                  !values.neededBy && styles.placeholderText,
                ]}
              >
                {values.neededBy || "Select a date"}
              </Text>
            </TouchableOpacity>

            {showDatePicker ? (
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={handleDateChange}
                minimumDate={new Date()}
              />
            ) : null}

            {showDatePicker && Platform.OS === "ios" ? (
              <View style={styles.iosDateActions}>
                <AppButton
                  title="Done"
                  onPress={() => setShowDatePicker(false)}
                  style={styles.dateDoneButton}
                />
              </View>
            ) : null}
          </View>
        )}

        <AppInput
          label="Reason"
          value={values.reason}
          onChangeText={(value) => handleChange("reason", value)}
          placeholder="Enter reason"
          multiline
        />

        <AppButton
          title="Submit Request"
          onPress={handleSubmit}
          loading={saving}
          style={styles.submitButton}
        />
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 24,
  },
  fieldBlock: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontSize: 14,
    color: "#0F172A",
    fontWeight: "700",
  },
  urgencyRow: {
    flexDirection: "row",
    gap: 8,
  },
  urgencyChip: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  urgencyChipActive: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
  },
  urgencyChipText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },
  urgencyChipTextActive: {
    color: "#FFFFFF",
  },
  dateInput: {
    minHeight: 52,
    borderWidth: 1.2,
    borderColor: "#DCE7F3",
    borderRadius: 8,
    paddingHorizontal: 14,
    alignItems: "flex-start",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  dateInputText: {
    fontSize: 15,
    color: "#0F172A",
  },
  placeholderText: {
    color: "#94A3B8",
  },
  iosDateActions: {
    marginTop: 10,
  },
  dateDoneButton: {
    marginBottom: 0,
  },
  submitButton: {
    marginTop: 8,
    marginBottom: 20,
  },
});
