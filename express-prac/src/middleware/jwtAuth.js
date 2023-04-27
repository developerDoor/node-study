import jwt from 'jsonwebtoken';
import database from '../database'
import dotenv from 'dotenv';
dotenv.config()

export const jwtAuth = async (req, res, next) => {
	try {
		const headers = req.headers;
		const authorization = headers["Authorization"] || headers["authorization"];
		// Bearer ${token} or undefined

		if(authorization?.includes("Bearer") ||
		   authorization?.includes("bearer")
		) {
			if (typeof authorization === "string") {
				const bearers = authorization.split(" ");
				// bearers : ["Bearer", "token~~~"]
				if (bearers.length === 2 && typeof bearers[1] === "string") {
					const accessToken = bearers[1]

					// 만약 여기서 에러 발생한다면 catch로 넘어간다.
					const decodedToken = jwt.verify(accessToken, process.env.JWT_KEY);
					// { id : "~~~" } 이런 형태일 것

					const user = await database.user.findUnique({
						where: {
							id: decodedToken.id,
						},
					});

					if (user) {
						req.user = user;
						next();
					} else {
						next({ status: 404, message: "유저를 찾을 수 없습니다." })
					}
				} else {
					next({ status: 400, message: "Token이 잘못됐습니다."})
				}
			} else {
				next({ status: 400, message: "Token이 잘못됐습니다."})
			}
		} else {
			next()
		}

	} catch (err) {
		next({ ...err, status: 403 })
	}
}
