import {Router} from "express";
import {PostService} from "../service";


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
		20분부터 듣자
	}

}

