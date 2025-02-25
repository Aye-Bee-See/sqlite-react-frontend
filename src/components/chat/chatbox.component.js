import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

class ChatBox extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const { messages } = this.props;

		return (
			<div className="container border rounded p-3">
				{messages.map((message, index) => (
					<div
						key={index}
						className={`d-flex mb-3 ${message.sender === 'prisoner' ? 'justify-content-start' : 'justify-content-end'}`}
					>
						<div
							className={`p-2 rounded ${message.sender === 'prisoner' ? 'bg-light' : 'bg-primary text-white'}`}
						>
							<div>{message.messageText}</div>
							<div className="small text-muted">{message.createdAt}</div>
						</div>
					</div>
				))}
			</div>
		);
	}
}

export default ChatBox;
