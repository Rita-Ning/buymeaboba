const router = require('express').Router();
const { wrapAsync } = require('../../util/util');

const ArticleController = require('../controllers/article_controller');

router.get('/article/:postid', wrapAsync(ArticleController.getArticle));

//recieve comment and save
router.post('/comment/add', wrapAsync(ArticleController.addComment));

//recieve like and save
router.post('/like/add', wrapAsync(ArticleController.addLike));

//delete like
router.post('/like/delete', wrapAsync(ArticleController.deleteLike));

module.exports = router;
