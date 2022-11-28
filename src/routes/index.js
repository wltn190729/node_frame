// 라우터 객체 생성
const router = require('express').Router()
const homeController = require('../controllers/HomeController');

router.get('/', homeController.home);


// 객체 Export
module.exports = router