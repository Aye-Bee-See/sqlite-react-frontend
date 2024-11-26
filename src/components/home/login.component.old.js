import React from "react";
import { Button, Col, Container, Form, FormGroup, Input, Label, Row } from "reactstrap";
import LoginNetworkService from "../../services/login-network-service";
class Login extends React.Component {

  constructor(props){
    super(props)

    this.handleChange = this.handleChange.bind(this);
    this.login = this.login.bind(this);
    this.testStatus = this.testStatus.bind(this);

    this.state = {
      username: '',
      password: ''
    }
  }

  async login(e){ 
    e.preventDefault();
    LoginNetworkService.login(this.state.username, this.state.password).then((response) => {
      console.log(response.data.data.token.token);
      localStorage.setItem('token', response.data.data.token.token)
    })
  }

  async testStatus(e) {
    e.preventDefault();
    const token = JSON.parse(localStorage.getItem('token'))['token'];
    console.log(token);
    LoginNetworkService.protected(token).then((response) => {
      console.log(response);
    })
  }

  handleChange(e) {
    console.log(`${e.target.id}: ${e.target.value}`)
    this.setState({
      [e.target.id]: e.target.value
    })
  }

    render() {
        return (
            <>
            <Container>
              <Row>
              <Form onSubmit={this.login}>
              <FormGroup>
                <Label for="username"> Username: </Label>
                <Input onChange={this.handleChange} name="username" id="username" type="text"/>
              </FormGroup>
              <FormGroup>
                <Label for="password"> Password: </Label>
                <Input onChange={this.handleChange} name="username" id="password" type="password"/>
              </FormGroup>
              <Col><Button>Login</Button></Col>
            </Form>
              </Row>
              <Row>
              <Col><Button onClick={this.testStatus}>Test Login Status</Button></Col>
              </Row>
            </Container>

            </>
        )
    }
}

export default Login;