import React from "react";
import prisonNetworkService from "../../services/prison-network-service";
import prisonerNetworkService from "../../services/prisoner-network-service";
import ruleNetworkService from "../../services/rule-network-service";
import userNetworkService from "../../services/user-network-service";
import loginNetworkService from "../../services/login-network-service";
import 'bootstrap/dist/css/bootstrap.min.css';

class UnitTests extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      rule: null,
      prison: null,
      prisoner: null,
      results: {
        createUser: null,
        getToken: null,
        createPrison: null,
        createPrisoner: null,
        createRule: null,
        getUsers: null,
        getPrisons: null,
        getPrisoners: null,
        getRules: null,
        getUser: null,
        getPrison: null,
        getPrisoner: null,
        getRule: null,
        updatePrison: null,
        updatePrisoner: null,
        updateUser: null,
        updateRule: null,
        deletePrison: null,
        deletePrisoner: null,
        deleteRule: null,
        deleteUser: null,
      }
    };
    this.runTests = this.runTests.bind(this);
  }

  async runTests() {
    const token = this.props.token;
    try {
      // Create user
      const userParams = {username: "testuser", name: "test user", email: "testuser@testuser.biz" , password: "password", role: 'user'};
      const newUser = await loginNetworkService.register(userParams);
      this.setState(prevState => ({ ...prevState, user: newUser.data.data, results: { ...prevState.results, createUser: true } }));

      // Get token
      const loginResponse = await loginNetworkService.login(userParams.username, userParams.password);
      const userToken = loginResponse.data.data.token.token;
      console.log(userToken)
      this.setState(prevState => ({ results: { ...prevState.results, getToken: true } }));

      // Create prison
      const prisonParams = { prisonName: "Test Prison", address: {street: "Test Prison Street"}};
      const newPrison = await prisonNetworkService.addOne(prisonParams, userToken);
      this.setState(prevState => ({ ...prevState, prison: newPrison.data.data, results: { ...prevState.results, createPrison: true } }));

      // Create prisoner
      const prisonerParams = { birthName: "Test Prisoner", chosenName: "Test Prisoner Chosen Name", inmateID: "123", prison: 1, releaseDate: "2029-04-05T23:24:24.819Z", bio: "Test Bio" };
      const newPrisoner = await prisonerNetworkService.addOne(prisonerParams, userToken);
      this.setState(prevState => ({ ...prevState, prisoner: newPrisoner.data.data, results: { ...prevState.results, createPrisoner: true } }));

      // Create rule
      const ruleParams = { title: "Test rule", description: "Test Rule description" };
      const newRule = await ruleNetworkService.addOne(ruleParams, userToken);
      this.setState(prevState => ({ ...prevState, rule: newRule.data.data, results: { ...prevState.results, createRule: true } }));

      // Get users
      const users = await userNetworkService.getAll(userToken);
      console.log(users);
      this.setState(prevState => ({ results: { ...prevState.results, getUsers: users.data.data.some(p => p.username === "testuser")}}))

      // Get prisons
      const prisons = await prisonNetworkService.getAll(userToken);
      this.setState(prevState => ({ results: { ...prevState.results, getPrisons: prisons.data.data.some(p => p.prisonName === "Test Prison") } }));

      // Get prisoners
      const prisoners = await prisonerNetworkService.getAll(userToken);
      this.setState(prevState => ({ results: { ...prevState.results, getPrisoners: prisoners.data.data.some(p => p.birthName === "Test Prisoner") } }));

      // Get rules
      const rules = await ruleNetworkService.getAll(userToken);
      console.log(rules);
      this.setState(prevState => ({ results: { ...prevState.results, getRules: rules.data.data.some(r => r.title === "Test rule") } }));

      // Get user
      const user = await userNetworkService.getOne(this.state.user.id, userToken);
      this.setState(prevState => ({ results: { ...prevState.results, getUser: user.data.data.name === this.state.user.name} }))

      // Get prison
      const prison = await prisonNetworkService.getOne(this.state.prison.id, userToken);
      this.setState(prevState => ({ results: { ...prevState.results, getPrison: prison.data.data.prisonName === this.state.prison.prisonName } }));

      // Get prisoner
      const prisoner = await prisonerNetworkService.getOne(this.state.prisoner.id, userToken);
      this.setState(prevState => ({ results: { ...prevState.results, getPrisoner: prisoner.data.data.birthName === this.state.prisoner.birthName } }));

      // Get rule
      const rule = await ruleNetworkService.getOne(this.state.rule.id, userToken);
      this.setState(prevState => ({ results: { ...prevState.results, getRule: rule.data.data.title === this.state.rule.title } }));

      // Update prison
      const updatedPrisonParams = { id: this.state.prison.id, name: "Updated Test Prison" };
      await prisonNetworkService.updateOne(updatedPrisonParams, userToken);
      this.setState(prevState => ({ results: { ...prevState.results, updatePrison: true } }));

      // Update prisoner
      const updatedPrisonerParams = { id: this.state.prisoner.id, name: "Updated Test Prisoner" };
      await prisonerNetworkService.updateOne(updatedPrisonerParams, userToken);
      this.setState(prevState => ({ results: { ...prevState.results, updatePrisoner: true } }));

      // Update user
      const updatedUserParams = { id: this.state.user.id, username: "updatedtestuser", password: "newpassword" };
      await userNetworkService.updateOne(updatedUserParams, userToken);
      this.setState(prevState => ({ results: { ...prevState.results, updateUser: true } }));

      // Update rule
      const updatedRuleParams = { id: this.state.rule.id, description: "Updated Test Rule" };
      await ruleNetworkService.updateOne(updatedRuleParams, userToken);
      this.setState(prevState => ({ results: { ...prevState.results, updateRule: true } }));

      // Delete prison
      await prisonNetworkService.deleteOne(this.state.prison.id, userToken);
      this.setState(prevState => ({ results: { ...prevState.results, deletePrison: true } }));

      // Delete prisoner
      await prisonerNetworkService.deleteOne(this.state.prisoner.id, userToken);
      this.setState(prevState => ({ results: { ...prevState.results, deletePrisoner: true } }));

      // Delete rule
      await ruleNetworkService.deleteOne(this.state.rule.id, userToken);
      this.setState(prevState => ({ results: { ...prevState.results, deleteRule: true } }));

      // Delete user
      await userNetworkService.deleteOne(this.state.user.id, userToken);
      this.setState(prevState => ({ results: { ...prevState.results, deleteUser: true } }));
    } catch (error) {
      console.error(error);
      // Update results with failure
      const failedTask = error.config.url.split('/').pop().split('?')[0];
      this.setState(prevState => ({ results: { ...prevState.results, [failedTask]: false } }));
    }
  }

  render() {
    const createResults = ["createUser", "getToken", "createPrison", "createPrisoner", "createRule"];
    const getResults = ["getUsers", "getPrisons", "getPrisoners", "getRules", "getUser", "getPrison", "getPrisoner", "getRule"];
    const updateResults = ["updatePrison", "updatePrisoner", "updateUser", "updateRule"];
    const deleteResults = ["deletePrison", "deletePrisoner", "deleteRule", "deleteUser"];

    return (
      <>
        <button onClick={this.runTests}>Start Tests</button>
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <div className="card">
                <div className="card-header">Create Results</div>
                <div className="card-body">
                  <ul>
                    {createResults.map(task => (
                      <li key={task}>
                        {task}: {this.state.results[task] === null ? "Pending" : this.state.results[task] ? "✔️" : "❌"}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card">
                <div className="card-header">Get Results</div>
                <div className="card-body">
                  <ul>
                    {getResults.map(task => (
                      <li key={task}>
                        {task}: {this.state.results[task] === null ? "Pending" : this.state.results[task] ? "✔️" : "❌"}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <div className="card">
                <div className="card-header">Update Results</div>
                <div className="card-body">
                  <ul>
                    {updateResults.map(task => (
                      <li key={task}>
                        {task}: {this.state.results[task] === null ? "Pending" : this.state.results[task] ? "✔️" : "❌"}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card">
                <div className="card-header">Delete Results</div>
                <div className="card-body">
                  <ul>
                    {deleteResults.map(task => (
                      <li key={task}>
                        {task}: {this.state.results[task] === null ? "Pending" : this.state.results[task] ? "✔️" : "❌"}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default UnitTests;