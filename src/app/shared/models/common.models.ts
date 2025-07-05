// Generic API response wrapper
export interface ApiResponse<T = unknown> {
  readonly success: boolean;
  readonly data?: T;
  readonly message?: string;
  readonly error?: string;
  readonly statusCode?: number;
}

// Error response interface
export interface ApiError {
  readonly message: string;
  readonly statusCode: number;
  readonly errors?: Readonly<Record<string, readonly string[]>>;
}
