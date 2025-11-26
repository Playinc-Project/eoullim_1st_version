import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoWarning, IoChevronForward } from 'react-icons/io5';
import { useAuth } from '../../contexts/AuthContext';
import './ProfilePage.css';

const ProfilePage = () => {
 const navigate = useNavigate();
 const { user, logout } = useAuth();

 const handleLogout = () => {
   if (window.confirm('로그아웃하시겠습니까?')) {
     logout();
     navigate('/');
   }
 };

 return (
   <div className="main-container">
     {/* 헤더 */}
     <header className="main-header">
       <div className="header-logo">어울림</div>
       <div className="header-nav">
         <Link to="/main" className="nav-link">공지</Link>
         <Link to="/messages" className="nav-link">쪽지</Link>
         <Link to="/profile" className="nav-link active">프로필</Link>
       </div>
     </header>

     {/* 메인 콘텐츠 */}
     <div className="main-content">
       {/* 타이틀 */}
       <h1 className="content-title">프로필</h1>

       {/* 프로필 정보 */}
       <div className="profile-card">
         <div className="profile-info-section">
           <div className="profile-avatar">
             <div className="avatar-circle">👤</div>
           </div>
           <div className="user-info">
             <div className="user-name">{user?.username || '사용자'}</div>
             <div className="user-email">{user?.email || ''}</div>
             {user?.bio && <div className="user-bio">{user.bio}</div>}
           </div>
         </div>
       </div>

       {/* 메뉴 섹션 */}
       <div className="menu-card">
         <div className="menu-section">
           <Link to="/faq" className="menu-item">
             <IoWarning className="menu-icon" />
             <span>FAQ</span>
             <IoChevronForward className="arrow-icon" />
           </Link>
           <Link to="/support" className="menu-item">
             <IoWarning className="menu-icon" />
             <span>고객센터</span>
             <IoChevronForward className="arrow-icon" />
           </Link>
           <Link to="/terms" className="menu-item">
             <IoWarning className="menu-icon" />
             <span>이용약관</span>
             <IoChevronForward className="arrow-icon" />
           </Link>
           <Link to="/privacy" className="menu-item">
             <IoWarning className="menu-icon" />
             <span>개인정보처리방침</span>
             <IoChevronForward className="arrow-icon" />
           </Link>
         </div>
       </div>

       {/* 액션 버튼들 */}
       <div className="action-card">
         <div className="action-buttons">
           <Link to="/withdraw" className="action-button">회원탈퇴</Link>
           <button onClick={handleLogout} className="action-button logout">로그아웃</button>
         </div>
       </div>
     </div>
   </div>
 );
};

export default ProfilePage;