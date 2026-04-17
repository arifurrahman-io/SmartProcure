import Toast from "react-native-toast-message";

export const showSuccessToast = (text1, text2 = "") => {
  Toast.show({
    type: "success",
    text1,
    text2,
  });
};

export const showErrorToast = (text1, text2 = "") => {
  Toast.show({
    type: "error",
    text1,
    text2,
  });
};

export const showInfoToast = (text1, text2 = "") => {
  Toast.show({
    type: "info",
    text1,
    text2,
  });
};

export default {
  showSuccessToast,
  showErrorToast,
  showInfoToast,
};
