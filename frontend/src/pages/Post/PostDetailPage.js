import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { postAPI, commentAPI } from '../../services/api';
import './PostDetailPage.css';

function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 게시글 & 댓글 로드
  useEffect(() => {
    loadPost();
  }, [id]);

  const loadPost = async () => {
    try {
      setLoading(true);
      
      // 게시글 조회
      const postResponse = await postAPI.getOne(id);
      setPost(postResponse.data);

      // 댓글 조회
      const commentsResponse = await commentAPI.getByPost(id);
      setComments(commentsResponse.data || []);
      
      setError('');
    } catch (err) {
      setError('게시글을 불러올 수 없습니다');
      console.error('Load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();

    if (!commentContent.trim()) {
      alert('댓글 내용을 입력하세요');
      return;
    }

    try {
      // 댓글 추가
      await commentAPI.create(id, currentUser.id, commentContent);
      
      // 댓글 목록 새로고침
      await loadPost();
      setCommentContent('');
    } catch (err) {
      alert('댓글 작성에 실패했습니다');
      console.error('Comment error:', err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('댓글을 삭제하시겠습니까?')) return;

    try {
      await commentAPI.delete(commentId, currentUser.id);
      setComments(comments.filter(c => c.id !== commentId));
    } catch (err) {
      alert('댓글 삭제에 실패했습니다');
      console.error('Delete error:', err);
    }
  };

  if (!currentUser.id) {
    return <div className="detail-container"><p>로그인이 필요합니다</p></div>;
  }

  if (loading) {
    return <div className="detail-container"><p>로딩 중...</p></div>;
  }

  if (!post) {
    return <div className="detail-container"><p>게시글을 찾을 수 없습니다</p></div>;
  }

  return (
    <div className="detail-container">
      {/* 헤더 */}
      <header className="detail-header">
        <button onClick={() => navigate('/main')} className="back-button">
          ← 뒤로
        </button>
        <h1>게시글</h1>
        <div></div>
      </header>

      {/* 게시글 */}
      <div className="post-detail">
        <h2 className="post-detail-title">{post.title}</h2>
        <div className="post-detail-meta">
          <span className="post-author">{post.userId}</span>
          <span className="post-time">
            {new Date(post.createdAt).toLocaleString()}
          </span>
          <span className="post-views">조회 {post.viewCount}</span>
        </div>

        <div className="post-detail-content">
          {post.content}
        </div>

        <div className="post-detail-stats">
          <span>♥ {post.likeCount} 좋아요</span>
          <span>💬 {comments.length} 댓글</span>
        </div>
      </div>

      {/* 댓글 섹션 */}
      <div className="comments-section">
        <h3>댓글 ({comments.length})</h3>

        {/* 댓글 작성 */}
        <form onSubmit={handleAddComment} className="comment-form">
          <textarea
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            placeholder="댓글을 입력하세요"
            rows="3"
          ></textarea>
          <button type="submit" className="comment-submit">
            댓글 작성
          </button>
        </form>

        {/* 댓글 목록 */}
        <div className="comments-list">
          {comments.length === 0 ? (
            <p className="no-comments">댓글이 없습니다</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="comment-item">
                <div className="comment-header">
                  <span className="comment-author">{comment.userId}</span>
                  <span className="comment-time">
                    {new Date(comment.createdAt).toLocaleString()}
                  </span>
                  {comment.userId === currentUser.id && (
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="comment-delete"
                    >
                      삭제
                    </button>
                  )}
                </div>
                <p className="comment-content">{comment.content}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default PostDetailPage;