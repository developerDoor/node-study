const defaultSwagger = {
	openapi: "3.0.0",
	info: {
		version: "1.0.0",
		title: "스웨거 연습",
		description: "스웨거 연습 페이지입니다."
	},
	component: {
		securitySchemes: {
			bearerAuth: {
				type: "http",
				scheme: "bearer",
				bearerFormat: "JWT",
			}
		}
	}
}

export default defaultSwagger
