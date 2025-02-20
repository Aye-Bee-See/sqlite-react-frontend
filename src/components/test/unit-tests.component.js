import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Container, Row, Col } from "reactstrap";
import { runTests } from "./test-interface";
import ResultsCard from "./ResultsCard";

class UnitTests extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      rule: null,
      prison: null,
      prisoner: null,
      results: {
        createUser: null, getToken: null, createPrison: null, createPrisoner: null, createRule: null,
        getUsers: null, getPrisons: null, getPrisoners: null, getRules: null,
        getUser: null, getPrison: null, getPrisoner: null, getRule: null,
        updatePrison: null, updatePrisoner: null, updateUser: null, updateRule: null, 
        deletePrison: null, deletePrisoner: null, deleteRule: null, deleteUser: null,
        createChat: null, createMessage: null, getChats: null, getMessages: null,
        updateChat: null, updateMessage: null, deleteChat: null, deleteMessage: null,
      }
    };
    this.runTests = this.runTests.bind(this);
  }

  async runTests() {
    const token = this.props.token;
    const results = await runTests(token);
    this.setState({ results });
  }

  render() {
    const createResults = ["createUser", "getToken", "createPrison", "createPrisoner", "createRule", "createChat", "createMessage"];
    const getResults = ["getUsers", "getPrisons", "getPrisoners", "getRules", "getUser", "getPrison", "getPrisoner", "getRule", "getChats", "getMessages"];
    const updateResults = ["updatePrison", "updatePrisoner", "updateUser", "updateRule", "updateChat", "updateMessage"];
    const deleteResults = ["deletePrison", "deletePrisoner", "deleteRule", "deleteUser", "deleteChat", "deleteMessage"];

    return (
      <>
        <Button onClick={this.runTests}>Start Tests</Button>
        <Container>
          <Row>
            <Col className="md-6">
              <ResultsCard title="Create Results" tasks={createResults} results={this.state.results} />
            </Col>
            <Col className="md-6">
              <ResultsCard title="Get Results" tasks={getResults} results={this.state.results} />
            </Col>
          </Row>
          <Row>
            <Col className="md-6">
              <ResultsCard title="Update Results" tasks={updateResults} results={this.state.results} />
            </Col>
            <Col className="md-6">
              <ResultsCard title="Delete Results" tasks={deleteResults} results={this.state.results} />
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

export default UnitTests;