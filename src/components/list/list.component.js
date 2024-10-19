import React, { Component } from 'react';
import PrisonerNetworkService from '../../services/prisoner-network-service';
import {Link } from 'react-router-dom';
import PrisonerForm from './inputform.component';
import { Button, Card, CardHeader, CardSubtitle, CardText, Col, Container, Input, InputGroup, List, ListGroup, Row } from 'reactstrap';
import fields from '../../global_vars/fields';
import UserNetworkService from '../../services/user-network-service';
import PrisonNetworkService from '../../services/prison-network-service';
import Item from '../individual/item.component';

class Prisoner extends Component {

  constructor(props) {
    super(props);
    
    this.getAllPrisoners = this.getAllPrisoners.bind(this);
    this.getAllUsers = this.getAllUsers.bind(this);
    this.getAllPrisons = this.getAllPrisons.bind(this);

    this.setActivePrisoner = this.setActivePrisoner.bind(this);
    this.setActivePrison = this.setActivePrison.bind(this);
    this.setActiveUser = this.setActiveUser.bind(this);


    this.addPrisoner = this.addPrisoner.bind(this);
    this.onChangeSearchName = this.onChangeSearchName.bind(this);
    this.handleDataFromChild = this.handleDataFromChild.bind(this);
    this.displayFields = this.displayFields.bind(this);
    this.listData = this.listData.bind(this);
    this.editButton = this.editButton.bind(this);

    this.state = {
      currentPrisoner: null,
      currentUser: null,
      currentPrison: null,
      currentIndex: -1,
      prisoners: [],
      users: [],
      prisons: [],
      searchName: ' ',
      addForm: {}
      }
  }

  componentDidMount() {
    this.getAllPrisoners();
    this.getAllUsers();
    this.getAllPrisons();
  }

  getAllPrisoners() {
    PrisonerNetworkService.getAll().then((response) => {
      console.log(Object.values(response.data.data))
      this.setState({
        prisoners: Object.values(response.data.data)
      }, () => { console.log(response.data.data) }
    )
    })
  };

  getAllUsers() {
    UserNetworkService.getAll().then((response) => {
      console.log(Object.values(response.data.data));
      this.setState({
        users: Object.values(response.data.data)
      }, () => {  })
    })
  };

  getAllPrisons() {
    PrisonNetworkService.getAll().then((response) => {
      console.log(Object.values(response.data.data));
      this.setState({
        prisons: Object.values(response.data.data)
      }, () => { console.log(this.state.prisons) })
    })
  }

  listData() {
    switch (this.props.subject) {
      case "Prisoner": {
        return this.state.prisoners &&
        this.state.prisoners.map((prisoner, index) => (
                <Item settingFunction={this.setActivePrisoner} individual={prisoner} index={index} toDisplay='chosenName' currentIndex={this.state.currentIndex} />
              ))
      }
      case "User": {
        return this.state.users &&
        this.state.users.map((user, index) => (
                <Item settingFunction={this.setActiveUser} individual={user} index={index} toDisplay='username' currentIndex={this.state.currentIndex} />
              ))
      }
      case "Prison": {
        return this.state.prisons &&
        this.state.prisons.map((prison, index) => (
                <Item settingFunction={this.setActivePrison} individual={prison} index={index} toDisplay='prisonName' currentIndex={this.state.currentIndex} />
              ))
      }
      default: {}
    }
  }

  editButton() {
    console.log(this.props.subject)
    switch (this.props.subject) {
      case "Prisoner": {
        return this.state.currentPrisoner && `/prisoner/${this.state.currentPrisoner.id}`}
      case "User": {
        return this.state.currentUser && `/user/${this.state.currentUser.id}`}
      } }

  handleDataFromChild(prisoner) {
    console.log('handling data from child');
    this.setState(prevState => ({
      prisoners: [...prevState.prisoners, prisoner]
    }));
  }

  addPrisoner() {
    PrisonerNetworkService.addOne().then((response) => {
      console.log(response);
    })
  }

  setActivePrisoner(prisoner, index) {
    console.log(prisoner);
    this.setState({
      currentPrisoner: prisoner,
      currentIndex: index
    });
  }

  setActiveUser(user, index) {
    console.log(user);
    this.setState({
      currentUser: user,
      currentIndex: index
    });
  }

  setActivePrison(prison, index) {
    this.setState({
      currentPrison: prison,
      currentIndex: index
    })
  }

  onChangeSearchName(e) {
    const searchName = e.target.value;
    this.setState({
      searchName: searchName
    });
  }

  displayFields(currentPrisoner, currentUser, currentPrison) {
    if (this.props.subject === "Prisoner" && currentPrisoner) {
      return Object.keys(fields[this.props.subject]).map((key) => {
        return <div key={key}>
          <strong>{ fields[this.props.subject][key].title}: </strong> {currentPrisoner[key]}
        </div>
      })
    }
    else if (this.props.subject === "User" && currentUser) {
      return Object.keys(fields[this.props.subject]).map((key) => {
        return <div key={key}>
          <strong>{ fields[this.props.subject][key].title}: </strong> {currentUser[key]}
        </div>
      })
    }
    else if (this.props.subject === "Prison" && currentPrison) {
      return Object.keys(fields[this.props.subject]).map((key) => {
        return <div key={key}>
          <strong>{ fields[this.props.subject][key].title}: </strong> {currentPrison[key]}
        </div>
      })
    }
    else {
      return null
    }

    }

  render() {
    const { searchName, currentPrisoner, currentUser, currentPrison, currentIndex, prisoners } = this.state;
    var editLink = this.editButton();

    return (
      <Container>
        <Row>
          <h1>{this.props.subject}s</h1>
        </Row>
        <Row>
        <Col md="8">
          <InputGroup className='pb-3'>
          <Input
            type='text'
            className='form-control'
            placeholder='Search by name'
            value={searchName}
            onChange={this.onChangeSearchName}
          />
          <div className='input-group-append'>
          <Button color='secondary'>
          Search
        </Button>
          </div>
          </InputGroup>
        </Col>
        </Row>
        <List className="row">
        <div className='col-md-6'>
        <ListGroup>
        {
          this.listData()
              }
        </ListGroup>
        <Button color="danger" className="m-3">
            Remove All
          </Button>
        </div>
        <Col md={6}>
          {currentPrisoner || currentUser || currentPrison ? (
            <>
              <Card>
                <CardHeader>{this.props.subject}</CardHeader> 
                <CardSubtitle></CardSubtitle>
                <CardText tag="span">
                  {this.displayFields(currentPrisoner, currentUser, currentPrison)}
                  <Link to={editLink}><Button className='mx-2' size='sm' color='primary'>Edit</Button></Link>
                  <Button size='sm' color='danger' className='mx-2'>Delete</Button>
                </CardText>
              </Card>
            </>
          ) : (
            <div>
              <br />
              <p>Please click on a {this.props.subject}.</p>
            </div>
          )}
        </Col>
        </List>
        <PrisonerForm key={this.props} subject={this.props.subject} handleDataFromChild={this.handleDataFromChild}/>
      </Container>
    )
  }
}

export default Prisoner;