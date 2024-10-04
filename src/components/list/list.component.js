import React, { Component } from 'react';
import PrisonerDataService from '../../services/prisoner-network-service';
import { Button, Card, CardHeader, CardSubtitle, CardText, Col, Container, Input, InputGroup, List, ListGroup, Row } from 'reactstrap';
import {Link } from 'react-router-dom';
import PrisonerForm from './inputform.component';
import fields from '../../global_vars/fields';
import userDataService from '../../services/user-data-service';

class Prisoner extends Component {

  constructor(props) {
    super(props);
    
    this.getAllPrisoners = this.getAllPrisoners.bind(this);
    this.addPrisoner = this.addPrisoner.bind(this);
    this.setActivePrisoner = this.setActivePrisoner.bind(this);
    this.onChangeSearchName = this.onChangeSearchName.bind(this);
    this.handleDataFromChild = this.handleDataFromChild.bind(this);
    this.displayFields = this.displayFields.bind(this);
    this.getAllUsers = this.getAllUsers.bind(this);
    this.listData = this.listData.bind(this);

    this.state = {
      currentPrisoner: null,
      currentUser: null,
      currentIndex: -1,
      prisoners: [],
      users: [],
      searchName: ' ',
      addForm: {}
    }
  }

  componentDidMount() {
    this.getAllPrisoners();
    this.getAllUsers();
  }

  getAllPrisoners() {
    PrisonerDataService.getAll().then((response) => {
      this.setState({
        prisoners: response.data.prisoners
      }, () => { console.log(response.data.prisoners) }
    )
    })
  };

  getAllUsers() {
    userDataService.getAll().then((response) => {
      this.setState({
        users: response.data.users
      }, () => { console.log(response.data.users) })
    })
  }

  listData() {
    switch (this.props.subject) {
      case "Prisoner": {
        return this.state.prisoners &&
        this.state.prisoners.map((prisoner, index) => (
                <li
                  className={ 'list-group-item ' + (index === this.state.currentIndex ? 'active' : '') }
                  onClick={ () => this.setActivePrisoner(prisoner, index) }
                  key={index}>
                  {prisoner.chosenName}
                </li>
              ))
      }
      case "User": {
        return this.state.users &&
        Object.values(this.state.users).map((user, index) => (
                <li
                  className={ 'list-group-item ' + (index === this.state.currentIndex ? 'active' : '') }
                  onClick={ () => this.setActivePrisoner(user, index) }
                  key={index}>
                  {user.username}
                </li>
              ))
      }
      default: {}
    }
  }

  handleDataFromChild(prisoner) {
    console.log('handling data from child');
    this.setState(prevState => ({
      prisoners: [...prevState.prisoners, prisoner]
    }));
  }

  addPrisoner() {
    PrisonerDataService.addOne().then((response) => {
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

  onChangeSearchName(e) {
    const searchName = e.target.value;
    this.setState({
      searchName: searchName
    });
  }

  displayFields(currentPrisoner) {
    return Object.keys(fields[this.props.subject]).map((key) => {
      return <div key={key}>
        <strong>{ fields[this.props.subject][key].title}: </strong> {currentPrisoner[key]}
      </div>
    })
  }

  render() {
    const { searchName, currentPrisoner, currentIndex, prisoners } = this.state;

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
          {currentPrisoner ? (
            <>
              <Card>
                <CardHeader>{this.props.subject}</CardHeader> 
                <CardSubtitle></CardSubtitle>
                <CardText tag="span">
                  {this.displayFields(currentPrisoner)}
                  <Link to={'/prisoner/' + currentPrisoner.uuid}><Button className='mx-2' size='sm' color='primary'>Edit</Button></Link>
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