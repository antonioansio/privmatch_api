const { createComment, getCommentsByUserId, getCommentById, updateComment, deleteComment } = require('../models/commentModel');

exports.createComment = async (req, res) => {
  const userId = req.user.id;
  const { commentedUserId, comment } = req.body;

  if (!commentedUserId || !comment) {
    return res.status(400).json({ message: "Invalid data. CommentedUserId and comment are required." });
  }

  if (userId === commentedUserId) {
    return res.status(400).json({ message: "You cannot comment on your own profile." });
  }

  try {
    const commentId = await createComment(userId, commentedUserId, comment);
    res.status(201).json({ message: 'Comment created', commentId });
  } catch (error) {
    res.status(500).json({ message: 'Error creating comment', error: error.message });
  }
};

exports.getComments = async (req, res) => {
  const { commentedUserId } = req.params;
  try {
    const comments = await getCommentsByUserId(commentedUserId);
    res.status(200).json({ data: comments });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching comments', error: error.message });
  }
};

exports.updateComment = async (req, res) => {
    const { commentId } = req.params;
    const { comment } = req.body;
    const userId = req.user.id;
  
    try {
      const existingComment = await getCommentById(commentId);
      if (!existingComment) {
        return res.status(404).json({ message: 'Comment not found' });
      }
  
      if (existingComment.user_id !== userId) {
        return res.status(403).json({ message: 'You do not have permission to update this comment' });
      }
  
      await updateComment(commentId, comment);
      res.status(200).json({ message: 'Comment updated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error updating comment', error: error.message });
    }
};

exports.deleteComment = async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user.id;
  
    try {
      const existingComment = await getCommentById(commentId);
      if (!existingComment) {
        return res.status(404).json({ message: 'Comment not found' });
      }
  
      if (existingComment.user_id !== userId && existingComment.commented_user_id !== userId) {
        return res.status(403).json({ message: 'You do not have permission to delete this comment' });
      }
  
      await deleteComment(commentId);
      res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting comment', error: error.message });
    }
};