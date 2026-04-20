export const countRequestQuotations = (quotations = [], requestId) => {
  return quotations.filter((item) => item.requestId === requestId).length;
};

export const getRequestAuthor = (request = {}, fallbackName = "Unknown") => {
  const source = request || {};

  return {
    id: source.authorId || null,
    name: source.authorName || fallbackName,
    email: source.authorEmail || "",
  };
};

export const filterRequests = (requests = [], filters = {}) => {
  const {
    search = "",
    campus = "All",
    shift = "All",
    status = "All",
  } = filters;

  const query = String(search).trim().toLowerCase();

  return requests.filter((item) => {
    const matchesSearch =
      !query ||
      String(item.itemName || "")
        .toLowerCase()
        .includes(query) ||
      String(item.category || "")
        .toLowerCase()
        .includes(query) ||
      String(item.campus || "")
        .toLowerCase()
        .includes(query);

    const matchesCampus = campus === "All" || item.campus === campus;
    const matchesShift = shift === "All" || item.shift === shift;
    const matchesStatus = status === "All" || item.status === status;

    return matchesSearch && matchesCampus && matchesShift && matchesStatus;
  });
};

export const sortRequestsByDateDesc = (requests = []) => {
  return [...requests].sort(
    (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
  );
};

export default {
  countRequestQuotations,
  getRequestAuthor,
  filterRequests,
  sortRequestsByDateDesc,
};
