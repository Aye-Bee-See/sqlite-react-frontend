import React, { Component } from 'react';
import PrisonerDataService from '../../services/prisoner-network-service';
import { Button, Card, CardHeader, CardSubtitle, CardText, Col, Form, FormGroup, Input, InputGroup, Label, List, ListGroup } from 'reactstrap';
import { Redirect, Link } from 'react-router-dom';

class Prisoner extends Component {

  constructor(props) {
    super(props);
    
    this.getAllPrisoners = this.getAllPrisoners.bind(this);
    this.setActivePrisoner = this.setActivePrisoner.bind(this);
    this.onChangeSearchName = this.onChangeSearchName.bind(this);

    this.state = {
      currentPrisoner: null,
      currentIndex: -1,
      prisoners: [],
      searchName: ' '
    }
  }

  componentDidMount(){
    this.getAllPrisoners()
  }

  getAllPrisoners() {
    PrisonerDataService.getAll().then((response) => {
      // console.log(response);
      this.setState({
        prisoners: response.data
      }, () => {console.log(this.state.prisoners)})
    })
  }

  setActivePrisoner(prisoner, index) {
    console.log(prisoner);
    this.setState({
      currentPrisoner: prisoner,
      currentIndex: index
    });
  }

  onChangeSearchName(e) {
    const searchName = e.target.value;

    this.setState({
      searchName: searchName
    });
  }

  render() {
    const { searchName, currentPrisoner, currentIndex, prisoners } = this.state;

    return (
      <>
        <h1>Prisoners</h1>
        <List className="row">
        <Col md="8">
          <InputGroup>
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
        <div className='col-md-6'>
        <ListGroup>
        {prisoners &&
              prisoners.map((prisoner, index, currentIndex) => (
                <li
                  className={'list-group-item ' + (index === currentIndex ? 'active' : '')}
                  onClick={() => this.setActivePrisoner(prisoner, index)}
                  key={index}>
                  {prisoner.chosenName}
                </li>
              ))}
        </ListGroup>
        <Button color="danger" className="m-3">
            Remove All
          </Button>
        </div>
        <Col md={6}>
          {currentPrisoner ? (
            <div>
              <Card>
                <CardHeader>Prisoner</CardHeader>
                <CardSubtitle></CardSubtitle>
                <CardText>
                  <div>
                    <Label>
                      <strong>Preferred Name:</strong>
                    </Label>{' '}
                    {currentPrisoner.chosenName}
                  </div>
                  <div>
                    <Label>
                      <strong>Bio:</strong>
                    </Label>{' '}
                    {currentPrisoner.bio}
                  </div>
                  <div>
                    <Label>
                      <strong>UUID:</strong>
                    </Label>{' '}
                    {currentPrisoner.id}
                  </div>
                  <div>
                    <Label>
                      <strong>Prison:</strong>
                    </Label>{' '}
                    {console.log(currentPrisoner.prison)}
                    {currentPrisoner.prisonDetails.prisonName ? (<Link to={'/prison/' + currentPrisoner.prisonDetails.id}>{currentPrisoner.prisonDetails.prisonName}</Link>) : "Null"}
                  </div>
                  <div>
                    <Label>
                      <strong>Inmate ID:</strong>
                    </Label>{' '}
                    {currentPrisoner.inmateID}
                  </div>
                  <div>
                    <Label>
                      <strong>Release Date:</strong>
                    </Label>{' '}
                    {currentPrisoner.releaseDate}
                  </div>
                  <div>
                    <Label>
                      <strong>Birth Name:</strong>
                    </Label>{' '}
                    {currentPrisoner.birthName}
                  </div>
                  <Link to={'/prisoner/' + currentPrisoner.uuid}><Button className='mx-2' size='sm' color='primary'>Edit</Button></Link>
                  <Button size='sm' color='danger' className='mx-2'>Delete</Button>
                </CardText>
              </Card>
            </div>
          ) : (
            <div>
              <br />
              <p>Please click on a Prisoner...</p>
            </div>
          )}
        </Col>

        </List>
      </>
    )
  }
}

export default Prisoner;