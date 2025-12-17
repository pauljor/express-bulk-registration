export enum UserRole {
  STAFF = 'staff',
  TEACHER = 'teacher',
  STUDENT = 'student',
}

export interface CreateUserRequest {
  email: string;
  password: string;
  role: UserRole;
  given_name?: string;
  family_name?: string;
  name?: string;
}

export interface UpdateUserRequest {
  email: string;
  given_name?: string;
  family_name?: string;
  name?: string;
  role?: UserRole;
  password?: string;
}

export interface UserResponse {
  user_id: string;
  email: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  role: UserRole;
  created_at: string;
  updated_at?: string;
  email_verified: boolean;
}

export interface BulkUploadResult {
  totalRows: number;
  successCount: number;
  failureCount: number;
  errors: BulkUploadError[];
}

export interface BulkUploadError {
  row: number;
  email: string;
  error: string;
}

export interface CSVUserRow {
  email: string;
  password?: string;
  role: string;
  given_name?: string;
  family_name?: string;
  name?: string;
}

export interface PaginatedUsersResponse {
  users: UserResponse[];
  start: number;
  limit: number;
  total: number;
}
