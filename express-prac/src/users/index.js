import { Router } from "express";

// Router
class UserController {
	router; // 컨트롤러의 이점을 활용하기 위해
	users = [
		{
			id: 1,
			name : "moon",
			age : 12,
		},
	];

	constructor() {
		this.router = Router();
		this.init();
	}

	init() {
		this.router.get('/', this.getUsers.bind(this))
		this.router.get('/detail/:id', this.getUser().bind(this))
		this.router.post('/', this.createUser().bind(this))
	}

	getUsers(req, res) {}

	getUser(req, res) {}

	createUser(req, res) {}

}
