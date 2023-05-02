import { UsersDto } from "../../users/dto";
import { TagDTO } from './tags';
import { CommentDto } from "./comment";

export class PostDTO {
	id;
	title;
	content;
	createAt;
	user;
	comments;
	tags; // 배열

	constructor (props) {
		this.id = props.id;
		this.title = props.title;
		this.content = props.content;
		this.createAt = props.createAt;
		this.user = new UsersDto(props.user);
		this.comments = props.comments.map((comment) => new CommentDto({
			id: comment.id,
			content: comment.content,
			childComments: comment.childComments,
			user: comment.user,
		}));
		this.tags = props.tags.map((tag) => new TagDTO(
			{
				id: tag.id,
				name: tag.name,
			},
		));
	}
}
