const express = require('express');
const { createCategoryLanguageController, getCategoryLanguagesController, updateCategoryLanguageController, deleteCategoryLanguageController, getCategoryLanguagesBySlugController, countCategoryLanguagesController } = require('../controllers/categoryLanguages.controller');
const { isAdmin, requireSignIn } = require('../middlewares/middleware');
const router = express.Router();
    router.post('/categoryLanguage', requireSignIn, isAdmin, createCategoryLanguageController);
    router.get('/categoryLanguages', getCategoryLanguagesController);
    router.put('/categoryLanguages/:slug', requireSignIn, isAdmin, updateCategoryLanguageController);
    router.delete('/categoryLanguages/:slug', requireSignIn, isAdmin, deleteCategoryLanguageController);
    router.get('/categoryLanguages/:slug', getCategoryLanguagesBySlugController); 
    router.get('/count-categoryLanguages', countCategoryLanguagesController);
module.exports = router;

