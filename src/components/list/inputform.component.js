import React from "react";
import {
  Button,
  Col,
  Container,
  Form,
  FormGroup,
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
import InputField from "./InputField";
import SelectField from "./SelectField";

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
      errors: {},
      token: ''
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

  // TODO: Display validation before blurring the field
  async buttonSubmit(e) {
    e.preventDefault();
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

  async addOrUpdate(token) {
    try {
      let response;
      const networkService = this.getNetworkService(this.props.subject);
      if (this.props.solo) {
        response = await networkService.updateOne(this.state.fields, token);
        if (response.status === 200) {
          this.props.router.navigate(`/${this.props.subject.toLowerCase()}s`);
          return true;
        } else {
          this.setMessage(response.data.info);
          return false;
        }
      } else {
        response = await networkService.addOne(this.state.fields, token);
        if (response.status === 200) {
          return true;
        } else {
          this.setMessage(response.data.info);
          return false;
        }
      }
    } catch (error) {
      this.setMessage(error.response.data.error);
      return false;
    }
  }

  getNetworkService(subject) {
    switch (subject) {
      case "Prisoner":
        return PrisonerNetworkService;
      case "User":
        return UserNetworkService;
      case "Prison":
        return PrisonNetworkService;
      case "Rule":
        return RuleNetworkService;
      default:
        throw new Error("Invalid subject");
    }
  }

  componentDidMount() {
    const { subject, solo } = this.props;
    const { id } = this.props.router.params;
    try {
      const token = typeof this.props.token === 'string' && this.props.token.startsWith('{') ? JSON.parse(this.props.token) : this.props.token;
      this.setState({
        token: token['token'] || token
      });
    } catch (error) {
      console.error("Invalid token format:", error);
    }
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
    PrisonerNetworkService.getOne(id, this.state.token).then((response) => {
      this.setState({
        fields: { ...response.data.data },
      });
    });
  }

  getUser(id) {
    UserNetworkService.getOne(id, this.state.token).then((response) => {
      this.setState({
        fields: { ...response.data.data },
      });
    });
  }

  getPrison(id) {
    PrisonNetworkService.getOne(id, this.state.token).then((response) => {
      this.setState({
        fields: { ...response.data.data },
      });
    });
  }

  getRule(id) {
    RuleNetworkService.getOne(id, this.state.token).then((response) => {
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
        return this.renderSubFields(key, field);
      } else if (key === "prison") {
        return (
          <SelectField
            id={key}
            field={field}
            options={this.state.prisons}
            optionLabel="prisonName"
            value={value}
            handleChange={this.handleChange}
            handleBlurEvent={this.form.handleBlurEvent}
            errors={this.state.errors}
          />
        );
      } else if (key === "state") {
        return (
          <SelectField
            id={key}
            field={field}
            options={states}
            value={value}
            handleChange={this.handleChange}
            handleBlurEvent={this.form.handleBlurEvent}
            errors={this.state.errors}
          />
        );
      } else if (key === "role") {
        return (
          <SelectField
            id={key}
            field={field}
            options={roles}
            value={value}
            handleChange={this.handleChange}
            handleBlurEvent={this.form.handleBlurEvent}
            errors={this.state.errors}
          />
        );
      } else if (key === "id") {
        return (
          <InputField
            id={key}
            field={field}
            value={value}
            handleChange={this.handleChange}
            handleBlurEvent={this.form.handleBlurEvent}
            errors={this.state.errors}
            disabled={true}
          />
        );
      } else {
        return (
          <InputField
            id={key}
            field={field}
            value={value}
            handleChange={this.handleChange}
            handleBlurEvent={this.form.handleBlurEvent}
            errors={this.state.errors}
          />
        );
      }
    });
  }

  renderSubFields(key, field) {
    return (
      <div key={key}>
        <FormGroup>
          <Label>{field.title}:</Label>
          {Object.keys(field.subFields).map((subKey) => {
            const subValue = this.state.fields[key] && this.state.fields[key][subKey] === -1 ? '' : this.state.fields[key][subKey];
            if (subKey === "state") {
              return (
                <SelectField
                  id={`${key}.${subKey}`}
                  field={field.subFields[subKey]}
                  options={states}
                  value={subValue}
                  handleChange={this.handleChange}
                  handleBlurEvent={this.form.handleBlurEvent}
                  errors={this.state.errors}
                />
              );
            } else {
              return (
                <InputField
                  id={`${key}.${subKey}`}
                  field={field.subFields[subKey]}
                  value={subValue}
                  handleChange={this.handleChange}
                  handleBlurEvent={this.form.handleBlurEvent}
                  errors={this.state.errors}
                />
              );
            }
          })}
        </FormGroup>
      </div>
    );
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
