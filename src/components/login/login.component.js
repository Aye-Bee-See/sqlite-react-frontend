import { MDBInput } from 'mdb-react-ui-kit';
import React, { Component } from 'react';
import { Button, Col, Container, Row } from 'reactstrap';
import {initMDB, Input} from 'mdb-ui-kit';
import loginNetworkService from '../../services/login-network-service';


class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: 'login',
            loginUsername: '',
            loginPassword: '',
            registerUsername: '',
            registerName: '',
            registerEmail: '',
            registerPassword: '',
            registerConfirmPassword: ''
        };
    }

    componentDidMount(){
        initMDB({MDBInput, Input})
    }

    switchTab = (tab) => {
        this.setState({ activeTab: tab });
    }

    clearFormFields = () => {
        this.setState({
            loginUsername: '',
            loginPassword: '',
            registerUsername: '',
            registerName: '',
            registerEmail: '',
            registerPassword: '',
            registerConfirmPassword: ''
        });
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    login = (e) => {
        e.preventDefault();
        loginNetworkService.login(this.state.loginUsername, this.state.loginPassword).then((response) => {
            const token = response.data.data.token;
            const user = response.data.data.user;
            this.props.setToken(token);
            localStorage.setItem('user', JSON.stringify(user));
            this.clearFormFields();
        })
    }

    render() {
        const { activeTab } = this.state;

        return (
            <div className="login-component">
                <div className="tabs">
                    <Container>
                        <Row>
                    <Col><Button onClick={() => this.switchTab('login')} className={activeTab === 'login' ? 'active' : ''}>Login</Button></Col>
                    <Col><Button onClick={() => this.switchTab('register')} className={activeTab === 'register' ? 'active' : ''}>Register</Button></Col>
                        </Row>
                    </Container>
                </div>
                {activeTab === 'login' && (
                    <div className="login-form">
                        <Container>
                        <Row><h2>Login</h2></Row>
                        <Row>
                        <MDBInput
                            type="text"
                            wrapperClass='mb-4'
                            label='Username'
                            name="loginUsername"
                            id='username'
                            className='form-control'
                            aria-describedby='username'
                            value={this.state.loginUsername}
                            onChange={this.handleChange}
                        />
                        </Row>
                        <Row>
                        <MDBInput
                            type="password"
                            wrapperClass='mb-4'
                            name="loginPassword"
                            label="Password"
                            value={this.state.loginPassword}
                            onChange={this.handleChange}
                        />
                        <Button onClick={this.login}>Login</Button>
                        </Row>

                        </Container>
                    </div>
                )}
                {activeTab === 'register' && (
                    <div className="register-form">
                        <Container>
                        <Row><h2>Register</h2></Row>
                        <Row>
                        <MDBInput
                            type="text"
                            name="registerUsername"
                            label="Username"
                            wrapperClass='mb-4'

                            value={this.state.registerUsername}
                            onChange={this.handleChange}
                        />
                        </Row>
                        <Row>
                        <MDBInput
                            type="text"
                            name="registerName"
                            label="Name"
                            wrapperClass='mb-4'
                            value={this.state.registerName}
                            onChange={this.handleChange}
                        />
                        </Row>
                        <Row>
                        <MDBInput
                            type="email"
                            name="registerEmail"
                            label="Email"
                            wrapperClass='mb-4'
                            value={this.state.registerEmail}
                            onChange={this.handleChange}
                        />
                        </Row>
                        <Row>
                            <MDBInput
                            type="password"
                            name="registerPassword"
                            label="Password"
                            wrapperClass='mb-4'
                            value={this.state.registerPassword}
                            onChange={this.handleChange}
                        />    
                            </Row>
                            <Row>
                            <MDBInput
                            type="password"
                            name="registerConfirmPassword"
                            label="Confirm Password"
                            wrapperClass='mb-4'
                            value={this.state.registerConfirmPassword}
                            onChange={this.handleChange}
                        />
                            </Row>
                            <Row>
                            <Button>Register</Button>
                            </Row>
                        </Container>
                    </div>
                )}
            </div>
        );
    }
}

export default Login;