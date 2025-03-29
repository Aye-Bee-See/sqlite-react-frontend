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

		this.displayTable = this.displayTable.bind(this);

		this.state = {
			prisoners: [],
			rules: [],
			prisons: [],
			chats: [],
			users: [],
			messages: [],
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
				this.getAllPrisoners();
				this.getAllUsers();
				this.getAllPrisons();
				this.getAllRules();
				//this.getAllChapters();
			});
		} catch (error) {
			console.error('Invalid token format:', error);
		}
	}

	componentDidUpdate(prevProps, prevState) {}

	getAllPrisoners() {
		PrisonerNetworkService.getAll(this.state.token).then((response) => {
			this.setState({ prisoners: Object.values(response.data.data) });
		});
	}

	getAllUsers() {
		UserNetworkService.getAll(this.state.token).then((response) => {
			this.setState({ users: Object.values(response.data.data) });
		});
	}

	getAllPrisons() {
		PrisonNetworkService.getAll(this.state.token).then((response) => {
			this.setState({ prisons: Object.values(response.data.data) });
		});
	}

	getAllRules() {
		RuleNetworkService.getAll(this.state.token).then((response) => {
			this.setState({ rules: Object.values(response.data.data) });
		});
	}

	/*
  getAllChapters() {
          ChapterNetworkService.getAll(this.state.token).then((response) => {
                  this.setState({ chapters: Object.values(response.data.data) });
          });
  }*/

	displayTable(subject) {
		let singularSubject = subject.slice(0, -1);
		return (
			<Card>
				<CardHeader>
					<h3>{subject}</h3>
				</CardHeader>
				<CardSubtitle></CardSubtitle>
				<CardText className="p-3" tag="span">
					<Table bordered hover responsive>
						{this.state[subject].slice(0, 1).map((obj, index) => (
							<tr key={index}>
								{Object.entries(obj).map(([key, value]) => (
									<th key="title">
										<strong>{key}</strong>
									</th>
								))}
							</tr>
						))}

						{this.state[subject].slice(-5).map((obj, index) => (
							<tr key={index}>
								{Object.entries(obj).map(([key, value]) => (
									<td key={key}>
										<Link to={`/${singularSubject}/${obj.id}`}>
											{JSON.stringify(value, 2, null)}
										</Link>
									</td>
								))}
							</tr>
						))}
					</Table>
				</CardText>
			</Card>
		);
	}

	render() {
		//const jsonData = JSON.stringify(this.state, null, 2);
		return (
			<>
				<Row>
					<h1>Home</h1>
				</Row>
				<Col md={10}>
					{this.displayTable('prisons')}
					{this.displayTable('prisoners')}
					{this.displayTable('rules')}
					{this.displayTable('chats')}
					{this.displayTable('users')}
					<pre>
						<hr />
					</pre>
					<p className="text-danger">{this.state.errorText}</p>
				</Col>
			</>
		);
	}
}
