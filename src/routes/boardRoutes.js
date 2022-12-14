const router = require('express').Router()
const boardController = require('../controllers/board.js');

router.get('/', boardController.getAll);

router.post('/', boardController.createOne);

router.patch('/:key', boardController.updateOne);

router.delete('/:key', boardController.deleteOne);

router.get('/:key/posts', boardController.getPosts);

router.post('/:key/posts', boardController.createPost);

router.patch('/:key/posts/:id', boardController.updatePostOne);

router.delete('/:key/posts/:id', boardController.deletePostOne);

router.post('/:key/posts/:id/comments', boardController.createCommentOne);

router.get('/:key/posts/:id/comments', boardController.getComments);

router.patch('/:key/posts/:id/comments/:cid', boardController.updateCommentOne);

router.delete('/:key/posts/:id/comments/:cid', boardController.deleteCommentOne);



module.exports = router;
