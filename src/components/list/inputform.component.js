import React from "react";
import {
  Alert,
  Button,
  Col,
  Container,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  Row,
} from "reactstrap";
import PrisonerNetworkService from "../../services/prisoner-network-service";
import UserNetworkService from "../../services/user-network-service";
import PrisonNetworkService from "../../services/prison-network-service";
import RuleNetworkService from "../../services/rule-network-service";
import fields from "../../global_vars/fields";
import withRouter from "../withRouter";
import { states, roles } from "../../global_vars/options";
import ReactFormInputValidation from "react-form-input-validation";

class InputForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.buttonSubmit = this.buttonSubmit.bind(this);
    this.clearFields = this.clearFields.bind(this);
    this.displayFields = this.displayFields.bind(this);

    this.propertyObject = this.propertyObject.bind(this);
    this.ruleObject = this.ruleObject.bind(this);

    this.getPrisoner = this.getPrisoner.bind(this);
    this.getUser = this.getUser.bind(this);
    this.getPrison = this.getPrison.bind(this);
    this.getRule = this.getRule.bind(this);
    this.fetchPrisons = this.fetchPrisons.bind(this);

    this.setMessage = this.setMessage.bind(this);

    var po = this.propertyObject(this.props.subject);

    this.state = {
      prisons: [],
      message: "",
      fields: po,
      errors: {}
    };

    this.form = new ReactFormInputValidation(this);
    this.form.useRules(this.ruleObject(this.props.subject));
  }

  propertyObject(subject) {
    const state = {};

    Object.keys(fields[subject]).forEach((key) => {
      const field = fields[subject][key];
      if (field.meta && field.subFields) {
        state[key] = {};
        Object.keys(field.subFields).forEach((subField) => {
          state[key][subField] = field.subFields[subField].default;
        });
      } else {
        state[key] = field.default;
      }
    });
    return state;
  }

  ruleObject(subject) {
    const ruleObject = {};

    Object.keys(fields[subject]).forEach((key) => {
      const field = fields[subject][key];
      if (field.meta && field.subFields) {
        ruleObject[key] = {};
        Object.keys(field.subFields).forEach((subField) => {
          if (field.subFields[subField].rules !== undefined) {
            ruleObject[key][subField] = field.subFields[subField].rules;
          }
        });
        if (Object.keys(ruleObject[key]).length === 0) {
          delete ruleObject[key];
        }
      } else {
        if (field.rules !== undefined) {
          ruleObject[key] = field.rules;
        }
      }
    });
    return ruleObject;
  }

  handleChange(e) {
    this.form.handleChangeEvent(e);
    console.log(this.state.errors);
    const { id, value } = e.target;
    const [parentKey, subKey] = id.split(".");

    if (subKey) {
      this.setState(prevState => ({
        fields: {
          ...prevState.fields,
          [parentKey]: {
            ...prevState.fields[parentKey],
            [subKey]: value
          }
        }
      }));
    } else {
      this.setState(prevState => ({
        fields: {
          ...prevState.fields,
          [id]: value
        }
      }));
    }
  }

  // TODO: Display validation errors when failing to submit
  async buttonSubmit(e) {
    e.preventDefault();
    this.form.onformsubmit = (fields) => {
      this.addOrUpdate().then((response) => {
        if (response) {
          if (this.props.handleDataFromChild) {
            this.props
              .handleDataFromChild(this.state.fields)
              .then(this.clearFields());
          } else {
            this.clearFields();
          }
        }
      });
    }
  }

  async addOrUpdate() {
    try {
      let response;
      switch (this.props.subject) {
        case "Prisoner":
          if (this.props.solo) {
            response = await PrisonerNetworkService.updateOne(this.state.fields);
            if (response.status === 200) {
              this.props.router.navigate("/prisoners");
              return true;
            } else {
              this.setMessage(response.data.info);
              return false;
            }
          } else {
            response = await PrisonerNetworkService.addOne(this.state.fields);
            if (response.status === 200) {
              return true;
            } else {
              this.setMessage(response.data.info);
              return false;
            }
          }
        case "User":
          if (this.props.solo) {
            response = await UserNetworkService.updateOne(this.state.fields);
            if (response.status === 200) {
              this.props.router.navigate("/users");
              return true;
            } else {
              this.setMessage(response.data.info);
              return false;
            }
          } else {
            response = await UserNetworkService.addOne(this.state.fields);
            if (response.status === 200) {
              return true;
            } else {
              this.setMessage(response.data.info);
              return false;
            }
          }
        case "Prison":
          if (this.props.solo) {
            response = await PrisonNetworkService.updateOne(this.state.fields);
            if (response.status === 200) {
              this.props.router.navigate("/prisons");
              return true;
            } else {
              this.setMessage(response.data.info);
              return false;
            }
          } else {
            response = await PrisonNetworkService.addOne(this.state.fields);
            if (response.status === 200) {
              return true;
            } else {
              this.setMessage(response.data.info);
              return false;
            }
          }
        case "Rule":
          if (this.props.solo) {
            response = await RuleNetworkService.updateOne(this.state.fields);
            if (response.status === 200) {
              this.props.router.navigate("/rules");
              return true;
            } else {
              this.setMessage(response.data.info);
              return false;
            }
          } else {
            response = await RuleNetworkService.addOne(this.state.fields);
            if (response.status === 200) {
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
      this.setMessage(error.response.data.error);
      return false;
    }
  }

  componentDidMount() {
    const { subject, solo } = this.props;
    const { id } = this.props.router.params;
    if (subject === "Prisoner") {
      this.fetchPrisons();
    }

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
        default: {
        }
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
    this.setState(
      {
        message: message,
      }
    );
  }

  getPrisoner(id) {
    PrisonerNetworkService.getOne(id).then((response) => {
      this.setState({
        fields: { ...response.data.data },
      });
    });
  }

  getUser(id) {
    UserNetworkService.getOne(id).then((response) => {
      this.setState({
        fields: { ...response.data.data },
      });
    });
  }

  getPrison(id) {
    PrisonNetworkService.getOne(id).then((response) => {
      this.setState({
        fields: { ...response.data.data },
      });
    });
  }

  getRule(id) {
    RuleNetworkService.getOne(id).then((response) => {
      this.setState({
        fields: { ...response.data.data },
      });
    });
  }

  async clearFields() {
    var po = this.propertyObject(this.props.subject);
    this.setState({
      fields: po,
    });
  }

  displayFields() {
    return Object.keys(fields[this.props.subject]).map((key) => {
      const field = fields[this.props.subject][key];
      const value = this.state.fields[key] === -1 ? '' : this.state.fields[key];

      if (field.meta && field.subFields) {
        return (
          <div key={key}>
            <FormGroup>
              <Label>{field.title}:</Label>
              {Object.keys(field.subFields).map((subKey) => {
                const subValue = this.state.fields[key] && this.state.fields[key][subKey] === -1 ? '' : this.state.fields[key][subKey];
                if (subKey === "state") {
                  return (
                    <div key={subKey}>
                      <Label>{field.subFields[subKey].title}:</Label>
                      <Input
                        id={`${key}.${subKey}`}
                        name={`${key}.${subKey}`}
                        value={subValue}
                        onChange={this.handleChange}
                        onBlur={this.form.handleBlurEvent}
                        type="select"
                      >
                        <option value="">Select a state</option>
                        {states.map((state) => (
                          <option key={state} value={state}>
                            {state}
                          </option>
                        ))}
                      </Input>
                      {this.state.errors[key] ? <Alert color="danger" className="error">{this.state.errors[key]}</Alert> : "" }
                    </div>
                  );
                } else {
                  return (
                    <div key={subKey}>
                      <Label>{field.subFields[subKey].title}:</Label>
                      <Input
                        id={`${key}.${subKey}`}
                        name={`${key}.${subKey}`}
                        value={subValue}
                        onChange={this.handleChange}
                        type={field.subFields[subKey].type}
                        onBlur={this.form.handleBlurEvent}
                      />
                        {this.state.errors[key] ? <Alert color="danger" className="error">{this.state.errors[key]}</Alert> : "" }
                    </div>
                  );
                }
              })}
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
                value={value}
                onChange={this.handleChange}
                onBlur={this.form.handleBlurEvent}
                type="select"
              >
                <option value="">Select a prison</option>
                {this.state.prisons.map((prison) => (
                  <option key={prison.id} value={prison.id}>
                    {prison.prisonName}
                  </option>
                ))}
              </Input>
              {this.state.errors[key] ? <Alert color="danger" className="error">{this.state.errors[key]}</Alert> : "" }
            </FormGroup>
          </div>
        );
      } else if (key === "state") {
        return (
          <div key={key}>
            <FormGroup>
              <Label>{field.title}:</Label>
              <Input
                id={key}
                name={key}
                value={value}
                onChange={this.handleChange}
                onBlur={this.form.handleBlurEvent}
                type="select"
              >
                <option value="">Select a state</option>
                {states.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </Input>
              {this.state.errors[key] ? <Alert color="danger" className="error">{this.state.errors[key]}</Alert> : "" }
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
                value={value}
                onChange={this.handleChange}
                onBlur={this.form.handleBlurEvent}
                type="select"
              >
                <option value="">Select a role</option>
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </Input>
              {this.state.errors[key] ? <Alert color="danger" className="error">{this.state.errors[key]}</Alert> : "" }
            </FormGroup>
          </div>
        );
      } else if (key === "id") {
        return (
          <div key={key}>
            <FormGroup>
              <Label>{field.title}:</Label>
              <Input
                id={key}
                name={key}
                value={value}
                onChange={this.handleChange}
                onBlur={this.form.handleBlurEvent}
                type={field.type}
                disabled
              />
                {this.state.errors[key] ? <Alert color="danger" className="error">{this.state.errors[key]}</Alert> : "" }
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
                value={value}
                onChange={this.handleChange}
                onBlur={this.form.handleBlurEvent}
                type={field.type}
                data-attribute-name={field.title}
              />
              {console.log(key)}
              {this.state.errors[key] ? <Alert color="danger" className="error">{this.state.errors[key]}</Alert> : "" }
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
            <Row>{this.displayFields()}</Row>
            <Row>
              <Col>
              <Button 
                color={Object.keys(this.state.errors).length === 0 ? "primary" : ""}
                onClick={this.buttonSubmit}
                disabled={Object.keys(this.state.errors).length !== 0}
              >
                  {this.props.solo
                    ? `Update ${this.props.subject}`
                    : `Add ${this.props.subject}`}
                </Button>
                <p>{Object.values(this.state.errors)}</p>
              </Col>
              <Col>
                {" "}
                <p className="text-danger">{this.state.message}</p>{" "}
              </Col>
            </Row>
          </Form>
        </Container>
      </>
    );
  }
}

export default withRouter(InputForm);
