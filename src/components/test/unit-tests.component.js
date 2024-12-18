import React from "react";
import prisonNetworkService from "../../services/prison-network-service";
import prisonerNetworkService from "../../services/prisoner-network-service";
import ruleNetworkService from "../../services/rule-network-service";
import userNetworkService from "../../services/user-network-service";
import loginNetworkService from "../../services/login-network-service";

class UnitTests extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      results: {
        createUser: null,
        getToken: null,
        createPrison: null,
        createPrisoner: null,
        createRule: null,
        getPrisons: null,
        getPrisoners: null,
        getRules: null,
        updatePrison: null,
        updatePrisoner: null,
        updateUser: null,
        updateRule: null,
        deletePrison: null,
        deletePrisoner: null,
        deleteUser: null,
        deleteRule: null,
      }
    };
    this.runTests = this.runTests.bind(this);
  }

  async runTests() {
    const token = this.props.token;
    try {
      // Create user
      const userParams = {username: "testuser", name: "test user", email: "testuser@testuser.biz" , password: "password", role: 'user'};
      await loginNetworkService.register(userParams);
      this.setState(prevState => ({ results: { ...prevState.results, createUser: true } }));

      // Get token
      const loginResponse = await loginNetworkService.login(userParams.username, userParams.password);
      const userToken = loginResponse.data.token;
      this.setState(prevState => ({ results: { ...prevState.results, getToken: true } }));

      // Create prison
      const prisonParams = { prisonName: "Test Prison", address: {street: "Test Prison Street"}};
      await prisonNetworkService.addOne(prisonParams, userToken);
      this.setState(prevState => ({ results: { ...prevState.results, createPrison: true } }));

      // Create prisoner
      const prisonerParams = { birthName: "Test Prisoner", chosenName: "Test Prisoner Chosen Name", inmateID: "123", prison: 1, releaseDate: "2029-04-05T23:24:24.819Z", bio: "Test Bio" };
      await prisonerNetworkService.addOne(prisonerParams, userToken);
      this.setState(prevState => ({ results: { ...prevState.results, createPrisoner: true } }));

      // Create rule
      const ruleParams = { title: "Test rule", description: "Test Rule description" };
      await ruleNetworkService.addOne(ruleParams, userToken);
      this.setState(prevState => ({ results: { ...prevState.results, createRule: true } }));

      // Get prisons
      const prisons = await prisonNetworkService.getAll(userToken);
      this.setState(prevState => ({ results: { ...prevState.results, getPrisons: prisons.data.some(p => p.name === "Test Prison") } }));

      // Get prisoners
      const prisoners = await prisonerNetworkService.getAll(userToken);
      this.setState(prevState => ({ results: { ...prevState.results, getPrisoners: prisoners.data.some(p => p.name === "Test Prisoner") } }));

      // Get rules
      const rules = await ruleNetworkService.getAll(userToken);
      this.setState(prevState => ({ results: { ...prevState.results, getRules: rules.data.some(r => r.description === "Test Rule") } }));

      // Update prison
      const updatedPrisonParams = { name: "Updated Test Prison" };
      await prisonNetworkService.updateOne(updatedPrisonParams, userToken);
      this.setState(prevState => ({ results: { ...prevState.results, updatePrison: true } }));

      // Update prisoner
      const updatedPrisonerParams = { name: "Updated Test Prisoner" };
      await prisonerNetworkService.updateOne(updatedPrisonerParams, userToken);
      this.setState(prevState => ({ results: { ...prevState.results, updatePrisoner: true } }));

      // Update user
      const updatedUserParams = { username: "updatedtestuser", password: "newpassword" };
      await userNetworkService.updateOne(updatedUserParams, userToken);
      this.setState(prevState => ({ results: { ...prevState.results, updateUser: true } }));

      // Update rule
      const updatedRuleParams = { description: "Updated Test Rule" };
      await ruleNetworkService.updateOne(updatedRuleParams, userToken);
      this.setState(prevState => ({ results: { ...prevState.results, updateRule: true } }));

      // Delete prison
      await prisonNetworkService.deleteOne(prisons.data.find(p => p.name === "Updated Test Prison").id, userToken);
      this.setState(prevState => ({ results: { ...prevState.results, deletePrison: true } }));

      // Delete prisoner
      await prisonerNetworkService.deleteOne(prisoners.data.find(p => p.name === "Updated Test Prisoner").id, userToken);
      this.setState(prevState => ({ results: { ...prevState.results, deletePrisoner: true } }));

      // Delete user
      await userNetworkService.deleteOne(updatedUserParams.username, userToken);
      this.setState(prevState => ({ results: { ...prevState.results, deleteUser: true } }));

      // Delete rule
      await ruleNetworkService.deleteOne(rules.data.find(r => r.description === "Updated Test Rule").id, userToken);
      this.setState(prevState => ({ results: { ...prevState.results, deleteRule: true } }));

    } catch (error) {
      console.error(error);
      // Update results with failure
      const failedTask = error.config.url.split('/').pop().split('?')[0];
      this.setState(prevState => ({ results: { ...prevState.results, [failedTask]: false } }));
    }
  }

  render() {
    return (
      <>
        <button onClick={this.runTests}>Start Tests</button>
        <ul>
          {Object.keys(this.state.results).map(task => (
            <li key={task}>
              {task}: {this.state.results[task] === null ? "Pending" : this.state.results[task] ? "✔️" : "❌"}
            </li>
          ))}
        </ul>
      </>
    );
  }
}

export default UnitTests;