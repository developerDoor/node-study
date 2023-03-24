import express from "express"
import cors from "cors";
import helmet from "helmet";
import Controllers from "./controllers";

const app = express()

// 어플리케이션 레벨 미들웨어
app.use(express.urlencoded({extended: true, limit: "700mb"})) // 요청 url의 쿼리들 처리
app.use(express.json()) // JSON 처리
app.use(cors({origin:"*"}));
app.use(helmet());

Controllers.forEach((controller) => {
	app.use(controller.path, controller.router)
})

// req : 요청 -> Request
// res : 응답 -> Response
app.get("/", (req, res) => {
	res.send('NodeJS')
})

app.use((err, req, res, next) => {
	console.log(err);

	res.status(err.status|| 500).json({message: err.message || "서버에서 에러가 발생했습니다." })
})

app.listen(8000, () => {
	console.log('서버 가동!')
})
