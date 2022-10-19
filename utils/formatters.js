export const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
};

export const truncateText = (text, limit = 139) => {
  const formattedtext = `${text.substring(0, limit)}...`;
  return text.length > limit ? formattedtext : text;
};
