import { UsersDto } from "../../../users/dto";

export class CommentDto {
	id;
	content;
	user;
	childComments;

	constructor(props) {
		this.id = props.id;
		this.content = props.content;
		this.user = new UsersDto(props.user);
		this.childComments = props.childComments?.map((comment)=> new CommentDto(comment))
	}
}
