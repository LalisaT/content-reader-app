// Authentication & Role-Based Access Control Service
// Supports Admin credentials, standard user accounts, and session persistence

const AUTH_STORAGE_KEYS = {
  CURRENT_USER: 'tippulse_current_user',
  USERS_DB: 'tippulse_users_db',
  ADMIN_CONFIG: 'tippulse_admin_config',
};

// Default Admin credentials (can be updated from settings)
const DEFAULT_ADMIN = {
  username: 'admin',
  password: 'admin123',
  name: 'Chief Editor (Admin)',
  role: 'admin',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
};

export const authService = {
  // Get stored admin credentials
  getAdminConfig: () => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEYS.ADMIN_CONFIG);
      return stored ? JSON.parse(stored) : DEFAULT_ADMIN;
    } catch {
      return DEFAULT_ADMIN;
    }
  },

  // Update admin password
  updateAdminCredentials: (newPassword, newName) => {
    const current = authService.getAdminConfig();
    const updated = {
      ...current,
      password: newPassword || current.password,
      name: newName || current.name,
    };
    localStorage.setItem(AUTH_STORAGE_KEYS.ADMIN_CONFIG, JSON.stringify(updated));

    // Update active session if currently logged in as admin
    const active = authService.getCurrentUser();
    if (active && active.role === 'admin') {
      const updatedUser = { ...active, name: updated.name };
      localStorage.setItem(AUTH_STORAGE_KEYS.CURRENT_USER, JSON.stringify(updatedUser));
    }
    return true;
  },

  // Get current logged-in user
  getCurrentUser: () => {
    try {
      const user = localStorage.getItem(AUTH_STORAGE_KEYS.CURRENT_USER);
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },

  // Check if current user is Admin
  isAdmin: () => {
    const user = authService.getCurrentUser();
    return user && user.role === 'admin';
  },

  // User database helper
  getUsersDB: () => {
    try {
      const users = localStorage.getItem(AUTH_STORAGE_KEYS.USERS_DB);
      return users ? JSON.parse(users) : [];
    } catch {
      return [];
    }
  },

  // Sign In
  login: (username, password) => {
    const admin = authService.getAdminConfig();

    // 1. Check Admin credentials
    if (
      username.trim().toLowerCase() === admin.username.toLowerCase() &&
      password === admin.password
    ) {
      const adminSession = {
        username: admin.username,
        name: admin.name,
        role: 'admin',
        avatar: admin.avatar,
      };
      localStorage.setItem(AUTH_STORAGE_KEYS.CURRENT_USER, JSON.stringify(adminSession));
      return { success: true, user: adminSession };
    }

    // 2. Check regular users database
    const users = authService.getUsersDB();
    const matchedUser = users.find(
      (u) => u.username.toLowerCase() === username.trim().toLowerCase() && u.password === password
    );

    if (matchedUser) {
      const userSession = {
        username: matchedUser.username,
        name: matchedUser.name,
        role: 'user',
        avatar: matchedUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      };
      localStorage.setItem(AUTH_STORAGE_KEYS.CURRENT_USER, JSON.stringify(userSession));
      return { success: true, user: userSession };
    }

    return { success: false, error: 'Invalid username or password.' };
  },

  // Register a new regular user
  register: (username, name, password) => {
    const cleanUsername = username.trim().toLowerCase();
    const admin = authService.getAdminConfig();

    if (cleanUsername === admin.username.toLowerCase()) {
      return { success: false, error: 'Username "admin" is reserved for Administrator.' };
    }

    const users = authService.getUsersDB();
    if (users.some((u) => u.username.toLowerCase() === cleanUsername)) {
      return { success: false, error: 'Username is already taken. Please pick another.' };
    }

    const newUser = {
      username: cleanUsername,
      name: name.trim() || cleanUsername,
      password: password,
      role: 'user',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      createdAt: new Date().toISOString(),
    };

    const updatedUsers = [...users, newUser];
    localStorage.setItem(AUTH_STORAGE_KEYS.USERS_DB, JSON.stringify(updatedUsers));

    // Automatically log in the newly registered user
    const session = {
      username: newUser.username,
      name: newUser.name,
      role: 'user',
      avatar: newUser.avatar,
    };
    localStorage.setItem(AUTH_STORAGE_KEYS.CURRENT_USER, JSON.stringify(session));

    return { success: true, user: session };
  },

  // Logout
  logout: () => {
    localStorage.removeItem(AUTH_STORAGE_KEYS.CURRENT_USER);
  },
};
