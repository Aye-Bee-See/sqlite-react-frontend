import React, { Component } from 'react';
import PrisonerNetworkService from '../../services/prisoner-network-service';
import UserNetworkService from '../../services/user-network-service';
import PrisonNetworkService from '../../services/prison-network-service';
import RuleNetworkService from '../../services/rule-network-service';
import MessageNetworkService from '../../services/messaging-network-service';
import ChatNetworkService from '../../services/chat-network-service';

import Login from '../home/login.component.old';
import { Link } from 'react-router-dom';
import {
	Button,
	Card,
	CardHeader,
	CardSubtitle,
	CardText,
	Col,
	Container,
	Input,
	InputGroup,
	List,
	ListGroup,
	ListGroupItem,
	Row,
	Table
} from 'reactstrap';
import Item from '../individual/item.component';
import fields from '../../global_vars/fields';

export default class Home extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			searchName: '',
			token: '',
			errorText: ''
		};
	}

	componentDidMount() {
		try {
			const token =
				typeof this.props.token === 'string' && this.props.token.startsWith('{')
					? JSON.parse(this.props.token)
					: this.props.token;
			this.setState({ token: token['token'] || token }, () => {
			});
		} catch (error) {
			console.error('Invalid token format:', error);
		}
	}

	componentDidUpdate(prevProps, prevState) {}

	render() {
		//const jsonData = JSON.stringify(this.state, null, 2);
		return (
			<>
				<Row>
					<h1>Welcome!</h1>
					<h2>Do you have trouble sending letters to prisoners? Coordinating with support crews?</h2>
					<p>Login or create an account to get started.</p>
				</Row>
				<Col md={10}>
					<pre>
						<hr />
					</pre>
					<p className="text-danger">{this.state.errorText}</p>
				</Col>
			</>
		);
	}
}
