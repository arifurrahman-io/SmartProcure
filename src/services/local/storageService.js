import AsyncStorage from "@react-native-async-storage/async-storage";

export const setItem = async (key, value) => {
  const parsedValue = typeof value === "string" ? value : JSON.stringify(value);
  await AsyncStorage.setItem(key, parsedValue);
  return true;
};

export const getItem = async (key, parseJson = true) => {
  const value = await AsyncStorage.getItem(key);

  if (value == null) return null;
  if (!parseJson) return value;

  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};

export const removeItem = async (key) => {
  await AsyncStorage.removeItem(key);
  return true;
};

export const clearStorage = async () => {
  await AsyncStorage.clear();
  return true;
};
