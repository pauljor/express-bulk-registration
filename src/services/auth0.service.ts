import { ManagementClient } from 'auth0';
import config from '../config/config';
import logger from '../utils/logger';
import { CreateUserRequest, UpdateUserRequest, UserResponse, UserRole } from '../types';

class Auth0Service {
  private managementClient: ManagementClient;

  constructor() {
    this.managementClient = new ManagementClient({
      domain: config.auth0.domain,
      clientId: config.auth0.managementApi.clientId,
      clientSecret: config.auth0.managementApi.clientSecret,
      audience: config.auth0.managementApi.audience,
    });
  }

  /**
   * Create a new user in Auth0
   */
  async createUser(userData: CreateUserRequest): Promise<UserResponse> {
    try {
      const auth0User: any = {
        email: userData.email,
        password: userData.password,
        connection: 'Username-Password-Authentication',
        email_verified: false,
        given_name: userData.given_name,
        family_name: userData.family_name,
        name: userData.name || `${userData.given_name || ''} ${userData.family_name || ''}`.trim(),
        app_metadata: {
          role: userData.role,
        },
      };

      const createdUser: any = await this.managementClient.users.create(auth0User);

      // Assign role to user
      await this.assignRoleToUser(createdUser.user_id!, userData.role);

      logger.info(`User created successfully: ${userData.email}`);

      return this.mapAuth0UserToResponse(createdUser, userData.role);
    } catch (error: any) {
      logger.error(`Error creating user: ${userData.email}`, error);
      throw new Error(error.message || 'Failed to create user');
    }
  }

  /**
   * Get a user by email
   */
  async getUserByEmail(email: string): Promise<UserResponse | null> {
    try {
      const users: any = await this.managementClient.usersByEmail.getByEmail({ email });

      if (!users || users.length === 0) {
        return null;
      }

      const user = users[0];
      const role = user.app_metadata?.role || UserRole.STUDENT;

      return this.mapAuth0UserToResponse(user, role);
    } catch (error: any) {
      logger.error(`Error fetching user by email: ${email}`, error);
      throw new Error(error.message || 'Failed to fetch user');
    }
  }

  /**
   * Get a user by ID
   */
  async getUserById(userId: string): Promise<UserResponse | null> {
    try {
      const user: any = await this.managementClient.users.get({ id: userId });

      if (!user) {
        return null;
      }

      const role = user.app_metadata?.role || UserRole.STUDENT;

      return this.mapAuth0UserToResponse(user, role);
    } catch (error: any) {
      if (error.statusCode === 404) {
        return null;
      }
      logger.error(`Error fetching user by ID: ${userId}`, error);
      throw new Error(error.message || 'Failed to fetch user');
    }
  }

  /**
   * Get all users with pagination
   */
  async getUsers(page = 0, perPage = 50): Promise<{ users: UserResponse[]; total: number }> {
    try {
      const result: any = await this.managementClient.users.getAll({
        page,
        per_page: perPage,
        include_totals: true,
      });

      const users = result.users.map((user: any) => {
        const role = user.app_metadata?.role || UserRole.STUDENT;
        return this.mapAuth0UserToResponse(user, role);
      });

      return {
        users,
        total: result.total || 0,
      };
    } catch (error: any) {
      logger.error('Error fetching users', error);
      throw new Error(error.message || 'Failed to fetch users');
    }
  }

  /**
   * Update a user by email
   */
  async updateUser(email: string, updateData: UpdateUserRequest): Promise<UserResponse> {
    try {
      // First, find the user by email
      const existingUser = await this.getUserByEmail(email);

      if (!existingUser) {
        throw new Error('User not found');
      }

      const updatePayload: any = {};

      if (updateData.given_name !== undefined) updatePayload.given_name = updateData.given_name;
      if (updateData.family_name !== undefined) updatePayload.family_name = updateData.family_name;
      if (updateData.name !== undefined) updatePayload.name = updateData.name;
      if (updateData.password !== undefined) updatePayload.password = updateData.password;

      // Update role in app_metadata if provided
      if (updateData.role !== undefined) {
        updatePayload.app_metadata = {
          role: updateData.role,
        };

        // Update user role assignment
        await this.assignRoleToUser(existingUser.user_id, updateData.role);
      }

      const updatedUser: any = await this.managementClient.users.update(
        { id: existingUser.user_id },
        updatePayload
      );

      const role = updateData.role || existingUser.role;

      logger.info(`User updated successfully: ${email}`);

      return this.mapAuth0UserToResponse(updatedUser, role);
    } catch (error: any) {
      logger.error(`Error updating user: ${email}`, error);
      throw new Error(error.message || 'Failed to update user');
    }
  }

  /**
   * Delete a user by email
   */
  async deleteUser(email: string): Promise<void> {
    try {
      const user = await this.getUserByEmail(email);

      if (!user) {
        throw new Error('User not found');
      }

      await this.managementClient.users.delete({ id: user.user_id });

      logger.info(`User deleted successfully: ${email}`);
    } catch (error: any) {
      logger.error(`Error deleting user: ${email}`, error);
      throw new Error(error.message || 'Failed to delete user');
    }
  }

  /**
   * Assign a role to a user
   */
  private async assignRoleToUser(userId: string, role: UserRole): Promise<void> {
    try {
      const roleId = this.getRoleId(role);

      if (!roleId) {
        logger.warn(`Role ID not configured for role: ${role}`);
        return;
      }

      await this.managementClient.users.assignRoles(
        { id: userId },
        { roles: [roleId] }
      );

      logger.debug(`Role ${role} assigned to user ${userId}`);
    } catch (error: any) {
      logger.error(`Error assigning role to user: ${userId}`, error);
      // Don't throw here to prevent user creation from failing due to role assignment issues
    }
  }

  /**
   * Get role ID from configuration
   */
  private getRoleId(role: UserRole): string | null {
    switch (role) {
      case UserRole.STAFF:
        return config.auth0.roles.staff;
      case UserRole.TEACHER:
        return config.auth0.roles.teacher;
      case UserRole.STUDENT:
        return config.auth0.roles.student;
      default:
        return null;
    }
  }

  /**
   * Map Auth0 user to our UserResponse format
   */
  private mapAuth0UserToResponse(user: any, role: UserRole): UserResponse {
    return {
      user_id: user.user_id!,
      email: user.email!,
      name: user.name,
      given_name: user.given_name,
      family_name: user.family_name,
      role,
      created_at: user.created_at!,
      updated_at: user.updated_at,
      email_verified: user.email_verified || false,
    };
  }
}

export default new Auth0Service();
