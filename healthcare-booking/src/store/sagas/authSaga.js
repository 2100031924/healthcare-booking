import { call, put, takeLatest } from 'redux-saga/effects';
import { loginRequest, loginSuccess, loginFailure, registerRequest, registerSuccess, registerFailure } from '../slices/authSlice';

function* handleLogin(action) {
  try {
    const { email, password } = action.payload;
    
    // 1. Check local mock database first
    const registeredUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
    let user = registeredUsers.find(u => u.email === email);
    
    // 2. If not in local, check JSONPlaceholder (for demo compatibility)
    if (!user) {
      const response = yield call(() => 
        fetch(`https://jsonplaceholder.typicode.com/users?email=${email}`)
          .then(res => res.json())
      );
      if (response.length > 0) {
        user = response[0];
      }
    }

    if (user) {
      const authUser = { ...user, token: 'fake-jwt-token-' + Date.now() };
      localStorage.setItem('auth_token', authUser.token);
      localStorage.setItem('user', JSON.stringify(authUser));
      yield put(loginSuccess(authUser));
    } else {
      throw new Error('Invalid credentials. Please try again.');
    }
  } catch (error) {
    yield put(loginFailure(error.message));
  }
}

function* handleRegister(action) {
  try {
    const { fullName, email, phone, password } = action.payload;
    const registeredUser = {
      id: Date.now(),
      name: fullName,
      email: email,
      phone: phone,
      
      password: password,
      token: 'fake-jwt-token-' + Date.now(),
    };

    const registeredUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
    registeredUsers.push(registeredUser);
    localStorage.setItem('registered_users', JSON.stringify(registeredUsers));

    localStorage.setItem('auth_token', registeredUser.token);
    localStorage.setItem('user', JSON.stringify(registeredUser));
    yield put(registerSuccess(registeredUser));
  } catch (error) {
    yield put(registerFailure('Registration failed. Please try again.'));
  }
}

export default function* authSaga() {
  yield takeLatest(loginRequest.type, handleLogin);
  yield takeLatest(registerRequest.type, handleRegister);
}
