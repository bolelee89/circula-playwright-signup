export function generateUniqueEmail(): string {
  const now = new Date();

  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const year = String(now.getFullYear()).slice(-2);
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  return `${day}${month}${year}${hours}${minutes}${seconds}@test.com`;
}
export function generateUniqueCompanyName(): string {
  const now = new Date();

  // Date components
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = String(now.getFullYear()).slice(-2);
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  // Business name components
  const prefixes = [
    "Alpha",
    "Beta",
    "Gamma",
    "Delta",
    "Prime",
    "Next",
    "First",
  ];
  const suffixes = [
    "Solutions",
    "Technologies",
    "Enterprises",
    "Ventures",
    "Labs",
    "Group",
  ];
  const industries = [
    "Tech",
    "Finance",
    "Health",
    "Green",
    "Data",
    "Cloud",
    "AI",
  ];

  // Random selection
  const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const randomSuffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  const randomIndustry =
    industries[Math.floor(Math.random() * industries.length)];

  return `${randomPrefix} ${randomIndustry} ${randomSuffix} ${month}${day}${hours}${minutes}`;
}
