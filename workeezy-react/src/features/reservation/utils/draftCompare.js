export const isSameDraft = (a, b) => {
  if (!a || !b) return false;

  const keys = [
    "programId",
    "stayId",
    "roomId",
    "officeId",
    "startDate",
    "endDate",
    "peopleCount",
  ];

  return keys.every((key) => a[key] === b[key]);
};
