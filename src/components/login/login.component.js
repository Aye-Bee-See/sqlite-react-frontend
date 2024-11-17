import { MDBInput } from 'mdb-react-ui-kit';
import React, { Component } from 'react';
import { Button, Container, Row } from 'reactstrap';
import {initMDB, Input} from 'mdb-ui-kit';


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

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    render() {
        const { activeTab } = this.state;

        return (
            <div className="login-component">
                <div className="tabs">
                    <Button onClick={() => this.switchTab('login')} className={activeTab === 'login' ? 'active' : ''}>Login</Button>
                    <Button onClick={() => this.switchTab('register')} className={activeTab === 'register' ? 'active' : ''}>Register</Button>
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
                        <Button>Login</Button>
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