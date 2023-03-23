import express from "express"
import cors from "cors";
import helmet from "helmet";
import dayjs from "dayjs";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

let users = [
	{
		id: 1,
		name: "moon",
		age: 29
	},
]

const app = express()


// 어플리케이션 레벨 미들웨어
app.use(express.urlencoded({extended: true, limit: "700mb"})) // 요청 url의 쿼리들 처리
app.use(express.json()) // JSON 처리
app.use(cors({origin:"*"}));
app.use(helmet());

// dayjs 사용 예시
// const today = new Date();
// const todayToDayjs = dayjs(today).format("YYYY-MM-DD");
// console.log(todayToDayjs);

// GET Method
// 유저 정보 가져오기;
// 요청 정보 -> query or Path
// 성공 status : 200
app.get("/users", (req, res) => {
	res.status(200).json({ users });
});

// POST Method
// 유저 생성
// 요청 정보 -> body
// 성공 status : 201
app.post("/users", (req, res) => {
	const { name, age } = req.body
	users.push({
		id: new Date().getTime(),
		name,
		age
	})
	res.status(201).json({ users });
});

// PATCH Method
// 유저 수정
// 성공 status : 204
// req.params.id
// 요청 -> body
app.patch("/users/:id", (req, res) => {
	const { id } = req.params
	const { name, age } = req.body
	const targetUserIdx = users.findIndex((user) => user.id === Number(id)) // Number붙이는 이유는 req.params로 들어오는건 문자열로 들어오기 때문에 형변환 해준다.

	users[targetUserIdx] = {
		id : users[targetUserIdx].id,
		name : name ?? users[targetUserIdx].name, //Patch는 일부만 수정이 가능하기 때문에 name과 age중 없는것이 있을 수 있다.
		age : age ?? users[targetUserIdx].age,
	}
	res.status(204).json({})
});

// DELETE Method
// 유저 삭제
// 성공 status : 204
app.delete("/users/:id", (req, res) => {
	const {id} = req.params;

	const deletedUsers = users.filter((user) => user.id !== Number(id));
	users = deletedUsers;
	res.status(204).json({})
});

app.get("/", (req, res) => {
	res.send('NodeJS')
})

app.listen(8000, () => {
	console.log('서버 가동!')
})
