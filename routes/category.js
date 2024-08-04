//express 모듈
const express =  require('express');
const router = express.Router(); //라우팅 당하는 입장
const {
    allCategory
} = require('../controller/CategoryController');
//dotenv 모듈
const dotenv = require('dotenv');
dotenv.config();

router.use(express.json());

router.get('/', allCategory); //카테고리 전체 목록 조회

module.exports = router;