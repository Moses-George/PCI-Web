/* eslint-disable @typescript-eslint/no-explicit-any */
// src/utils/normalizeError.ts

export interface NormalizedError {
  message: string;
  fieldErrors: Record<string, string>; // for form‑level validation
  status?: number;
}

/**
 * Normalize any error thrown from RTK Query or fetch into a consistent format.
 */
export function normalizeError(error: unknown): NormalizedError {
  // 1. Network error (no response)
  if (error instanceof TypeError && error.message === "Failed to fetch") {
    return {
      message: "Network error. Please check your connection and try again.",
      fieldErrors: {},
    };
  }

  // 2. FastAPI 422 validation error (the most common)
  // The error object from RTK Query usually has `data` containing the validation errors.
  // Expected shape: { detail: [ { loc: ["body", "field_name"], msg: "error message", type: ... } ] }
  if (error && typeof error === "object" && "data" in error) {
    const data = (error as any).data;

    // Check if it's a FastAPI validation error (422)
    if (data && data.detail && Array.isArray(data.detail)) {
      const fieldErrors: Record<string, string> = {};
      let generalMessage = "Validation error.";

      for (const issue of data.detail) {
        // loc is an array: ["body", "field_name"] or ["query", "param"]
        const field =
          issue.loc && issue.loc.length > 1 ? issue.loc[1] : "unknown";
        const message = issue.msg || "Invalid value";

        // If field is "body", treat as general error
        if (field === "body") {
          generalMessage = message;
        } else {
          // Store field‑specific error (use the field name as key)
          fieldErrors[field] = message;
        }
      }

      return {
        message: generalMessage,
        fieldErrors,
        status: 422,
      };
    }

    // 3. Other HTTP errors (400, 401, 404, 500, etc.)
    if (data && data.detail) {
      // If detail is a string, use it directly
      if (typeof data.detail === "string") {
        return {
          message: data.detail,
          fieldErrors: {},
          status: (error as any)?.status,
        };
      }
      // If detail is an object/array, try to extract messages
      if (Array.isArray(data.detail)) {
        const messages = data.detail
          .map((item: any) => item.msg || item)
          .join("; ");
        return {
          message: messages,
          fieldErrors: {},
          status: (error as any)?.status,
        };
      }
    }
  }

  // 4. Fallback: if we can't parse, return a generic error
  if (error instanceof Error) {
    return {
      message: error.message || "An unexpected error occurred.",
      fieldErrors: {},
    };
  }

  return {
    message: "An unexpected error occurred.",
    fieldErrors: {},
  };
}
