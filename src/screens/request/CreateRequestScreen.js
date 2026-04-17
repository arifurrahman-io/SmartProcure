import { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";

import ScreenWrapper from "../../components/common/ScreenWrapper";
import AppHeader from "../../components/common/AppHeader";
import RequestForm from "../../components/request/RequestForm";
import AppButton from "../../components/common/AppButton";

import useRequests from "../../hooks/useRequests";
import { validateRequestForm } from "../../utils/validators";
import {
  createFormChangeHandler,
  getTrimmedFormValues,
} from "../../utils/formHelpers";
import { getErrorMessage } from "../../utils/errorHandler";
import { showErrorToast, showSuccessToast } from "../../utils/toast";

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
};

export default function CreateRequestScreen({ navigation }) {
  const [values, setValues] = useState(INITIAL_FORM);
  const [saving, setSaving] = useState(false);

  const { submitRequest } = useRequests(false);

  const handleChange = createFormChangeHandler(setValues);

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
        status: "Pending",
      };

      await submitRequest(payload);

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

      <ScrollView showsVerticalScrollIndicator={false}>
        <RequestForm values={values} onChange={handleChange} />

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
  submitButton: {
    marginTop: 8,
    marginBottom: 20,
  },
});
