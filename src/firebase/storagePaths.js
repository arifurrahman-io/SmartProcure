const STORAGE_PATHS = {
  REQUEST_ATTACHMENTS: "requestAttachments",
  QUOTATION_ATTACHMENTS: "quotationAttachments",
  USER_PROFILE_IMAGES: "userProfileImages",
};

export const getRequestAttachmentPath = (requestId, fileName) =>
  `${STORAGE_PATHS.REQUEST_ATTACHMENTS}/${requestId}/${fileName}`;

export const getQuotationAttachmentPath = (quotationId, fileName) =>
  `${STORAGE_PATHS.QUOTATION_ATTACHMENTS}/${quotationId}/${fileName}`;

export const getUserProfileImagePath = (userId, fileName) =>
  `${STORAGE_PATHS.USER_PROFILE_IMAGES}/${userId}/${fileName}`;

export default STORAGE_PATHS;
