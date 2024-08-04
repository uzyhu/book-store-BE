//express 모듈
const express =  require('express');
const router = express.Router(); //라우팅 당하는 입장
const {addToCart, getCartItems, removeCartItem} = require('../controller/CartController')
//dotenv 모듈
const dotenv = require('dotenv');
dotenv.config();

router.use(express.json());

//장바구니 담기
router.post('/', addToCart);

//장바구니 조회 + 장바구니에서 선택한 주문 "예상" 상품 목록 조회
router.get('/', getCartItems);

//장바구니 도서 삭제
router.delete('/:id', removeCartItem);

module.exports = router;