//express 모듈
const express =  require('express');
const router = express.Router(); //라우팅 당하는 입장
const {
    allBooks,
    bookDetail
} = require('../controller/BookController');
//dotenv 모듈
const dotenv = require('dotenv');
dotenv.config();

router.use(express.json());

router.get('/', allBooks); //전체 도서 조회, 카테고리별 조회
router.get('/:id', bookDetail); //개별 도서 조회

module.exports = router;