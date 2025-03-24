import { use } from 'react'
import { AuthContext } from '../providers/AuthProvider';

function useAuth() {
  const auth = use(AuthContext);
  return auth;
}

export default useAuth;