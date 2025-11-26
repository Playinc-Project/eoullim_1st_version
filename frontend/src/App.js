import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import './App.css';

// 페이지 import
import Splash from './pages/Splash/Splash';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import Main from './pages/Main/Main';
import WritePage from './pages/Board/WritePage';
import PostDetailPage from './pages/Post/PostDetailPage';
import MessagePage from './pages/Message/MessagePage';
import MessageWrite from './pages/Message/MessageWrite';
import ProfilePage from './pages/Profile/ProfilePage';
import WithdrawPage from './pages/Withdraw/WithdrawPage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // 앱 로드 시 인증 상태 확인
  useEffect(() => {
    const token = localStorage.getItem('token');
    const currentUser = localStorage.getItem('currentUser');
    setIsAuthenticated(!!(token && currentUser));
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px'
      }}>
        로딩 중...
      </div>
    );
  }

  // 로그인 필요 라우트를 위한 보호 컴포넌트
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* 인증 페이지 */}
            <Route path="/" element={<Splash />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* 보호된 페이지 */}
            <Route
              path="/main"
              element={
                <ProtectedRoute>
                  <Main />
                </ProtectedRoute>
              }
            />
            <Route
              path="/board/write"
              element={
                <ProtectedRoute>
                  <WritePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/post/:id"
              element={
                <ProtectedRoute>
                  <PostDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/messages"
              element={
                <ProtectedRoute>
                  <MessagePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/messages/write"
              element={
                <ProtectedRoute>
                  <MessageWrite />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/withdraw"
              element={
                <ProtectedRoute>
                  <WithdrawPage />
                </ProtectedRoute>
              }
            />

            {/* 404 */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;