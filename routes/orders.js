//express 모듈
const express =  require('express');
const router = express.Router(); //라우팅 당하는 입장

//dotenv 모듈
const dotenv = require('dotenv');
const { order, getOrders, getOrderDetail } = require('../controller/OrderController');
dotenv.config();

router.use(express.json());

//결제하기 = 주문하기 = 주문 등록 = 데이터베이스 주문 insert
router.post('/', order);

//주문 목록(내역) 조회
router.get('/', getOrders);

//주문 상세 상품 조회
router.get('/:id', getOrderDetail);

module.exports = router;