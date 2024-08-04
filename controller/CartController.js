const jwt = require('jsonwebtoken');
const conn = require('../mariadb'); //db 모듈
const ensureAuthorization = require('../auth');
const { StatusCodes } = require('http-status-codes'); //status code 모듈

//장바구니 담기 
const addToCart = (req, res) => {
    const { book_id, quantity } = req.body;

    let authorization = ensureAuthorization(req, res);

    if (authorization instanceof jwt.TokenExpiredError) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            "message": "로그인 세션이 만료되었습니다. 다시 로그인하세요."
        })
    } else if (authorization instanceof jwt.JsonWebTokenError) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            "message": "잘못된 토큰입니다."
        })
    } else {
        let sql = 'INSERT INTO cartItems (book_id, quantity, user_id) values (?, ?, ?)';
        let values = [book_id, quantity, authorization.id];
        conn.query(sql, values,
            (err, results) => {
                if (err) {
                    console.log(err);
                    return res.status(StatusCodes.BAD_REQUEST).end();
                }

                return res.status(StatusCodes.OK).json(results);
            })
    }
};

//장바구니 아이템 목록 조회 + 장바구니에서 선택한 주문 "예상" 상품 목록 조회
const getCartItems = (req, res) => {
    const { selected } = req.body;

    let authorization = ensureAuthorization(req, res);

    if (authorization instanceof jwt.TokenExpiredError) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            "message": "로그인 세션이 만료되었습니다. 다시 로그인하세요."
        })
    } else if (authorization instanceof jwt.JsonWebTokenError) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            "message": "잘못된 토큰입니다."
        })
    } else {
        let sql = "SELECT cartItems.id, book_id, title, summary, quantity, price FROM cartItems LEFT JOIN books ON books.id = cartItems.book_id WHERE cartItems.user_id = ?"
        let values = [authorization.id, selected];

        if (selected) { // 주문서 작성 시 '선택한 장바구니 목록 조회'
            sql += " AND cartItems.id IN (?)";
            values.push(selected)
        }

        conn.query(sql, values, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            return res.status(StatusCodes.OK).json(results);
        })
    }
};

//장바구니 아이템 제거
const removeCartItem = (req, res) => {

    let authorization = ensureAuthorization(req, res);

    if (authorization instanceof jwt.TokenExpiredError) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            "message": "로그인 세션이 만료되었습니다. 다시 로그인하세요."
        })
    } else if (authorization instanceof jwt.JsonWebTokenError) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            "message": "잘못된 토큰입니다."
        })
    } else {
        const cartItemId = req.params.id; //cartItem id

        let sql = "DELETE FROM cartItems WHERE id = ?";
        conn.query(sql, cartItemId,
            (err, results) => {
                if (err) {
                    console.log(err);
                    return res.status(StatusCodes.BAD_REQUEST).end();
                }

                return res.status(StatusCodes.OK).json(results);
            })
    }
}

module.exports = {
    addToCart,
    getCartItems,
    removeCartItem
}