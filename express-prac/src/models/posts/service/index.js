import database from '../../../database';
import { UserService } from "../../users/service";
import { query } from "express";
import { PostDTO, PostsDTO } from "../dto";


export class PostService {
	userService;

	constructor () {
		this.userService = new UserService();
	}

	// 게시글 불러오기
	// searchValue : 검색어
	async getPosts ({ skip, take, }, searchValue) {
		const posts = await database.post.findMany({
			where: {
				title: {
					contains: searchValue ?? "",
				},
			},
			include: {
				user: true,
			},
			skip,
			take,
			orderBy: {
				createdAt: "desc",
			},
		});
		const count = await database.post.count({
			where: {
				title: {
					contains: searchValue,
				},
			},
		});

		return { posts : posts.map((post) => new PostsDTO(post)), count };
	}

	async getPost (id) {
		const post = await database.post.findUnique({
			where: {
				id,
			}, include: {
				user: true,
				comments: {
					include: {
						user: true,
						childComments: {
							include: {
								user: true,
							}
						},
					},
				}, tags: true,
			},
		});

		if (!post) throw  {
			status: 404, message: "게시글을 찾을 수 없습니다.",
		};

		return new PostsDTO(post);
	}

	async createPostLike (userId, postId) {
		const user = await this.userService.findUserById(userId);

		const post = await database.post.findUnique({
			where: {
				id: postId,
			},
		});

		if (!post) throw { status: 404, message: "게시글을 찾을 수 없습니다." };

		const isLiked = await database.postLike.findUnique({
			where: {
				userId_postId: {
					userId: user.id,
					postId: post.id,
				},
			},
		});

		if (isLiked) return;

		await database.postLike.create({
			data: {
				user: {
					connect: {
						id: user.id,
					},
				},
				post: {
					connect: {
						id: post.id,
					},
				},
			},
		});
	}

	async deletePostLike (userId, postId) {
		const user = await this.userService.findUserById(userId);

		const post = await database.post.findUnique({
			where: {
				id: postId,
			},
		});

		if (!post) throw { status: 404, message: "게시글을 찾을 수 없습니다." };

		const isLiked = await database.postLike.findUnique({
			where: {
				userId_postId: {
					userId: user.id,
					postId: post.id,
				},
			},
		});

		if (!isLiked) return;

		await database.postLike.delete({
			where: {
				userId_postId: {
					userId: user.id,
					postId: post.id,
				},
			},
		});
	}

	// isLike 는 좋아요 상태 - 목표

	async postLike (userId, postId, isLike) {
		const user = await this.userService.findUserById(userId);

		const post = await database.post.findUnique({
			where: {
				id: postId,
			},
		});

		if (!post) throw { status: 404, message: "게시글을 찾을 수 없습니다." };

		const isLiked = await database.postLike.findUnique({
			where: {
				userId_postId: {
					userId: user.id,
					postId: post.id,
				},
			},
		});

		// 좋아요를 하는 경우
		if (isLike && !isLiked) {
			await database.postLike.create({
				data: {
					user: {
						connect: {
							id: user.id,
						},
					},
					post: {
						connect: {
							id: post.id,
						},
					},
				},
			});
		}
		// 좋아요를 취소하는 경우
		else if (!isLike && isLiked) {
			await database.postLike.delete({
				where: {
					userId_postId: {
						userId: user.id,
						postId: post.id,
					},
				},
			});
		}
	}

	// props : CreatePostDTO
	async createPost (props) {
		const user = await this.userService.findUserById(props.userId);

		const newPost = await database.post.create({
			data: {
				title: props.title, content: props.content, user: {
					connect: {
						id: user.id,
					},
				}, tags: {
					createMany: {
						data: props.tags.map((tag) => ({ name: tag })),
					},
				},
			},
		});

		return newPost.id;
	}

	// 부모 댓글
	// props : createCommentDTO
	async createComment (props) {
		const user = await this.userService.findUserById(props.userId);

		const post = await database.post.findUnique({
			where: {
				id: props.postId,
			},
		});

		if (!post) throw {
			status: 404, message: "게시글을 찾을 수 없습니다.",
		};

		const newComment = await database.comment.create({
			data: {
				content: props.content, post: {
					connect: {
						id: post.id,
					},
				}, user: {
					connect: {
						id: user.id,
					},
				},
			},
		});
		return newComment.id;
	}

	// 자식 댓글 생성
	// props : CreateChildCommentDTO
	async createChildComment (props) {
		const user = await this.userService.findUserById(props.userId);

		const parentComment = await database.comment.findUnique({
			where: {
				id: props.parentCommentId,
			},
		});

		if (!parentComment) throw {
			status: 404, message: "부모 댓글을 찾을 수 없습니다.",
		};

		const newChildComment = await database.comment.create({
			data: {
				content: props.content, user: {
					connect: {
						id: user.id,
					},
				}, post: {
					connect: {
						id: parentComment.postId,
					},
				}, parentComment: {
					connect: {
						id: parentComment.id,
					},
				},
			},
		});
		return newChildComment.id;
	}


}
