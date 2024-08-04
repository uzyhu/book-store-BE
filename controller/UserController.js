const conn = require('../mariadb'); //db 모듈
const { StatusCodes } = require('http-status-codes'); //status code 모듈
const jwt = require('jsonwebtoken'); // jwt 모듈
const crypto = require('crypto'); //crypto 모듈 : 암호화
const dotenv = require('dotenv'); //dotenv 모듈
dotenv.config();

const join = (req, res) => {
    const { email, password } = req.body;

    let sql = 'INSERT INTO users (email, password, salt) VALUES (?,?,?)';

    //비밀번호 암호화 (근데 복호화가 안됨)
    //회원가입 시 비밀번호를 암호화해서 암호화된 비밀번호와, salt 값을 같이 DB에 저장
    const salt = crypto.randomBytes(10).toString('base64'); //64길이로.. base64 방식의 문자열?
    const hashPassword = crypto.pbkdf2Sync(password, salt, 10000, 10, 'sha512').toString('base64');

    let values = [email, hashPassword, salt];
    conn.query(sql, values,
        (err, results) => {
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end(); //BAD REQUEST
            }

            if (results.affectedRows == 1) {
                return res.status(StatusCodes.CREATED).json(results);
            } else {
                return res.status(StatusCodes.BAD_REQUEST).end();
            }
        })
}

const login = (req, res) => {
    const { email, password } = req.body;

    let sql = 'SELECT * FROM users WHERE email = ?';
    conn.query(sql, email,
        (err, results) => {
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end(); //BAD REQUEST
            }

            const loginUser = results[0];

            //salt값 꺼내서 날 것으로 들어온 비밀번호를 암호화 해보고
            const hashPassword = crypto.pbkdf2Sync(password, loginUser.salt, 10000, 10, 'sha512').toString('base64');
            //=> 디비 비밀번호랑 비교
            if (loginUser && loginUser.password == hashPassword) {
                const token = jwt.sign({ //token 발행
                    id: loginUser.id,
                    email: loginUser.email,
                }, process.env.PRIVATE_KEY, {
                    expiresIn: '10m',
                    issuer: 'zyzy'
                });

                //토큰 쿠키에 담기
                res.cookie("token", token, {
                    httpOnly: true
                });
                console.log(token);

                return res.status(StatusCodes.OK).json(results);
            } else {
                return res.status(StatusCodes.UNAUTHORIZED).end(); //401 : Unauthorized,403 : Forbidden (접근 권리 없음, 그사람이 누군지 알고 있다)
            }
        })
}

const passwordResetRequest = (req, res) => {
    const { email, password } = req.body;

    let sql = 'SELECT * FROM users WHERE email = ?';
    conn.query(sql, email,
        (err, results) => {
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end() //BAD REQUEST
            }

            //이메일로 유저가 있는지 찾아봅니다!
            const user = results[0];

            if (user) {
                return res.status(StatusCodes.OK).json({
                    email: email
                });
            } else {
                return res.status(StatusCodes.UNAUTHORIZED).end();
            }
        })
}

const passwordReset = (req, res) => {
    const { email, password } = req.body;

    let sql = 'UPDATE users SET password=?, salt=? WHERE email=?';

    const salt = crypto.randomBytes(10).toString('base64'); //64길이로.. base64 방식의 문자열?
    const hashPassword = crypto.pbkdf2Sync(password, salt, 10000, 10, 'sha512').toString('base64');

    let values = [hashPassword, salt, email];
    conn.query(sql, values,
        (err, results) => {
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }
            if (results.affectedRows == 0) { //update은 affectedrows로 확인!
                return res.status(StatusCodes.BAD_REQUEST).end();
            }
            else {
                return res.status(StatusCodes.OK).json(results);
            }
        })
}

module.exports = {
    join,
    login,
    passwordResetRequest,
    passwordReset
}