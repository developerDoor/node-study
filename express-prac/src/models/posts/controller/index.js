import {Router} from "express";
import {PostService} from "../service";
import { CreateChildCommentDto,CreateCommentDto, CreatePostDto} from "../dto";

class PostController {
	router;
	path = "/posts";
	postService;

	constructor () {
		this.router = new Router();
		this.postService = new PostService();
		this.init();
	}
	init(){
		this.router.post('/', this.createPost.bind(this))
		this.router.post('/comments', this.createComment.bind(this))
		this.router.post('/child-comments', this.createChildComment.bind(this))
	}

	async createPost(req, res, next) {
		try {
			if(!req.user) throw { status: 401, message: "로그인을 진행해주세요"}
			const body = req.body;

			const newPostId = await this.postService.createPost(new CreatePostDto(
				{
					title: body.title,
					content: body.content,
					tags: body.tags,
					userId: req.user.id,
				}
			));

			res.status(201).json({ id: newPostId })
		} catch (err) {
			next(err)
		}
	}

	async createComment(req, res, next) {
		try {
			if(!req.user) throw { status: 401, message: "로그인을 진행해주세요"}
			const body = req.body;

			const newCommentId = await this.postService.createComment(new CreateCommentDto({
				content: body.content,
				postId: body.postId,
				userId: req.user.id,
			})
			);
			res.status(201).json({ id: newCommentId })
		} catch (err) {
			next(err)
		}
	}
	async createChildComment(req, res, next) {
		try {
			if(!req.user) throw { status: 401, message: "로그인을 진행해주세요"}
			const body = req.body;

			const newChildCommentId = await this.createChildComment(new CreateChildCommentDto({
				content: body.content,
				parentCommentId: body.parentCommentId,
				userId: req.user.id,
			}))

			res.status(201).json({ id: newChildCommentId })
		} catch (err) {
			next(err)
		}
	}
}

const postController = new PostController();

export default postController;
