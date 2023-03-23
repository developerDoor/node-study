import express, {Router} from "express"
import cors from "cors";
import helmet from "helmet";
import dayjs from "dayjs";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

let users = [
	{
		id: 1,
		name: "moon",
		age: 12
	},
]

const app = express()


// 어플리케이션 레벨 미들웨어
app.use(express.urlencoded({extended: true, limit: "700mb"})) // 요청 url의 쿼리들 처리
app.use(express.json()) // JSON 처리
app.use(cors({origin:"*"}));
app.use(helmet());

const UserRouter = Router()

// GET /users => 전체 유저를 조회
UserRouter.get('/', (req, res) => {
	res.status(200).json({ users });
});

// GET /users/detail/:id
// 유저 한명을 불러오는 API
UserRouter.get('/detail/:id', (req, res) => {
	const { id } = req.params;

	const user = users.find((user) => user.id === Number(id));

	res.status(200).json({ user });
});

UserRouter.post('/', (req, res) => {
	const { name, age } = req.body;
	users.push({
		id: new Date().getTime(),
		name,
		age,
	});

	res.status(201).json({ users })
});



// req : 요청 -> Request
// res : 응답 -> Response
app.get("/", (req, res) => {
	res.send('NodeJS')
})

app.listen(8000, () => {
	console.log('서버 가동!')
})
