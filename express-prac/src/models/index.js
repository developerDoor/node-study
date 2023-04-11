import { AuthController, AuthSwagger } from './auth'
import { UserController, UserSwagger } from './users'

export const Controllers = [AuthController, UserController];
export const Swaggers = {
	UserSwagger,
	AuthSwagger,
}
