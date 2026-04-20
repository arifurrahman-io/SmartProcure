const toDateValue = (value) => {
  if (!value) return null;

  try {
    if (typeof value.toDate === "function") {
      return value.toDate();
    }

    if (typeof value.seconds === "number") {
      return new Date(value.seconds * 1000);
    }

    return new Date(value);
  } catch {
    return null;
  }
};

export const formatDate = (value, locale = "en-GB") => {
  if (!value) return "-";

  try {
    const date = toDateValue(value);

    if (!date || Number.isNaN(date.getTime())) return "-";

    return new Intl.DateTimeFormat(locale, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  } catch {
    return "-";
  }
};

export const formatDateTime = (value, locale = "en-GB") => {
  if (!value) return "-";

  try {
    const date = toDateValue(value);

    if (!date || Number.isNaN(date.getTime())) return "-";

    return new Intl.DateTimeFormat(locale, {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(date);
  } catch {
    return "-";
  }
};

export const formatTimeOnly = (value, locale = "en-GB") => {
  if (!value) return "-";

  try {
    const date = toDateValue(value);

    if (!date || Number.isNaN(date.getTime())) return "-";

    return new Intl.DateTimeFormat(locale, {
      hour: "numeric",
      minute: "2-digit",
    }).format(date);
  } catch {
    return "-";
  }
};

export default formatDate;
