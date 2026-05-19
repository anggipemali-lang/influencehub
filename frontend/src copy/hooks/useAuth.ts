import { useState, useEffect } from 'react';
import { UserProfile } from '../services/authService';

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        
        if (storedUser && token) {
          const parsedUser = JSON.parse(storedUser);
          setProfile(parsedUser);
          setUser(parsedUser); // Simplified: user and profile are the same in our custom auth
        } else {
          setProfile(null);
          setUser(null);
        }
      } catch (err) {
        console.error("Auth check failed", err);
        setProfile(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
    
    // Listen for storage changes (helpful for multiple tabs)
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  return { user, profile, loading };
};
