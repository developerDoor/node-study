/*
 * 우리가 생각하는 페이지네이션
 * skip: 생략할 개수
 * take: 가져올 개수
 *
 * 실제로 프런트에서는
 * 페이지번호와 가져올 데이터 개수를 보내준다.
 * URL : ~~~/posts?page=1&limit=20
 * req.query // { page : 1, limit : 20 }
 * page : 페이지 번호
 * limit : 가져올 개수
 * take === limit
 *
 * 만약에
 * page : 1
 * limit : 20
 * -> skip : 0, take : 20
 *
 * page : 2
 * limit : 20
 * -> skip : 20, take : 20
 *
 * skip = (page - 1) * limit
 */

// export const getSkipTake = (page, limit) => {
// 	const page = page ?? "1" // req.query는 기본적으로 string, 없으면 undefined
// 	const limit = limit ?? "20";
// 	const take = Number(limit) || 20;
// 	const skip = (Number(page) - 1) * take;
// 	return {
// 		skip,
// 		take,
// 	};
// }
