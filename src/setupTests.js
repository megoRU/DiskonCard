// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";

// Global mock for fetch to handle image loading in tests
global.fetch = vi.fn((url) => {
  // If it's a path to an image, return a mock response that can be blobbed
  if (
    typeof url === "string" &&
    (url.startsWith("/card-logos/") || url.startsWith("data:image"))
  ) {
    // For data URLs, we can try to simulate a successful fetch of that data
    if (url.startsWith("data:image")) {
      // This is a simplified approach; actual conversion from data URL to Blob might be more complex
      // For now, just returning a generic blob for simplicity if needed.
      // However, fetch is usually not called for data URLs directly in this manner.
      // More likely, data URLs are assigned directly to selectedLogoDataUrl.
      // This part of the mock might be less critical than path-based URLs.
      return Promise.resolve({
        ok: true,
        status: 200,
        blob: () => Promise.resolve(new Blob([""], { type: "image/png" })),
        json: () => Promise.reject(new Error("Not JSON")), // Should not be called for images
      });
    }
    // For path-based URLs like /card-logos/default.png
    return Promise.resolve({
      ok: true,
      status: 200,
      blob: () => Promise.resolve(new Blob([""], { type: "image/png" })), // Return an empty png blob
      json: () => Promise.reject(new Error("Not JSON")),
    });
  }
  // For other URLs, reject or return a specific non-image response
  return Promise.reject(new Error(`Unhandled URL in fetch mock: ${url}`));
});

// Mock FileReader
global.FileReader = vi.fn(() => ({
  readAsDataURL: vi.fn(function () {
    this.onloadend(); // Immediately trigger onloadend for simplicity in tests
  }),
  result: "data:image/png;base64,mocked-file-content", // Mocked base64 content
  onloadend: vi.fn(),
  onerror: vi.fn(),
}));

// Mock package.json to provide default values for version and releaseDate
vi.mock("../package.json", () => ({
  default: {
    version: "1.0.0-test", // Or a specific test version
    releaseDate: "2024-01-01T00:00:00.000Z", // Or a specific test date
  },
  // If your code uses named exports from package.json:
  // version: "1.0.0-test",
  // releaseDate: "2024-01-01T00:00:00.000Z",
}));
