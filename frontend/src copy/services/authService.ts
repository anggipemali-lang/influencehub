export type UserRole = 'brand' | 'influencer' | 'admin';

export interface UserProfile {
  uid: string;
  email: string;
  role: UserRole;
  displayName: string;
  createdAt: string;
}

const API_URL = '/api/auth';

export const registerUser = async (email: string, password: string, role: UserRole, displayName: string): Promise<UserProfile> => {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, role, displayName }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Registration failed');
  }

  const data = await response.json();
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
  return data.user;
};

export const loginUser = async (email: string, password: string): Promise<UserProfile> => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Login failed');
  }

  const data = await response.json();
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
  return data.user;
};

export const loginWithGoogle = async (role: UserRole): Promise<UserProfile> => {
  // Since we removed Firebase, we can't use signInWithPopup.
  // For this "normal" method, we'll suggest using email/password.
  // In a real app, you'd use OAuth flow here.
  throw new Error("Google login is currently disabled after Firebase removal. Please use Email/Password.");
};

export const getCurrentUserProfile = (): UserProfile | null => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const logout = async () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  await fetch(`${API_URL}/logout`, { method: 'POST' });
};
