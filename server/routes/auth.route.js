const express = require('express');
const { 
    registerController, 
    loginController, 
    getUserController, 
    getUserByIdController, 
    countUsersController, 
    deleteUserController, 
    updateUserController,
    toggleBookmarkController,
    getSavedPostsController
} = require('../controllers/auth.controller');
const { requireSignIn, isAdmin } = require('../middlewares/middleware');
const router = express.Router();

// Auth routes
router.post('/register', registerController);
router.post('/login', loginController);

// User management routes
router.get('/users', getUserController);
router.get('/users/:id', getUserByIdController);
router.get('/count-users', countUsersController);
router.delete('/users/:id', requireSignIn, isAdmin, deleteUserController);
router.put('/users/:id', requireSignIn, isAdmin, updateUserController);

// Bookmark routes
router.post('/bookmark/:postId', requireSignIn, toggleBookmarkController);
router.get('/saved-posts', requireSignIn, getSavedPostsController);

module.exports = router;