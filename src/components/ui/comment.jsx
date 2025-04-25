import React, { useState, useEffect } from "react";
import "./comment.css";

function Comment({ isAdmin, onPinComment, carId }) {
  const [comments, setComments] = useState([]); // Comments fetched from the database
  const [newComment, setNewComment] = useState(""); // New comment input
  const [pinnedComment, setPinnedComment] = useState(null); // Pinned comment

  // Fetch comments and pinned comment from the backend
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`/api/cars/${carId}/comments`);
        if (!response.ok) {
          throw new Error("Failed to fetch comments");
        }
        const data = await response.json();

        // Separate pinned comment from the rest
        const pinned = data.find((comment) => comment.isPinned);
        const otherComments = data.filter((comment) => !comment.isPinned);

        setPinnedComment(pinned || null);
        setComments(otherComments);

        // Notify parent about the pinned comment
        if (pinned && onPinComment) {
          onPinComment(pinned);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [carId, onPinComment]);

  // Handle adding a new comment
  const handleAddComment = async () => {
    if (newComment.trim() === "") return;

    const comment = {
      text: newComment,
      likes: 0,
    };

    try {
      const response = await fetch(`/api/cars/${carId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(comment),
      });

      if (!response.ok) {
        throw new Error("Failed to add comment");
      }

      const newCommentData = await response.json();
      setComments((prevComments) => [newCommentData, ...prevComments]);
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  // Handle liking a comment
  const handleLike = async (id) => {
    try {
      const response = await fetch(`/api/cars/${carId}/comments/${id}/like`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to like comment");
      }

      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === id ? { ...comment, likes: comment.likes + 1 } : comment
        )
      );
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  };

  // Handle pinning a comment (admin only)
  const handlePinComment = async (comment) => {
    try {
      const response = await fetch(`/api/cars/${carId}/comments/${comment.id}/pin`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to pin comment");
      }

      setPinnedComment(comment);
      setComments((prevComments) =>
        prevComments.filter((c) => c.id !== comment.id)
      );

      if (onPinComment) onPinComment(comment); // Notify parent about the pinned comment
    } catch (error) {
      console.error("Error pinning comment:", error);
    }
  };

  return (
    <div className="comment-section">
      <h2 className="comment-title">Comments</h2>

      {/* Pinned Comment */}
      {pinnedComment && (
        <div className="pinned-comment">
          <p className="pinned-label">Pinned Comment</p>
          <p>{pinnedComment.text}</p>
        </div>
      )}

      {/* Add Comment Input */}
      <div className="add-comment">
        <input
          type="text"
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button onClick={handleAddComment}>Post</button>
      </div>

      {/* Comments List */}
      <div className="comments-list">
        {comments.map((comment) => (
          <div key={comment.id} className="comment-item">
            <p className="comment-text">{comment.text}</p>
            <div className="comment-actions">
              <button
                className="like-button"
                onClick={() => handleLike(comment.id)}
              >
                ❤️ {comment.likes}
              </button>
              {isAdmin && (
                <button
                  className="pin-button"
                  onClick={() => handlePinComment(comment)}
                >
                  Pin
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Comment;