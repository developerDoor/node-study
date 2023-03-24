import express, {Router} from "express"
import cors from "cors";
import helmet from "helmet";
import dayjs from "dayjs";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
//import UserController from './users'
import Controllers from "./controllers";


const app = express()

// 어플리케이션 레벨 미들웨어
app.use(express.urlencoded({extended: true, limit: "700mb"})) // 요청 url의 쿼리들 처리
app.use(express.json()) // JSON 처리
app.use(cors({origin:"*"}));
app.use(helmet());

// app.use('/users', UserController.router);
Controllers.forEach((controller) => {
	app.use(controller.path, controller.router)
})

// req : 요청 -> Request
// res : 응답 -> Response
app.get("/", (req, res) => {
	res.send('NodeJS')
})

app.listen(8000, () => {
	console.log('서버 가동!')
})
