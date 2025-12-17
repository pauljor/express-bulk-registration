import fs from 'fs';
import csvParser from 'csv-parser';
import logger from '../utils/logger';
import {
  CSVUserRow,
  BulkUploadResult,
  BulkUploadError,
  CreateUserRequest,
  UserRole,
} from '../types';
import auth0Service from './auth0.service';

class CSVService {
  /**
   * Parse CSV file and return rows
   */
  async parseCSV(filePath: string): Promise<CSVUserRow[]> {
    return new Promise((resolve, reject) => {
      const rows: CSVUserRow[] = [];

      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (row) => {
          rows.push(row);
        })
        .on('end', () => {
          resolve(rows);
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }

  /**
   * Validate a CSV row
   */
  validateRow(row: CSVUserRow, rowIndex: number): string | null {
    // Check required fields
    if (!row.email || !row.email.trim()) {
      return 'Email is required';
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(row.email)) {
      return 'Invalid email format';
    }

    // Check role
    if (!row.role || !row.role.trim()) {
      return 'Role is required';
    }

    const validRoles = Object.values(UserRole);
    if (!validRoles.includes(row.role as UserRole)) {
      return `Invalid role. Must be one of: ${validRoles.join(', ')}`;
    }

    // Password validation (if provided)
    if (row.password && row.password.length < 8) {
      return 'Password must be at least 8 characters';
    }

    return null;
  }

  /**
   * Generate a random password
   */
  generatePassword(): string {
    const length = 12;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';

    // Ensure password contains at least one of each type
    password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)];
    password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)];
    password += '0123456789'[Math.floor(Math.random() * 10)];
    password += '!@#$%^&*'[Math.floor(Math.random() * 8)];

    // Fill the rest randomly
    for (let i = password.length; i < length; i++) {
      password += charset[Math.floor(Math.random() * charset.length)];
    }

    // Shuffle the password
    return password
      .split('')
      .sort(() => Math.random() - 0.5)
      .join('');
  }

  /**
   * Process bulk user registration from CSV
   */
  async processBulkRegistration(filePath: string): Promise<BulkUploadResult> {
    const result: BulkUploadResult = {
      totalRows: 0,
      successCount: 0,
      failureCount: 0,
      errors: [],
    };

    try {
      // Parse CSV file
      const rows = await this.parseCSV(filePath);
      result.totalRows = rows.length;

      logger.info(`Processing ${rows.length} users from CSV`);

      // Process each row
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const rowNumber = i + 2; // +2 because row 1 is header and arrays are 0-indexed

        // Validate row
        const validationError = this.validateRow(row, rowNumber);
        if (validationError) {
          result.failureCount++;
          result.errors.push({
            row: rowNumber,
            email: row.email || 'N/A',
            error: validationError,
          });
          continue;
        }

        try {
          // Create user request
          const createUserRequest: CreateUserRequest = {
            email: row.email.trim(),
            password: row.password && row.password.trim()
              ? row.password.trim()
              : this.generatePassword(),
            role: row.role.trim() as UserRole,
            given_name: row.given_name?.trim(),
            family_name: row.family_name?.trim(),
            name: row.name?.trim(),
          };

          // Create user in Auth0
          await auth0Service.createUser(createUserRequest);
          result.successCount++;

          logger.debug(`Row ${rowNumber}: User created successfully - ${row.email}`);
        } catch (error: any) {
          result.failureCount++;
          result.errors.push({
            row: rowNumber,
            email: row.email,
            error: error.message || 'Failed to create user',
          });

          logger.error(`Row ${rowNumber}: Failed to create user - ${row.email}`, error);
        }

        // Optional: Add a small delay to avoid rate limiting
        if (i > 0 && i % 10 === 0) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }

      logger.info(
        `Bulk registration completed: ${result.successCount} succeeded, ${result.failureCount} failed`
      );

      return result;
    } catch (error: any) {
      logger.error('Error processing CSV file', error);
      throw new Error('Failed to process CSV file: ' + error.message);
    } finally {
      // Clean up: delete the uploaded file
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          logger.debug(`Deleted temporary file: ${filePath}`);
        }
      } catch (error) {
        logger.error(`Failed to delete temporary file: ${filePath}`, error);
      }
    }
  }
}

export default new CSVService();
