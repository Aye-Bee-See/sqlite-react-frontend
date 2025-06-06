import { MDBInput } from 'mdb-react-ui-kit';
import React, { Component } from 'react';
import { Button, Col, Container, Form, Row } from 'reactstrap';
import { initMDB, Input } from 'mdb-ui-kit';
import loginNetworkService from '../../services/login-network-service';
import ReactFormInputValidation from 'react-form-input-validation';
import { Navigate } from 'react-router-dom';
import withRouter from '../withRouter';

class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			activeTab: 'login',
			fields: {
				loginUsername: '',
				loginPassword: '',
				registerUsername: '',
				registerName: '',
				registerEmail: '',
				registerPassword: '',
				registerPassword_confirmation: '',
				avatar: null // Add avatar field
			},
			errors: {},
			errorMessage: ''
		};

		this.form = new ReactFormInputValidation(this);
		this.form.useRules({
			loginUsername: 'required|string|between:3,20',
			loginPassword: 'required|string|between:8,60',
			registerUsername: 'required|string|between:3,20',
			registerName: 'string',
			registerEmail: 'email|between:5,30',
			registerPassword: 'required|string|between:8,60|confirmed',
			registerPassword_confirmation: 'required'
		});
	}
	filterErrors = (type) => {
		const { errors } = this.state;
		const loginFields = ['loginUsername', 'loginPassword'];
		const registerFields = [
			'registerUsername',
			'registerName',
			'registerEmail',
			'registerPassword',
			'registerPassword_confirmation'
		];

		const fieldsToFilter = type === 'login' ? loginFields : registerFields;

		return Object.keys(errors)
			.filter((key) => fieldsToFilter.includes(key))
			.map((key) => [errors[key]]);
	};

	componentDidMount() {
		initMDB({ MDBInput, Input });
	}

	switchTab = (tab) => {
		this.setState({ activeTab: tab });
	};

	clearFormFields = () => {
		this.setState({
			fields: {
				loginUsername: '',
				loginPassword: '',
				registerUsername: '',
				registerName: '',
				registerEmail: '',
				registerPassword: '',
				registerPassword_confirmation: '',
				avatar: null
			}
		});
	};

	handleChange = (e) => {
		console.log(this.state.errors);
		this.setState((prevState) => ({
			fields: { ...prevState.fields, [e.target.name]: e.target.value }
		}));
	};

	handleFileChange = (e) => {
		this.setState((prevState) => ({
			fields: { ...prevState.fields, avatar: e.target.files[0] }
		}));
	};

	handleKeyDown = (e) => {
		if (e.key === 'Enter') {
			if (this.state.activeTab === 'login') {
				this.login(e);
			} else {
				this.register(e);
			}
		}
	};

	login = (e) => {
		e.preventDefault();
		console.log(
			`Username: ${this.state.fields.loginUsername}. Password: ${this.state.fields.loginPassword}`
		);
		loginNetworkService
			.login(this.state.fields.loginUsername, this.state.fields.loginPassword)
			.then((response) => {
				console.log(response);
				const token = response.data.data.token;
				const user = response.data.data.user;
				this.props.setToken(token, user);
				this.clearFormFields();
				this.props.router.navigate('/');
			})
			.catch((error) => {
				console.log(error);
				if (error.response && (error.response.status === 400 || error.response.status === 401)) {
					console.log(error.response);
					this.setState({ errorMessage: 'Incorrect username or password' });
				}
			});
	};

	register = (e) => {
		e.preventDefault();
		console.log('registering');
		const formData = new FormData();
		formData.append('username', this.state.fields.registerUsername);
		formData.append('name', this.state.fields.registerName);
		formData.append('email', this.state.fields.registerEmail);
		formData.append('password', this.state.fields.registerPassword);
		formData.append('role', 'user');
		if (this.state.fields.avatar) {
			console.log(this.state.fields.avatar);
			formData.append('avatar', this.state.fields.avatar); // Append avatar if provided
		}

		loginNetworkService
			.register(formData)
			.then(() => {
				this.switchTab('login');
			})
			.catch((error) => {
				if (error.response && (error.response.status === 400 || error.response.status === 401)) {
					this.setState({ errorMessage: 'Incorrect username or password' });
				}
			});
	};

	render() {
		const { activeTab, errorMessage } = this.state;
		const hasLoginErrors = this.filterErrors('login').length > 0;
		const hasRegisterErrors = this.filterErrors('register').length > 0;

		return (
			<div className="login-component">
				<div className="tabs">
					<Container>
						<Row>
							<Col>
								<Button
									onClick={() => this.switchTab('login')}
									className={activeTab === 'login' ? 'active' : ''}
								>
									Login
								</Button>
							</Col>
							<Col>
								<Button
									onClick={() => this.switchTab('register')}
									className={activeTab === 'register' ? 'active' : ''}
								>
									Register
								</Button>
							</Col>
						</Row>
					</Container>
				</div>
				{activeTab === 'login' && (
					<div className="login-form">
						<Container>
							<Row>
								<h2>Login</h2>
							</Row>
							<Row>
								<MDBInput
									type="text"
									wrapperClass="mb-4"
									label="Username"
									name="loginUsername"
									id="username"
									className="form-control"
									aria-describedby="username"
									data-attribute-name="username"
									onBlur={this.form.handleBlurEvent}
									value={this.state.fields.loginUsername}
									onChange={this.handleChange}
									onKeyDown={this.handleKeyDown}
									errors={this.state.errors}
								/>
							</Row>
							<Row>
								<MDBInput
									type="password"
									wrapperClass="mb-4"
									label="Password"
									name="loginPassword"
									id="password"
									className="form-control"
									aria-describedby="password"
									data-attribute-name="password"
									onBlur={this.form.handleBlurEvent}
									value={this.state.fields.loginPassword}
									onChange={this.handleChange}
									onKeyDown={this.handleKeyDown}
									errors={this.state.errors}
								/>
								<Button onClick={this.login} disabled={hasLoginErrors}>
									Login
								</Button>
							</Row>
							<Row>
								<p>{this.filterErrors('login')}</p>
							</Row>
							{errorMessage && (
								<Row>
									<p className="text-danger">{errorMessage}</p>
								</Row>
							)}
						</Container>
					</div>
				)}
				{activeTab === 'register' && (
					<div className="register-form">
						<Container>
							<Row>
								<h2>Register</h2>
							</Row>
							<Row>
								<MDBInput
									type="text"
									name="registerUsername"
									label="Username"
									wrapperClass="mb-4"
									data-attribute-name="username"
									value={this.state.fields.registerUsername}
									onBlur={this.form.handleBlurEvent}
									onChange={this.handleChange}
									onKeyDown={this.handleKeyDown}
									errors={this.state.errors}
								/>
							</Row>
							<Row>
								<MDBInput
									type="text"
									name="registerName"
									label="Name"
									wrapperClass="mb-4"
									data-attribute-name="name"
									onBlur={this.form.handleBlurEvent}
									value={this.state.fields.registerName}
									onChange={this.handleChange}
									onKeyDown={this.handleKeyDown}
									errors={this.state.errors}
								/>
							</Row>
							<Row>
								<MDBInput
									type="email"
									name="registerEmail"
									label="Email"
									wrapperClass="mb-4"
									data-attribute-name="email"
									onBlur={this.form.handleBlurEvent}
									value={this.state.fields.registerEmail}
									onChange={this.handleChange}
									onKeyDown={this.handleKeyDown}
									errors={this.state.errors}
								/>
							</Row>
							<Row>
								<MDBInput
									type="password"
									name="registerPassword"
									label="Password"
									wrapperClass="mb-4"
									data-attribute-name="password"
									onBlur={this.form.handleBlurEvent}
									value={this.state.fields.registerPassword}
									onChange={this.handleChange}
									onKeyDown={this.handleKeyDown}
									errors={this.state.errors}
								/>
							</Row>
							<Row>
								<MDBInput
									type="password"
									name="registerPassword_confirmation"
									label="Confirm Password"
									wrapperClass="mb-4"
									data-attribute-name="verify password"
									onBlur={this.form.handleBlurEvent}
									value={this.state.fields.registerPassword_confirmation}
									onChange={this.handleChange}
									onKeyDown={this.handleKeyDown}
									errors={this.state.errors}
								/>
							</Row>
							<Row>
								<MDBInput
									type="file"
									name="avatar"
									label="Avatar (optional)"
									wrapperClass="mb-4"
									onChange={this.handleFileChange}
								/>
							</Row>
							<Row>
								<Button onClick={this.register} disabled={hasRegisterErrors}>
									Register
								</Button>
							</Row>
							<Row>
								<p>{this.filterErrors('register')}</p>
							</Row>
							{errorMessage && (
								<Row>
									<p className="text-danger">{errorMessage}</p>
								</Row>
							)}
						</Container>
					</div>
				)}
			</div>
		);
	}
}

export default withRouter(Login);
