import React, { Component } from 'react';
import PrisonerNetworkService from '../../services/prisoner-network-service';
import UserNetworkService from '../../services/user-network-service';
import PrisonNetworkService from '../../services/prison-network-service';
import RuleNetworkService from '../../services/rule-network-service';
import MessageNetworkService from '../../services/messaging-network-service';
import ChatNetworkService from '../../services/chat-network-service';
import { Link } from 'react-router-dom';
import InputForm from './inputform.component';
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
	Row
} from 'reactstrap';
import fields from '../../global_vars/fields';
import Item from '../individual/item.component';
import ChatBox from '../chat/chatbox.component';
import ChapterNetworkService from '../../services/chapter-network-service';

class ListPage extends Component {
	constructor(props) {
		super(props);

		this.state = {
			currentPrisoner: null,
			currentUser: null,
			currentPrison: null,
			currentRule: null,
			currentChapter: null,
			currentMessageUserOrPrisoner: null,
			currentChat: null,
			currentIndex: -1,
			prisoners: [],
			users: [],
			prisons: [],
			rules: [],
			chapters: [],
			searchName: '',
			token: '',
			errorText: '',
			prisonersByPrison: [],
			messageType: 'User',
			chats: [],
			messages: [],
			page: 1,
			page_size: 10
		};

		this.getAllPrisoners = this.getAllPrisoners.bind(this);
		this.getAllUsers = this.getAllUsers.bind(this);
		this.getAllPrisons = this.getAllPrisons.bind(this);
		this.getAllRules = this.getAllRules.bind(this);
		this.getAllChapters = this.getAllChapters.bind(this);
		this.getPrisonersByPrison = this.getPrisonersByPrison.bind(this);
		this.getChatsByUserOrPrisoner = this.getChatsByUserOrPrisoner.bind(this);
		this.getMessagesByChat = this.getMessagesByChat.bind(this);
		this.onChangeMessageType = this.onChangeMessageType.bind(this);
		this.setActiveMessageUserOrPrisoner = this.setActiveMessageUserOrPrisoner.bind(this);

		this.setActivePrisoner = this.setActivePrisoner.bind(this);
		this.setActivePrison = this.setActivePrison.bind(this);
		this.setActiveUser = this.setActiveUser.bind(this);
		this.setActiveRule = this.setActiveRule.bind(this);
		this.setActiveChat = this.setActiveChat.bind(this);
		this.setActiveChapter = this.setActiveChapter.bind(this);

		this.onChangeSearchName = this.onChangeSearchName.bind(this);
		this.handleDataFromChild = this.handleDataFromChild.bind(this);
		this.displayFields = this.displayFields.bind(this);
		this.listData = this.listData.bind(this);
		this.editButton = this.editButton.bind(this);
		this.deleteItem = this.deleteItem.bind(this);
		this.handlePageChange = this.handlePageChange.bind(this);
		this.handlePageSizeChange = this.handlePageSizeChange.bind(this);
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
				this.getAllChapters();
			});
		} catch (error) {
			console.error('Invalid token format:', error);
		}
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevState.searchName !== this.state.searchName) {
			this.listData();
		}
	}

	getAllPrisoners() {
		const { token, page, page_size } = this.state;
		PrisonerNetworkService.getAll(token, page_size, page).then((response) => {
			this.setState({ prisoners: Object.values(response.data.data) });
		});
	}

	getAllUsers() {
		const { token, page, page_size } = this.state;
		UserNetworkService.getAll(token, page_size, page).then((response) => {
			this.setState({ users: Object.values(response.data.data) });
		});
	}

	getAllPrisons() {
		const { token, page, page_size } = this.state;
		PrisonNetworkService.getAll(token, page_size, page).then((response) => {
			this.setState({ prisons: Object.values(response.data.data) });
		});
	}

	getAllRules() {
		const { token, page, page_size } = this.state;
		RuleNetworkService.getAll(token, page_size, page).then((response) => {
			this.setState({ rules: Object.values(response.data.data) });
		});
	}

	getAllChapters() {
		const { token, page, page_size } = this.state;
		ChapterNetworkService.getAll(token, page_size, page).then((response) => {
			this.setState({ chapters: Object.values(response.data.data) });
		});
	}

	getPrisonersByPrison(prison_id, token) {
		PrisonerNetworkService.getByPrison(prison_id, token)
			.then((response) => {
				this.setState({ prisonersByPrison: Object.values(response.data.data) }, () => {
					console.log(this.state.prisonersByPrison);
				});
			})
			.catch((error) => {
				console.error(`Error fetching prisoners by prison:`, error.message);
			});
	}

	getChatsByUserOrPrisoner(user, prisoner) {
		const { token, page, page_size } = this.state;
		ChatNetworkService.getChatsByUserOrPrisoner(user, prisoner, token, page, page_size)
			.then((response) => {
				this.setState({ chats: Object.values(response.data.data) }, () => {
					console.log(this.state.chats);
				});
			})
			.catch((error) => {
				console.error(`Error fetching chats:`, error.message);
			});
	}

	getMessagesByChat(chatId) {
		MessageNetworkService.getMessagesByChat(chatId, this.state.token).then((response) => {
			this.setState({ messages: response.data.data }, () => {
				console.log(this.state.messages);
			});
		});
	}

	handlePageChange(direction) {
		this.setState(
			(prevState) => ({ page: prevState.page + direction }),
			() => {
				if (this.props.subject === 'Message') {
					if (this.state.messageType === 'User') {
						this.getAllUsers();
					} else {
						this.getAllPrisoners();
					}
				} else {
					this.fetchData();
				}
			}
		);
	}

	handlePageSizeChange(e) {
		this.setState({ page_size: parseInt(e.target.value), page: 1 }, () => {
			if (this.props.subject === 'Message') {
				if (this.state.messageType === 'User') {
					this.getAllUsers();
				} else {
					this.getAllPrisoners();
				}
			} else {
				this.fetchData();
			}
		});
	}

	onChangeMessageType(e) {
		this.setState(
			{ messageType: e.target.value, currentMessageUserOrPrisoner: null, chats: [], page: 1 },
			() => {
				if (this.state.messageType === 'User') {
					this.getAllUsers();
				} else {
					this.getAllPrisoners();
				}
			}
		);
	}

	setActiveMessageUserOrPrisoner(item, index) {
		this.setState({ currentMessageUserOrPrisoner: item, currentIndex: index, page: 1 }, () => {
			if (this.state.messageType === 'User') {
				this.getChatsByUserOrPrisoner(item.id, null);
			} else {
				this.getChatsByUserOrPrisoner(null, item.id);
			}
		});
	}

	setActiveChat(item, index) {
		this.setState({ currentChat: item, currentIndex: index }, () => {
			this.getMessagesByChat(item.id);
		});
	}

	deleteItem() {
		switch (this.props.subject) {
			case 'Prisoner': {
				const { id } = this.state.currentPrisoner;
				PrisonerNetworkService.deleteOne(id, this.state.token)
					.then((response) => {
						if (response.data.data === 1) {
							this.setState((prevState) => ({
								prisoners: prevState.prisoners.filter((prisoner) => prisoner.id !== id),
								currentPrisoner: null,
								currentIndex: -1
							}));
						} else {
							this.setState({ errorText: `Unable to delete ${this.props.subject}` });
						}
					})
					.catch((error) => {
						console.error(`Error deleting ${this.props.subject}:`, error.message);
						this.setState({ errorText: error.message });
					});
				break;
			}
			case 'Prison': {
				const { id } = this.state.currentPrison;
				PrisonNetworkService.deleteOne(id, this.state.token)
					.then((response) => {
						if (response.data.data === 1) {
							this.setState((prevState) => ({
								prisons: prevState.prisons.filter((prison) => prison.id !== id),
								currentPrison: null,
								currentIndex: -1
							}));
						} else {
							this.setState({ errorText: `Unable to delete ${this.props.subject}` });
						}
					})
					.catch((error) => {
						console.error(`Error deleting ${this.props.subject}:`, error.message);
						this.setState({ errorText: error.message });
					});
				break;
			}
			case 'Rule': {
				const { id } = this.state.currentRule;
				RuleNetworkService.deleteOne(id, this.state.token)
					.then((response) => {
						if (response.data.data === 1) {
							this.setState((prevState) => ({
								rules: prevState.rules.filter((rule) => rule.id !== id),
								currentRule: null,
								currentIndex: -1
							}));
						} else {
							this.setState({ errorText: `Unable to delete ${this.props.subject}` });
						}
					})
					.catch((error) => {
						console.error(`Error deleting ${this.props.subject}:`, error.message);
						this.setState({ errorText: error.message });
					});
				break;
			}
			case 'Chapter': {
				const { id } = this.state.currentChapter;
				ChapterNetworkService.deleteOne(id, this.state.token)
					.then((response) => {
						if (response.data.data === 1) {
							this.setState((prevState) => ({
								chapters: prevState.chapters.filter((chapter) => chapter.id !== id),
								currentChapter: null,
								currentIndex: -1
							}));
						} else {
							this.setState(`Unable to delete ${this.props.subject}`);
						}
					})
					.catch((error) => {
						console.error(`Error deleting ${this.props.subject}:`, error.message);
						this.setState({ errorText: error.message });
					});
			}
			default: {
			}
		}
	}

	listData() {
		const { searchName, messageType } = this.state;
		const filterItems = (items, displayField) => {
			return items.filter((item) => {
				if (searchName.length >= 3) {
					return Object.values(item).some(
						(value) => value && value.toString().toLowerCase().includes(searchName.toLowerCase())
					);
				}
				return true;
			});
		};

		if (this.props.subject === 'Message') {
			const items = messageType === 'User' ? this.state.users : this.state.prisoners;
			const filteredItems = filterItems(items);
			return filteredItems.map((item, index) => (
				<Item
					key={item.id}
					settingFunction={this.setActiveMessageUserOrPrisoner}
					individual={item}
					index={index}
					toDisplay={messageType === 'User' ? 'username' : 'chosenName'}
					currentIndex={this.state.currentIndex}
				/>
			));
		}

		switch (this.props.subject) {
			case 'Prisoner': {
				const filteredPrisoners = filterItems(this.state.prisoners, 'chosenName');
				return filteredPrisoners.map((prisoner, index) => (
					<Item
						key={prisoner.id}
						settingFunction={this.setActivePrisoner}
						individual={prisoner}
						index={index}
						toDisplay="chosenName"
						currentIndex={this.state.currentIndex}
					/>
				));
			}
			case 'User': {
				const filteredUsers = filterItems(this.state.users, 'username');
				return filteredUsers.map((user, index) => (
					<Item
						key={user.id}
						settingFunction={this.setActiveUser}
						individual={user}
						index={index}
						toDisplay="username"
						currentIndex={this.state.currentIndex}
					/>
				));
			}
			case 'Prison': {
				const filteredPrisons = filterItems(this.state.prisons, 'prisonName');
				return filteredPrisons.map((prison, index) => (
					<Item
						key={prison.id}
						settingFunction={this.setActivePrison}
						individual={prison}
						index={index}
						toDisplay="prisonName"
						currentIndex={this.state.currentIndex}
					/>
				));
			}
			case 'Rule': {
				const filteredRules = filterItems(this.state.rules, 'title');
				return filteredRules.map((rule, index) => (
					<Item
						key={rule.id}
						settingFunction={this.setActiveRule}
						individual={rule}
						index={index}
						toDisplay="title"
						currentIndex={this.state.currentIndex}
					/>
				));
			}
			case 'Chapter': {
				const filteredChapters = filterItems(this.state.chapters, 'name');
				return filteredChapters.map((rule, index) => (
					<Item
						key={rule.id}
						settingFunction={this.setActiveChapter}
						individual={rule}
						index={index}
						toDisplay="name"
						currentIndex={this.state.currentIndex}
					/>
				));
			}
			default: {
				return null;
			}
		}
	}

	editButton() {
		switch (this.props.subject) {
			case 'Prisoner': {
				return this.state.currentPrisoner && `/prisoner/${this.state.currentPrisoner.id}`;
			}
			case 'User': {
				return this.state.currentUser && `/user/${this.state.currentUser.id}`;
			}
			case 'Prison': {
				return this.state.currentPrison && `/prison/${this.state.currentPrison.id}`;
			}
			case 'Rule': {
				return this.state.currentRule && `/rule/${this.state.currentRule.id}`;
			}
			case 'Chapter': {
				return this.state.currentChapter && `/chapter/${this.state.currentChapter.id}`;
			}
		}
	}

	async handleDataFromChild(item) {
		switch (this.props.subject) {
			case 'Prisoner': {
				this.setState((prevState) => ({ prisoners: [...prevState.prisoners, item] }));
				break;
			}
			case 'User': {
				this.setState((prevState) => ({ users: [...prevState.users, item] }));
				break;
			}
			case 'Prison': {
				this.setState((prevState) => ({ prisons: [...prevState.prisons, item] }));
				break;
			}
			case 'Rule': {
				this.setState((prevState) => ({ rules: [...prevState.rules, item] }));
				break;
			}
			case 'Message': {
				this.setState((prevState) => ({ messages: [...prevState.messages, item] }));
			}
			case 'Chapter': {
				this.setState((prevState) => ({ chapters: [...prevState.chapters, item] }));
			}
			default: {
				console.error('Unknown subject:', this.props.subject);
			}
		}
	}

	setActivePrisoner(prisoner, index) {
		console.log(prisoner);
		this.setState({ currentPrisoner: prisoner, currentIndex: index });
	}

	setActiveUser(user, index) {
		this.setState({ currentUser: user, currentIndex: index });
	}

	setActivePrison(prison, index) {
		this.setState({ currentPrison: prison, currentIndex: index }, () => {
			this.getPrisonersByPrison(prison.id, this.state.token);
		});
	}

	setActiveRule(rule, index) {
		this.setState({ currentRule: rule, currentIndex: index });
	}

	setActiveChapter(chapter, index) {
		this.setState({ currentChapter: chapter, currentIndex: index });
	}

	onChangeSearchName(e) {
		const searchName = e.target.value;
		this.setState({ searchName: searchName });
	}

	displayFields(
		currentPrisoner,
		currentUser,
		currentPrison,
		currentRule,
		currentChat,
		currentChapter
	) {
		const renderFields = (subject, currentItem) => {
			return Object.keys(fields[subject]).map((key) => {
				const field = fields[subject][key];
				if (field.meta && field.subFields) {
					return (
						<div key={key}>
							<strong>{field.title}:</strong>
							{Object.keys(field.subFields).map((subKey) => {
								return (
									<div key={subKey} style={{ marginLeft: '20px' }}>
										<strong>{field.subFields[subKey].title}:</strong> {currentItem[key][subKey]}
									</div>
								);
							})}
						</div>
					);
				} else if (key === 'avatar' && currentItem[key]) {
					const avatarUrl = `http://localhost:3000/${currentItem[key]}`;
					return (
						<div key={key}>
							<strong>{field.title}:</strong> {currentItem[key]}
							<br />
							<img
								src={avatarUrl}
								alt="Avatar"
								style={{ width: '50px', height: '50px', borderRadius: '50%', marginTop: '5px' }}
							/>
						</div>
					);
				} else if (field.title === 'Prison') {
					// Check if the prison exists in the list of prisons
					const prison = this.state.prisons.find((prison) => prison.id === currentItem[key]);
					return (
						<div key={key}>
							<strong>{field.title}:</strong>{' '}
							{prison ? (
								<Link to={`/prison/${prison.id}`}>{prison.prisonName}</Link>
							) : (
								<span>{currentItem[key]}</span> // Fallback to displaying the prison ID
							)}
						</div>
					);
				} else {
					return (
						<div key={key}>
							<strong>{field.title}:</strong> {currentItem[key]}
						</div>
					);
				}
			});
		};

		if (this.props.subject === 'Prisoner' && currentPrisoner) {
			return renderFields('Prisoner', currentPrisoner);
		} else if (this.props.subject === 'User' && currentUser) {
			return renderFields('User', currentUser);
		} else if (this.props.subject === 'Prison' && currentPrison) {
			return renderFields('Prison', currentPrison);
		} else if (this.props.subject === 'Rule' && currentRule) {
			return renderFields('Rule', currentRule);
		} else if (this.props.subject === 'Message' && currentChat) {
			return renderFields('Chat', currentChat);
		} else if (this.props.subject === 'Chapter' && currentChapter) {
			return renderFields('Chapter', currentChapter);
		} else {
			return null;
		}
	}

	getNetworkService(subject) {
		switch (subject) {
			case 'Prisoner':
				return PrisonerNetworkService;
			case 'User':
				return UserNetworkService;
			case 'Prison':
				return PrisonNetworkService;
			case 'Rule':
				return RuleNetworkService;
			case 'Message':
				return MessageNetworkService;
			case 'Chat':
				return ChatNetworkService;
			case 'Chapter':
				return ChapterNetworkService;
			default:
				throw new Error('Invalid subject');
		}
	}

	handlePageChange(direction) {
		this.setState(
			(prevState) => ({ page: prevState.page + direction }),
			() => {
				if (this.props.subject === 'Message') {
					if (this.state.messageType === 'User') {
						this.getAllUsers();
					} else {
						this.getAllPrisoners();
					}
				} else {
					this.fetchData();
				}
			}
		);
	}

	handlePageSizeChange(e) {
		this.setState({ page_size: parseInt(e.target.value), page: 1 }, () => {
			if (this.props.subject === 'Message') {
				if (this.state.messageType === 'User') {
					this.getAllUsers();
				} else {
					this.getAllPrisoners();
				}
			} else {
				this.fetchData();
			}
		});
	}

	render() {
		const {
			searchName,
			currentPrisoner,
			currentUser,
			currentPrison,
			currentRule,
			currentChat,
			currentIndex,
			currentChapter,
			prisonersByPrison,
			messageType,
			chats,
			currentMessageUserOrPrisoner,
			messages,
			page,
			page_size
		} = this.state;
		var editLink = this.editButton();

		return (
			<Container>
				<Row>
					<h1>{this.props.subject}s</h1>
				</Row>
				<Row>
					<Col md="8">
						<InputGroup className="pb-3">
							<Input
								id="searchName"
								name="searchName"
								type="text"
								className="form-control"
								placeholder="Search by name"
								value={searchName}
								onChange={this.onChangeSearchName}
							/>
						</InputGroup>
					</Col>
				</Row>
				{this.props.subject === 'Message' && (
					<Row>
						<Col md="8">
							<InputGroup className="pb-3">
								<Input type="select" value={messageType} onChange={this.onChangeMessageType}>
									<option value="User">User</option>
									<option value="Prisoner">Prisoner</option>
								</Input>
							</InputGroup>
						</Col>
					</Row>
				)}
				<List className="row">
					<div className="col-md-6">
						<ListGroup>{this.listData()}</ListGroup>
						<Button color="danger" className="m-3">
							Remove All
						</Button>
					</div>
					<Col md={6}>
						{currentPrisoner ||
						currentUser ||
						currentPrison ||
						currentRule ||
						currentMessageUserOrPrisoner ||
						currentChat ||
						currentChapter ? (
							<>
								{currentMessageUserOrPrisoner && chats.length > 0 && (
									<Card className="mt-3">
										<CardHeader>
											Chats for{' '}
											{messageType === 'User'
												? currentMessageUserOrPrisoner.username
												: currentMessageUserOrPrisoner.chosenName}
										</CardHeader>
										<CardText className="p-3" tag="span">
											<ListGroup>
												{chats.map((chat, index) => (
													<Item
														key={chat.id}
														settingFunction={this.setActiveChat}
														individual={chat}
														index={index}
														toDisplay={'id'}
													/>
												))}
											</ListGroup>
										</CardText>
									</Card>
								)}
								<Card>
									<CardHeader>{this.props.subject}</CardHeader>
									<CardSubtitle></CardSubtitle>
									<CardText className="p-3" tag="span">
										{this.displayFields(
											currentPrisoner,
											currentUser,
											currentPrison,
											currentRule,
											currentChat,
											currentChapter
										)}
										<Link to={editLink}>
											<Button className="mx-2" size="sm" color="primary">
												Edit
											</Button>
										</Link>
										<Button onClick={this.deleteItem} size="sm" color="danger" className="mx-2">
											Delete
										</Button>
									</CardText>
								</Card>
								{this.props.subject === 'Message' && messages.length > 0 && (
									<ChatBox messages={messages} />
								)}
								{currentPrison && prisonersByPrison.length > 0 && (
									<Card className="mt-3">
										<CardHeader>Prisoners in {currentPrison.prisonName}</CardHeader>
										<CardText className="p-3" tag="span">
											<ListGroup>
												{prisonersByPrison.map((prisoner) => (
													<Link to={`/prisoner/${prisoner.id}`}>
														<ListGroupItem key={prisoner.id}>{prisoner.chosenName}</ListGroupItem>
													</Link>
												))}
											</ListGroup>
										</CardText>
									</Card>
								)}

								<p className="text-danger">{this.state.errorText}</p>
							</>
						) : (
							<div>
								<br />
								<p>Please click on a {this.props.subject}.</p>
							</div>
						)}
					</Col>
				</List>
				<Row>
					<Col></Col>
				</Row>
				<Row>
					<Col md="4">
						<label htmlFor="pageSize">Items per page:</label>
						<select
							id="pageSize"
							value={page_size}
							onChange={this.handlePageSizeChange}
							className="form-control"
						>
							<option value="5">5</option>
							<option value="10">10</option>
							<option value="20">20</option>
							<option value="100">100</option>
						</select>
					</Col>
					<Col md="8" className="text-right">
						<Button color="primary" onClick={() => this.handlePageChange(-1)} disabled={page === 1}>
							Previous
						</Button>
						<span className="mx-2">Page {page}</span>
						<Button color="primary" onClick={() => this.handlePageChange(1)}>
							Next
						</Button>
					</Col>
				</Row>
				<InputForm
					key={this.props}
					subject={this.props.subject}
					token={this.props.token}
					handleDataFromChild={this.handleDataFromChild}
				/>
			</Container>
		);
	}
}

export default ListPage;
