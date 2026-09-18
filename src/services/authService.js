// Authentication & Role-Based Access Control Service
// Supports Admin credentials, standard user accounts, and session persistence

const AUTH_STORAGE_KEYS = {
  CURRENT_USER: 'tippulse_current_user',
  USERS_DB: 'tippulse_users_db',
};

export const authService = {
  // Get current logged-in user
  getCurrentUser: () => {
    try {
      const user = localStorage.getItem(AUTH_STORAGE_KEYS.CURRENT_USER);
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },

  // In the mobile client, administrative access is disabled for zero-trust security
  isAdmin: () => false,

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
    const cleanUsername = (username || '').trim().toLowerCase();
    const users = authService.getUsersDB();
    const matchedUser = users.find(
      (u) => u.username.toLowerCase() === cleanUsername && u.password === password
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
    const cleanUsername = (username || '').trim().toLowerCase();
    if (!cleanUsername || !password) {
      return { success: false, error: 'Username and password are required.' };
    }

    const users = authService.getUsersDB();
    if (users.some((u) => u.username.toLowerCase() === cleanUsername)) {
      return { success: false, error: 'Username is already taken. Please pick another.' };
    }

    const newUser = {
      username: cleanUsername,
      name: (name || '').trim() || cleanUsername,
      password: password,
      role: 'user',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      createdAt: new Date().toISOString(),
    };

    const updatedUsers = [...users, newUser];
    localStorage.setItem(AUTH_STORAGE_KEYS.USERS_DB, JSON.stringify(updatedUsers));

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
