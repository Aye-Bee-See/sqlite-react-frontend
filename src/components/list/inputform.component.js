import React from "react";
import { Button, Container, Form, FormGroup, Input, Label, Row } from "reactstrap";
import PrisonerNetworkService from '../../services/prisoner-network-service';
import UserNetworkService from "../../services/user-network-service";
import PrisonNetworkService from "../../services/prison-network-service";
import RuleNetworkService from "../../services/rule-network-service";
import fields from "../../global_vars/fields";
import withRouter from "../withRouter";

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

    var po = this.propertyObject(this.props.subject)
    console.log(po)

    this.state = {
      po
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
      [e.target.id]: e.target.value
    });
  }
//TODO: Visible error handling
  async buttonSubmit(e) {
    e.preventDefault();
    switch (this.props.subject) {
      case "Prisoner": 
        PrisonerNetworkService.addOne(this.state).then(response => {
          if (response.status === 200) { console.log("Success!")
            this.props.handleDataFromChild(this.state);
          }
          else { console.log("Fail :-(") }
        });
        break;
      case "User":
        UserNetworkService.addOne(this.state).then(response => {
          if (response.status === 200) {
            this.props.handleDataFromChild(this.state);
          }
          else { console.log("Fail :-("); }
        });
        break;
      case "Prison": 
        PrisonNetworkService.addOne(this.state).then(response => {
          if (response.status === 200) {
            this.props.handleDataFromChild(this.state);
          }
          else { console.log("Fail :-("); }
        });
        break;
      case "Rule": 
        RuleNetworkService.addOne(this.state).then(response => {
          if (response.status === 200) {
            this.props.handleDataFromChild(this.state);
          }
          else { console.log("Fail :-("); }
        });
        break;
        default:
    }

  }

  componentDidMount() {
    const {subject, solo} = this.props;
    const {id} = this.props.router.params;

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
        default : {}
      }
    }
  }

  getPrisoner(id) {
    PrisonerNetworkService.getOne(id).then((response) => {
      console.log(response);
      this.setState({
        ...response.data.data.dataValues
      })
    });
  };

  getUser(id) {
    UserNetworkService.getOne(id).then((response) => {
    console.log(response)
      this.setState({
        ...response.data.data
      })
    });
  };

  getPrison(id) {
    PrisonNetworkService.getOne(id).then((response) => {
      console.log(response);
      this.setState({
        ...response.data.data.dataValues
      })
    });
  };

  getRule(id) {
    RuleNetworkService.getOne(id).then((response) => {
      console.log(response);
      this.setState({
        ...response.data.data.dataValues
      })
    });
  };

  clearFields() {
    var po = this.propertyObject(this.props.subject)
    this.setState({
      po
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
                return (
                  <div key={subKey}>
                    <Label>{field.subFields[subKey].title}:</Label>
                    <Input
                      id={subKey}
                      name={subKey}
                      disabled={field.disabled}
                      value={this.state.address ? this.state.address[subKey] : this.state[subKey]}
                      onChange={this.handleChange}
                      type={field.subFields[subKey].type}
                    />
                  </div>
                );
              })}
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
                value={this.state[key]}
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
              <Row>
                <Form>
                  {this.displayFields()}
                  <Button color="primary" onClick={this.buttonSubmit}>
                  {this.props.solo ? `Update ${this.props.subject}` : `Add ${this.props.subject}`}
                  </Button>
                </Form>  
              </Row>

            </Container>

            </>
        )
    }
}

export default withRouter(InputForm);