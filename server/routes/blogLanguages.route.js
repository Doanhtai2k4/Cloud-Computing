const express = require('express');
const { requireSignIn, isAdmin } = require('../middlewares/middleware');
const { createBlogLanguagesController, getAllBlogLanguagesController, getBlogLanguageByIdController, updateBlogLanguagesController, deleteBlogLanguagesController, countBlogLanguagesController, searchBlogLanguagesController } = require('../controllers/blogLanguages.controller');
const router = express.Router();
    router.post('/blogLanguages', requireSignIn, isAdmin, createBlogLanguagesController)
    router.get('/blogLanguages', getAllBlogLanguagesController)
    router.get('/search', searchBlogLanguagesController)
    router.get('/blogLanguages/:id', getBlogLanguageByIdController) 
    router.put('/blogLanguages/:id', requireSignIn, isAdmin, updateBlogLanguagesController)
    router.delete('/blogLanguages/:id', requireSignIn, isAdmin, deleteBlogLanguagesController)
    router.get('/count-blogLanguages', countBlogLanguagesController)
module.exports = router;