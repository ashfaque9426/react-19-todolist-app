import { use } from 'react'
import { AuthContext } from '../providers/AuthProvider';

function useAuth() {
  const auth = use(AuthContext);
  if (!auth) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return auth;
}

export default useAuth;