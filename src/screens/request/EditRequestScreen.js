import { useEffect, useMemo, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";

import ScreenWrapper from "../../components/common/ScreenWrapper";
import AppHeader from "../../components/common/AppHeader";
import AppInput from "../../components/common/AppInput";
import AppButton from "../../components/common/AppButton";
import AppLoader from "../../components/common/AppLoader";
import EmptyState from "../../components/common/EmptyState";

import useRequestDetails from "../../hooks/useRequestDetails";
import useAuthStore from "../../store/useAuthStore";
import ROUTES from "../../navigation/routes";

const URGENCY_OPTIONS = ["Low", "Medium", "High"];

const buildInitialForm = () => ({
  itemName: "",
  category: "",
  quantity: "",
  estimatedBudget: "",
  urgency: "Medium",
  campus: "",
  shift: "",
  neededBy: "",
  reason: "",
});

export default function EditRequestScreen({ navigation, route }) {
  const requestId = route?.params?.requestId;
  const profile = useAuthStore((state) => state.profile);

  const { request, loading, updating, error, refreshRequest, updateRequest } =
    useRequestDetails(requestId);

  const [form, setForm] = useState(buildInitialForm());

  const currentUserId = profile?.id || profile?.uid || null;

  const requestAuthorId = request?.authorId || null;

  const isCreator =
    requestAuthorId && currentUserId
      ? String(requestAuthorId) === String(currentUserId)
      : false;

  const isEditableStatus = useMemo(() => {
    return ["pending", "draft"].includes(
      String(request?.status || "").toLowerCase(),
    );
  }, [request?.status]);

  const canEdit = Boolean(isCreator && isEditableStatus);

  useEffect(() => {
    if (!request) return;

    setForm({
      itemName: request.itemName || request.title || "",
      category: request.category || "",
      quantity:
        request.quantity !== undefined && request.quantity !== null
          ? String(request.quantity)
          : "",
      estimatedBudget:
        request.estimatedBudget !== undefined &&
        request.estimatedBudget !== null
          ? String(request.estimatedBudget)
          : request.budget !== undefined && request.budget !== null
            ? String(request.budget)
            : "",
      urgency: request.urgency || "Medium",
      campus: request.campus || "",
      shift: request.shift || "",
      neededBy: request.neededBy || "",
      reason: request.reason || "",
    });
  }, [request]);

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    if (!form.itemName.trim()) {
      Alert.alert("Missing field", "Please enter item name.");
      return false;
    }

    if (!form.category.trim()) {
      Alert.alert("Missing field", "Please enter category.");
      return false;
    }

    if (!form.quantity.trim()) {
      Alert.alert("Missing field", "Please enter quantity.");
      return false;
    }

    if (!form.reason.trim()) {
      Alert.alert("Missing field", "Please enter reason.");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!requestId) {
      Alert.alert("Error", "Request ID is missing.");
      return;
    }

    if (!canEdit) {
      Alert.alert(
        "Permission denied",
        "You are not allowed to edit this request.",
      );
      return;
    }

    if (!validateForm()) return;

    const payload = {
      itemName: form.itemName.trim(),
      category: form.category.trim(),
      quantity: Number(form.quantity) || form.quantity,
      estimatedBudget: Number(form.estimatedBudget) || 0,
      urgency: form.urgency || "Medium",
      campus: form.campus.trim(),
      shift: form.shift.trim(),
      neededBy: form.neededBy,
      reason: form.reason.trim(),
    };

    const result = await updateRequest(payload);

    if (!result?.success) {
      Alert.alert(
        "Update failed",
        result?.error || "Failed to update request.",
      );
      return;
    }

    Alert.alert("Success", "Request updated successfully.", [
      {
        text: "OK",
        onPress: () =>
          navigation.replace(ROUTES.REQUEST_DETAILS, {
            requestId,
          }),
      },
    ]);
  };

  if (loading) {
    return (
      <ScreenWrapper>
        <AppHeader title="Edit Request" onBack={() => navigation.goBack()} />
        <AppLoader />
      </ScreenWrapper>
    );
  }

  if (error || !request) {
    return (
      <ScreenWrapper>
        <AppHeader title="Edit Request" onBack={() => navigation.goBack()} />
        <EmptyState text={error || "Request not found."} />
      </ScreenWrapper>
    );
  }

  if (!canEdit) {
    return (
      <ScreenWrapper>
        <AppHeader title="Edit Request" onBack={() => navigation.goBack()} />
        <EmptyState text="You are not allowed to edit this request." />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <AppHeader title="Edit Request" onBack={() => navigation.goBack()} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <AppInput
          label="Item Name"
          value={form.itemName}
          onChangeText={(value) => handleChange("itemName", value)}
          placeholder="Enter item name"
        />

        <AppInput
          label="Category"
          value={form.category}
          onChangeText={(value) => handleChange("category", value)}
          placeholder="Enter category"
        />

        <AppInput
          label="Quantity"
          value={form.quantity}
          onChangeText={(value) => handleChange("quantity", value)}
          placeholder="Enter quantity"
          keyboardType="numeric"
        />

        <AppInput
          label="Estimated Budget"
          value={form.estimatedBudget}
          onChangeText={(value) => handleChange("estimatedBudget", value)}
          placeholder="Enter estimated budget"
          keyboardType="numeric"
        />

        <View style={styles.fieldBlock}>
          <Text style={styles.label}>Urgency</Text>
          <View style={styles.urgencyRow}>
            {URGENCY_OPTIONS.map((level) => {
              const isActive = form.urgency === level;

              return (
                <View key={level} style={styles.urgencyButtonWrap}>
                  <AppButton
                    title={level}
                    onPress={() => handleChange("urgency", level)}
                    style={[
                      styles.urgencyButton,
                      isActive && styles.urgencyButtonActive,
                    ]}
                    textStyle={[
                      styles.urgencyButtonText,
                      isActive && styles.urgencyButtonTextActive,
                    ]}
                  />
                </View>
              );
            })}
          </View>
        </View>

        <AppInput
          label="Campus"
          value={form.campus}
          onChangeText={(value) => handleChange("campus", value)}
          placeholder="Enter campus"
        />

        <AppInput
          label="Shift"
          value={form.shift}
          onChangeText={(value) => handleChange("shift", value)}
          placeholder="Enter shift"
        />

        <AppInput
          label="Needed By"
          value={form.neededBy}
          onChangeText={(value) => handleChange("neededBy", value)}
          placeholder="YYYY-MM-DD"
        />

        <AppInput
          label="Reason"
          value={form.reason}
          onChangeText={(value) => handleChange("reason", value)}
          placeholder="Enter reason"
          multiline
        />

        <View style={styles.actions}>
          <AppButton
            title={updating ? "Updating..." : "Update Request"}
            onPress={handleSubmit}
            loading={updating}
          />

          <AppButton
            title="Reload"
            onPress={refreshRequest}
            style={styles.secondaryButton}
          />
        </View>
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
  urgencyButtonWrap: {
    flex: 1,
  },
  urgencyButton: {
    backgroundColor: "#739ffd",
    marginBottom: 0,
  },
  urgencyButtonActive: {
    backgroundColor: "#157094",
  },
  urgencyButtonText: {
    color: "#0F172A",
    fontWeight: "600",
  },
  urgencyButtonTextActive: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  actions: {
    gap: 12,
    marginTop: 8,
  },
  secondaryButton: {
    marginBottom: 0,
  },
});
