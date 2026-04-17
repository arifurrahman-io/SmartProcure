import { useEffect, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet } from "react-native";

import ScreenWrapper from "../../components/common/ScreenWrapper";
import AppHeader from "../../components/common/AppHeader";
import RequestForm from "../../components/request/RequestForm";
import AppButton from "../../components/common/AppButton";
import AppLoader from "../../components/common/AppLoader";
import EmptyState from "../../components/common/EmptyState";

import useRequestDetails from "../../hooks/useRequestDetails";
import { validateRequestForm } from "../../utils/validators";
import {
  getFirebaseFriendlyError,
  getErrorMessage,
} from "../../utils/errorHandler";
import { showErrorToast, showSuccessToast } from "../../utils/toast";
import {
  createFormChangeHandler,
  getTrimmedFormValues,
} from "../../utils/formHelpers";

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

export default function EditRequestScreen({ navigation, route }) {
  const requestId = route?.params?.requestId;

  const { request, isLoading, error, editRequest, fetchRequestDetails } =
    useRequestDetails(requestId);

  const [values, setValues] = useState(INITIAL_FORM);
  const [saving, setSaving] = useState(false);

  const handleChange = createFormChangeHandler(setValues);

  useEffect(() => {
    if (request) {
      setValues({
        title: request.title || "",
        itemName: request.itemName || "",
        category: request.category || "",
        campus: request.campus || "",
        shift: request.shift || "",
        quantity: request.quantity ? String(request.quantity) : "",
        budget: request.budget ? String(request.budget) : "",
        reason: request.reason || "",
        neededBy: request.neededBy || "",
      });
    }
  }, [request]);

  const handleUpdate = async () => {
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
      };

      await editRequest(payload);

      showSuccessToast(
        "Request Updated",
        "Your request has been updated successfully",
      );
      navigation.goBack();
    } catch (err) {
      const friendlyMessage =
        getFirebaseFriendlyError(err) ||
        getErrorMessage(err, "Failed to update request");

      showErrorToast("Update Failed", friendlyMessage);
    } finally {
      setSaving(false);
    }
  };

  if (isLoading && !request) {
    return (
      <ScreenWrapper>
        <AppHeader title="Edit Request" onBack={() => navigation.goBack()} />
        <AppLoader />
      </ScreenWrapper>
    );
  }

  if (error && !request) {
    return (
      <ScreenWrapper>
        <AppHeader title="Edit Request" onBack={() => navigation.goBack()} />
        <EmptyState text={error || "Request not found"} />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <AppHeader title="Edit Request" onBack={() => navigation.goBack()} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={fetchRequestDetails}
          />
        }
      >
        <RequestForm values={values} onChange={handleChange} />

        <AppButton
          title="Update Request"
          onPress={handleUpdate}
          loading={saving}
          style={styles.button}
        />
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: 8,
    marginBottom: 20,
  },
});
