// In-memory session store (replaces Redis)
const sessions = new Map();

const client = {
  async get(key) {
    const session = sessions.get(key);
    if (session && session.expiry > Date.now()) {
      return session.value;
    }
    // Clean up expired session
    if (session) {
      sessions.delete(key);
    }
    return null;
  },
  async set(key, value, option, expiry) {
    sessions.set(key, {
      value: value,
      expiry: Date.now() + (expiry * 1000) // Convert seconds to milliseconds
    });
    return "OK";
  },
  async del(key) {
    sessions.delete(key);
    return 1;
  }
};

// Clean up expired sessions every hour
setInterval(() => {
  const now = Date.now();
  for (const [key, session] of sessions.entries()) {
    if (session.expiry <= now) {
      sessions.delete(key);
    }
  }
}, 3600000); // 1 hour

module.exports = client;