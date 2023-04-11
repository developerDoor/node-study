import {Router} from "express";
import {AuthService} from "../service";
import {LoginDto, RegisterDto} from "../dto";

class AuthController {
	authService;
	router;
	path = "/auth";

	constructor () {
		this.router = Router();
		this.authService = new AuthService();
		this.init();
	}

	init() {
		this.router.post('/register', this.register.bind(this))
		this.router.post('/login', this.login.bind(this))
	}

	async register(req, res, next) {
		try {
			const body = req.body;
			const { accessToken, refreshToken } = await this.authService.register(new RegisterDto(body))

			res.status(200).json({
				accessToken,
				refreshToken,
			})
		} catch (err) {
			next(err)
		}
	}

	async login (req, res, next) {
		try {
			const body = req.body

			const { accessToken, refreshToken } = await this.authService.login(
				new LoginDto(body)
			)

			res.status(200).json({
				accessToken,
				refreshToken
			})
		} catch (eer) {
			next(err)
		}
	}

}

const authController = new AuthController();
export default authController;