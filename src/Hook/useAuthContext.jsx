import React, { useContext } from 'react';
import AuthContext from '../FirebaseAuthContext/AuthContext';

const useAuthContext = () => {
  const authInfo = useContext(AuthContext);
  return authInfo;
};

export default useAuthContext;
