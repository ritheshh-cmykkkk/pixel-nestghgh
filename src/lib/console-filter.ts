// Console warning filter for known third-party library warnings
// This suppresses specific warnings that are from dependencies, not our code

const originalConsoleWarn = console.warn;

console.warn = (...args) => {
  const message = args.join(" ");

  // Filter out known Recharts defaultProps warnings
  if (
    message.includes("defaultProps will be removed from function components") &&
    (message.includes("XAxis") ||
      message.includes("YAxis") ||
      message.includes("CartesianGrid") ||
      message.includes("Tooltip") ||
      message.includes("ResponsiveContainer") ||
      message.includes("Bar") ||
      message.includes("Pie") ||
      message.includes("Cell") ||
      message.includes("Line") ||
      message.includes("Area"))
  ) {
    // Suppress these specific Recharts warnings in development
    if (process.env.NODE_ENV === "development") {
      return;
    }
  }

  // Filter out other known library warnings that we can't control
  if (
    message.includes("Support for defaultProps will be removed") &&
    (message.includes("recharts") || message.includes("Recharts"))
  ) {
    return;
  }

  // Allow all other warnings through
  originalConsoleWarn.apply(console, args);
};

// Export for cleanup if needed
export const restoreConsoleWarn = () => {
  console.warn = originalConsoleWarn;
};
