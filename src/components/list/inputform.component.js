import React from "react";
import { Button, Form, FormGroup, Input, Label } from "reactstrap";
import PrisonerDataService from '../../services/prisoner-network-service';
import UserDataService from "../../services/user-data-service";
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

    var po = this.propertyObject()

    this.state = {
      po
    }
  }

  propertyObject() {
    return Object.keys(fields[this.props.subject]).reduce((acc, element) => {
      acc[element] = fields[this.props.subject][element].default;
      return acc
    }, {})
  }

  handleChange(e) {
    console.log(e.target.value);
    this.setState({
      ...this.state,
      [e.target.id]: e.target.value
    });
  }

  async buttonSubmit(e) {
    e.preventDefault()
    PrisonerDataService.addOne(this.state).then(response => {
      if (response.status === 200) { console.log("Success!")
        this.props.handleDataFromChild(this.state);
      }
      else { console.log("Fail :-(") }
    })
  }

  componentDidMount() {
    const {subject, solo} = this.props;
    const {id} = this.props.router.params;
    console.log(`id = ${id}`)
    console.log(`solo = ${solo}`)
    console.log(`subject = ${subject}`)
    if (solo) {
      // switch (subject) {
      //   case "Prisoner": {
      //     this.getPrisoner(id).then((response) => {
      //       console.log(response)
      //     })
      //   }
      // }
    }
  }

  getPrisoner() {
    const {id} = this.props.router.params;
    // PrisonerDataService.getOne(id).then((response) => {
    //   console.log(response)
    // });
  }

  getUser() {
    UserDataService.getAll(this.props.match.id);
  }

  clearFields() {
    this.setState({
      chosenName: '',
      birthName: '',
      bio: '',
      releaseDate: '1999-09-09',
      prison: 1,
      inmateID: 0
    })
  }

  displayFields() {
    console.log(this.props.subject);
    return Object.keys(fields[this.props.subject]).map((key) => {
      return <div>
        <FormGroup key={key}>
          <Label>{ fields[this.props.subject][key].title}: </Label>
          <Input id={key} key={key} name={key} value={this.state[key]} type={fields[this.props.subject][key].type} />
        </FormGroup>
        </div>
    })
  }

    render() {
        return (
            <>
            <Form>
            {this.displayFields()}
              <Button onClick={this.buttonSubmit}>
                Submit
              </Button>
            </Form>
            </>
        )
    }
}

export default withRouter(InputForm);