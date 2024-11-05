import React from "react";
import { Button, Col, Container, Form, FormGroup, Input, Label, Row } from "reactstrap";
import PrisonerNetworkService from '../../services/prisoner-network-service';
import UserNetworkService from "../../services/user-network-service";
import PrisonNetworkService from "../../services/prison-network-service";
import RuleNetworkService from "../../services/rule-network-service";
import fields from "../../global_vars/fields";
import withRouter from "../withRouter";
import {states, roles} from "../../global_vars/options";

class InputForm extends React.Component {

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.buttonSubmit = this.buttonSubmit.bind(this);
    this.clearFields = this.clearFields.bind(this);
    this.displayFields = this.displayFields.bind(this);
    this.propertyObject = this.propertyObject.bind(this);

    this.getPrisoner = this.getPrisoner.bind(this);
    this.getUser = this.getUser.bind(this);
    this.getPrison = this.getPrison.bind(this);
    this.getRule = this.getRule.bind(this);
    this.fetchPrisons = this.fetchPrisons.bind(this);

    this.setMessage = this.setMessage.bind(this);

    var po = this.propertyObject(this.props.subject)
    console.log(po)

    this.state = {
      prisons: [],
      item: po,
      message: ''
      }
    }

  propertyObject(subject) {
    const state = {};
  
    Object.keys(fields[subject]).forEach(key => {
      const field = fields[subject][key];
      if (field.meta && field.subFields) {
        state[key] = {};
        Object.keys(field.subFields).forEach(subField => {
          state.address[subField] = field.subFields[subField].default;
        });
      } else if (field.meta && field.subFields) {
        Object.keys(field.subFields).forEach(subField => {
          state[subField] = field.subFields[subField].default;
        });
      } else {
        state[key] = field.default;
      }
    });
  
    return state;
  }

  handleChange(e) {
    console.log(e.target.value);
    this.setState({
      ...this.state,
      item: {
        ...this.state.item,
        [e.target.id]: e.target.value
      }
    });
  }

  async buttonSubmit(e) {
    e.preventDefault();
    this.addOrUpdate().then(response => {
      if (response) { 
        if (this.props.handleDataFromChild) {
          this.props.handleDataFromChild(this.state.item).then(this.clearFields());
        } else { this.clearFields() }     
      }
    })
  }

  async addOrUpdate() {
    try {
      let response;
      switch (this.props.subject) {
        case "Prisoner": 
          if (this.props.solo) {
            response = await PrisonerNetworkService.updateOne(this.state.item);
            if (response.status === 200) {
              this.props.router.navigate('/prisoners');
              return true;
            } else {
              this.setMessage(response.data.info);
              return false;
            }
          } else {
            response = await PrisonerNetworkService.addOne(this.state.item);
            if (response.status === 200) {
              console.log("Success!");
              return true;
            } else {
              this.setMessage(response.data.info);
              return false;
            }
          }
        case "User":
          if (this.props.solo) {
            response = await UserNetworkService.updateOne(this.state.item);
            if (response.status === 200) {
              this.props.router.navigate('/users');
              return true;
            } else {
              this.setMessage(response.data.info);
              return false;
            }
          } else {
            response = await UserNetworkService.addOne(this.state.item);
            if (response.status === 200) {
              console.log("Success!");
              return true;
            } else {
              this.setMessage(response.data.info);
              return false;
            }
          }
        case "Prison": 
          if (this.props.solo) {
            response = await PrisonNetworkService.updateOne(this.state.item);
            if (response.status === 200) {
              this.props.router.navigate('/prisons');
              return true;
            } else {
              this.setMessage(response.data.info);
              return false;
            }
          } else {
            response = await PrisonNetworkService.addOne(this.state.item);
            if (response.status === 200) {
              console.log("Success!");
              return true;
            } else {
              this.setMessage(response.data.info);
              return false;
            }
          }
        case "Rule": 
          if (this.props.solo) {
            response = await RuleNetworkService.updateOne(this.state.item);
            if (response.status === 200) {
              this.props.router.navigate('/rules');
              return true;
            } else {
              this.setMessage(response.data.info);
              return false;
            }
          } else {
            response = await RuleNetworkService.addOne(this.state.item);
            if (response.status === 200) {
              console.log("Success!");
              return true;
            } else {
              this.setMessage(response.data.info);
              return false;
            }
          }
        default:
          return false;
      }
    } catch (error) {
      console.log(error);
      this.setMessage(error.response.data.error);
      return false;
    }
  }

  componentDidMount() {
    const {subject, solo} = this.props;
    const {id} = this.props.router.params;
    if (subject === "Prisoner") { this.fetchPrisons() }

    if (solo) {
      switch (subject) {
        case "Prisoner": {
          this.getPrisoner(id);
          break;
        }
        case "User": {
          this.getUser(id);
          break;
        }
        case "Prison": {
          this.getPrison(id);
          break;
        }
        case "Rule": {
          this.getRule(id);
          break;
        }
        default: {}
      }
    }
  }

  async fetchPrisons() {
    try {
      const response = await PrisonNetworkService.getAll();
      if (response.status === 200) {
        this.setState({ prisons: Object.values(response.data.data) });
      } else {
        console.error("Failed to fetch prisons");
      }
    } catch (error) {
      console.error("Error fetching prisons:", error);
    }
  }

  async setMessage(message) {
    this.setState({
      message: message
    }, () => { console.log(this.state.message) })
  }

  getPrisoner(id) {
    PrisonerNetworkService.getOne(id).then((response) => {
      console.log(response);
      this.setState({
        item: {...response.data.data}
      })
    });
  };

  getUser(id) {
    UserNetworkService.getOne(id).then((response) => {
    console.log(response)
      this.setState({
        item: {...response.data.data}
      })
    });
  };

  getPrison(id) {
    PrisonNetworkService.getOne(id).then((response) => {
      console.log(response);
      this.setState({
        item: {...response.data.data}
      })
    });
  };

  getRule(id) {
    RuleNetworkService.getOne(id).then((response) => {
      console.log(response);
      this.setState({
        item: {...response.data.data}
      })
    });
  };

  async clearFields() {
    var po = this.propertyObject(this.props.subject)
    this.setState({
      item: po
    })
  }


  displayFields() {
    console.log(this.props.subject);
    return Object.keys(fields[this.props.subject]).map((key) => {
      const field = fields[this.props.subject][key];
      if (field.meta && field.subFields) {
        return (
          <div key={key}>
            <FormGroup>
              <Label>{field.title}:</Label>
              {Object.keys(field.subFields).map((subKey) => {
                if (subKey === "state") {
                  return (
                    <div key={subKey}>
                      <Label>{field.subFields[subKey].title}:</Label>
                      <Input
                        id={subKey}
                        name={subKey}
                        disabled={field.disabled}
                        value={this.state["item"][key] ? this.state["item"][key][subKey] : this.state["item"][subKey]}
                        onChange={this.handleChange}
                        type="select">
                        <option value="">Select a state</option>
                        {states.map((state) => (
                          <option key={state} value={state}>
                            {state}
                          </option>
                        ))}
                      </Input>
                    </div>
                  );
                } else {
                  return (
                    <div key={subKey}>
                      <Label>{field.subFields[subKey].title}:</Label>
                      <Input
                        id={subKey}
                        name={subKey}
                        disabled={field.disabled}
                        value={this.state["item"][key] ? this.state["item"][key][subKey] : this.state["item"][subKey]}
                        onChange={this.handleChange}
                        type={field.subFields[subKey].type}
                      />
                    </div>
                  );
                }
              })}
            </FormGroup>
          </div>
        );
      } else if (key === "role") {
        return (
          <div key={key}>
            <FormGroup>
              <Label>{field.title}:</Label>
              <Input
                id={key}
                name={key}
                value={this.state.item[key]}
                onChange={this.handleChange}
                type="select"
              >
                <option value="">Select a role</option>
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </Input>
            </FormGroup>
          </div>
        );
      } else if (key === "prison") {
        return (
          <div key={key}>
            <FormGroup>
              <Label>{field.title}:</Label>
              <Input
                id={key}
                name={key}
                value={this.state.item[key]}
                onChange={this.handleChange}
                type="select"
              >
                <option value="">Select a prison</option>
                {this.state.prisons.map((prison) => (
                  <option key={prison.id} value={prison.id}>
                    {prison.prisonName}
                  </option>
                ))}
              </Input>
            </FormGroup>
          </div>
        );
      } else {
        return (
          <div key={key}>
            <FormGroup>
              <Label>{field.title}:</Label>
              <Input
                id={key}
                name={key}
                disabled={field.disabled}
                value={this.state.item[key]}
                onChange={this.handleChange}
                type={field.type}
              />
            </FormGroup>
          </div>
        );
      }
    });
  }

    render() {
        return (
            <>
            <Container>
                <Form>
                <Row>
                  {this.displayFields()}
                  </Row>
                  <Row>
                  <Col>
                  <Button color="primary" onClick={this.buttonSubmit}>
                  {this.props.solo ? `Update ${this.props.subject}` : `Add ${this.props.subject}`}
                  </Button>
                  </Col>
                  <Col> <p className="text-danger">{this.state.message}</p> </Col>
                  </Row>
                </Form>  

            </Container>
            </>
        )
    }
}

export default withRouter(InputForm);