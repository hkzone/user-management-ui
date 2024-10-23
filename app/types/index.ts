export interface AuthFormData {
  email: string;
  password: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  isVerified: boolean;
  password: string;
}

export interface Permission {
  readPosts: boolean;
  writePosts: boolean;
  readMessages: boolean;
  writeMessages: boolean;
  readProfile: boolean;
  writeProfile: boolean;
}

export interface Invite {
  id: string;
  inviter: Omit<User, 'password'>;
  invitee: Omit<User, 'password'>;
  permissions: Permission;
  createdAt: string;
  status: string;
}
