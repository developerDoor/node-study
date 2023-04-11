import {UserService} from "../../users/service";
import {CreateUserDto} from "../../users/dto";
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();

export class AuthService {
	userService;

	constructor () {
		this.userService = new UserService();
	}

	// props : RegisterDTO
	async register(props) {
		const isExist = await this.userService.checkUserByEmail(props.email)

		if(isExist) throw { status: 400, message: "이미 존재하는 이메일입니다."}

		const newUserId = await this.userService.createUser(
			new CreateUserDto(
				{
					...props,
					password: await props.hashPassword()
				}
			)
		)

		const accessToken = jwt.sign({ id : newUserId }, process.env.JWT_KEY, {
			// 옵션
			expiresIn: "2h",
		});

		const refreshToken = jwt.sign({ id : newUserId }, process.env.JWT_KEY, {
			// 옵션
			expiresIn: "14d",
		});
		console.log({ accessToken, refreshToken })
		return { accessToken, refreshToken }
	}

	// props : loginDTO
	async login(props) {
		const isExist = await this.userService.checkUserByEmail(props.email);

		if (!isExist) throw { status: 404, message: "유저가 존재하지 않습니다."};

		const isCorrect = await props.comparePassword(isExist.password);

		if (!isCorrect) throw { status: 400, message: "비밀번호를 잘못 입력하였습니다."}

		const accessToken = jwt.sign({ id : isExist.id }, process.env.JWT_KEY, {
			// 옵션
			expiresIn: "2h",
		});

		const refreshToken = jwt.sign({ id : isExist.id }, process.env.JWT_KEY, {
			// 옵션
			expiresIn: "14d",
		});

		return {
			accessToken,
			refreshToken
		}
	}
}