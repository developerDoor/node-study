import { UsersDto } from "../../users/dto";
import { TagDTO } from './tags';
import { CommentDto } from "./comment";

export class PostsDTO {
	id;
	title;
	content;
	createAt;
	user;
	constructor (props) {
		this.id = props.id;
		this.title = props.title;
		this.content = props.content;
		this.createAt = props.createAt;
		this.user = new UsersDto(props.user);
	}
}
