import React, { Component } from 'react';
import PrisonerNetworkService from '../../services/prisoner-network-service';
import {Link } from 'react-router-dom';
import InputForm from './inputform.component';
import { Button, Card, CardHeader, CardSubtitle, CardText, Col, Container, Input, InputGroup, List, ListGroup, Row } from 'reactstrap';
import fields from '../../global_vars/fields';
import UserNetworkService from '../../services/user-network-service';
import PrisonNetworkService from '../../services/prison-network-service';
import RuleNetworkService from '../../services/rule-network-service';
import Item from '../individual/item.component';

class ListPage extends Component {

  constructor(props) {
    super(props);
    
    this.getAllPrisoners = this.getAllPrisoners.bind(this);
    this.getAllUsers = this.getAllUsers.bind(this);
    this.getAllPrisons = this.getAllPrisons.bind(this);
    this.getAllRules = this.getAllRules.bind(this)

    this.setActivePrisoner = this.setActivePrisoner.bind(this);
    this.setActivePrison = this.setActivePrison.bind(this);
    this.setActiveUser = this.setActiveUser.bind(this);
    this.setActiveRule = this.setActiveRule.bind(this);

    this.onChangeSearchName = this.onChangeSearchName.bind(this);
    this.handleDataFromChild = this.handleDataFromChild.bind(this);
    this.displayFields = this.displayFields.bind(this);
    this.listData = this.listData.bind(this);
    this.editButton = this.editButton.bind(this);
    this.deleteItem = this.deleteItem.bind(this);

    this.state = {
      currentPrisoner: null,
      currentUser: null,
      currentPrison: null,
      currentRule: null,
      currentIndex: -1,
      prisoners: [],
      users: [],
      prisons: [],
      rules: [],
      searchName: '',
      token: '',
      errorText: ''
      }
  }

  componentDidMount() {
    try {
      const token = typeof this.props.token === 'string' && this.props.token.startsWith('{') ? JSON.parse(this.props.token) : this.props.token;
      this.setState({
        token: token['token'] || token
      }, () => {
        this.getAllPrisoners();
        this.getAllUsers();
        this.getAllPrisons();
        this.getAllRules();
      });
    } catch (error) {
      console.error("Invalid token format:", error);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.searchName !== this.state.searchName) {
      this.listData();
    }
  }

  getAllPrisoners() {
    PrisonerNetworkService.getAll(this.state.token).then((response) => {
      this.setState({
        prisoners: Object.values(response.data.data)
      });
    });
  };

  getAllUsers() {
    UserNetworkService.getAll(this.state.token).then((response) => {
      this.setState({
        users: Object.values(response.data.data)
      });
    });
  };

  getAllPrisons() {
    PrisonNetworkService.getAll(this.state.token).then((response) => {
      this.setState({
        prisons: Object.values(response.data.data)
      });
    });
  }

  getAllRules() {
    RuleNetworkService.getAll(this.state.token).then((response) => {
      this.setState({
        rules: Object.values(response.data.data)
      });
    });
  }

  deleteItem() {
    switch (this.props.subject) {
      case "Prisoner": {
        const { id } = this.state.currentPrisoner;
        PrisonerNetworkService.deleteOne(id, this.state.token).then((response) => {
          if (response.data.data === 1) {
            this.setState(prevState => ({
              prisoners: prevState.prisoners.filter(prisoner => prisoner.id !== id),
              currentPrisoner: null,
              currentIndex: -1
            }));
          } else {
            this.setState({
              errorText: `Unable to delete ${this.props.subject}`
            });
          }
        }).catch(error => {
          console.error(`Error deleting ${this.props.subject}:`, error.message);
          this.setState({
            errorText: error.message
          });
        });
        break;
      }
      case "Prison": {
        const { id } = this.state.currentPrison;
        PrisonNetworkService.deleteOne(id, this.state.token).then((response) => {
          if (response.data.data === 1) {
            this.setState(prevState => ({
              prisons: prevState.prisons.filter(prison => prison.id !== id),
              currentPrison: null,
              currentIndex: -1
            }))
          }else {
            this.setState({
              errorText: `Unable to delete ${this.props.subject}`
            });
          }
        }).catch(error => {
          console.error(`Error deleting ${this.props.subject}:`, error.message);
          this.setState({
            errorText: error.message
          });
        });
        break;
      }
      case "Rule": {
        const { id } = this.state.currentRule;
        RuleNetworkService.deleteOne(id, this.state.token).then((response) => {
          if (response.data.data === 1) {
            this.setState(prevState => ({
              rules: prevState.rules.filter(rule => rule.id !== id),
              currentRule: null,
              currentIndex: -1
            }))
          }else {
            this.setState({
              errorText: `Unable to delete ${this.props.subject}`
            });
          }
        }).catch(error => {
          console.error(`Error deleting ${this.props.subject}:`, error.message);
          this.setState({
            errorText: error.message
          });
        });
        break;
      }
      default: {}
    }
  }

  listData() {
    const { searchName } = this.state;
    const filterItems = (items, displayField) => {
      return items.filter(item => {
        if (searchName.length >= 3) {
          return Object.values(item).some(value => 
            value && value.toString().toLowerCase().includes(searchName.toLowerCase())
          );
        }
        return true;
      });
    };
  
    switch (this.props.subject) {
      case "Prisoner": {
        const filteredPrisoners = filterItems(this.state.prisoners, 'chosenName');
        return filteredPrisoners.map((prisoner, index) => (
          <Item key={prisoner.id} settingFunction={this.setActivePrisoner} individual={prisoner} index={index} toDisplay='chosenName' currentIndex={this.state.currentIndex} />
        ));
      }
      case "User": {
        const filteredUsers = filterItems(this.state.users, 'username');
        return filteredUsers.map((user, index) => (
          <Item key={user.id} settingFunction={this.setActiveUser} individual={user} index={index} toDisplay='username' currentIndex={this.state.currentIndex} />
        ));
      }
      case "Prison": {
        const filteredPrisons = filterItems(this.state.prisons, 'prisonName');
        return filteredPrisons.map((prison, index) => (
          <Item key={prison.id} settingFunction={this.setActivePrison} individual={prison} index={index} toDisplay='prisonName' currentIndex={this.state.currentIndex} />
        ));
      }
      case "Rule": {
        const filteredRules = filterItems(this.state.rules, 'title');
        return filteredRules.map((rule, index) => (
          <Item key={rule.id} settingFunction={this.setActiveRule} individual={rule} index={index} toDisplay='title' currentIndex={this.state.currentIndex} />
        ));
      }
      default: {
        return null;
      }
    }
  }

  editButton() {
    switch (this.props.subject) {
      case "Prisoner": {
        return this.state.currentPrisoner && `/prisoner/${this.state.currentPrisoner.id}`}
      case "User": {
        return this.state.currentUser && `/user/${this.state.currentUser.id}`}
      case "Prison": {
        return this.state.currentPrison && `/prison/${this.state.currentPrison.id}`}
      case "Rule": {
        return this.state.currentRule && `/rule/${this.state.currentRule.id}`}
      } }

  async handleDataFromChild(item) {
    switch (this.props.subject) {
      case "Prisoner": {
        this.setState(prevState => ({
          prisoners: [...prevState.prisoners, item]
        }));
        break;
      }
      case "User": {
        this.setState(prevState => ({
          users: [...prevState.users, item]
        }));
        break;
      }
      case "Prison": {
        this.setState(prevState => ({
          prisons: [...prevState.prisons, item]
        }));
        break;
      }
      case "Rule": {
        this.setState(prevState => ({
          rules: [...prevState.rules, item]
        }));
        break;
      }
      default: {
        console.error("Unknown subject:", this.props.subject);
      }
    }
  }

  setActivePrisoner(prisoner, index) {
    console.log(prisoner);
    this.setState({
      currentPrisoner: prisoner,
      currentIndex: index
    });
  }

  setActiveUser(user, index) {
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

  setActiveRule(rule, index) {
    this.setState({
      currentRule: rule,
      currentIndex: index
    })
  }

  onChangeSearchName(e) {
    const searchName = e.target.value;
    this.setState({
      searchName: searchName
    });
  }

  displayFields(currentPrisoner, currentUser, currentPrison, currentRule) {
    const renderFields = (subject, currentItem) => {
      return Object.keys(fields[subject]).map((key) => {
        const field = fields[subject][key];
        if (field.meta && field.subFields) {
          return (
            <div key={key}>
              <strong>{field.title}:</strong>
              {Object.keys(field.subFields).map((subKey) => {
                return (
                  <div key={subKey} style={{ marginLeft: '20px' }}>
                    <strong>{field.subFields[subKey].title}:</strong> {currentItem[key][subKey]}
                  </div>
                );
              })}
            </div>
          );
        } else {
          if (field.title === "Prison") {
            return (
              <div key={key}>
              <strong>{field.title}:</strong> <Link to={`/prison/${currentItem[key]}`}>{currentItem[key]}</Link>
            </div>
            )
          } else {
          return (
            <div key={key}>
              <strong>{field.title}:</strong> {currentItem[key]}
            </div>
          );
        }
        }
      });
    };
  
    if (this.props.subject === "Prisoner" && currentPrisoner) {
      return renderFields("Prisoner", currentPrisoner);
    } else if (this.props.subject === "User" && currentUser) {
      return renderFields("User", currentUser);
    } else if (this.props.subject === "Prison" && currentPrison) {
      return renderFields("Prison", currentPrison);
    } else if (this.props.subject === "Rule" && currentRule) {
      return renderFields("Rule", currentRule);
    } else {
      return null;
    }
  }

  render() {
    const { searchName, currentPrisoner, currentUser, currentPrison, currentRule, currentIndex } = this.state;
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
            id='searchName'
            name='searchName'
            type='text'
            className='form-control'
            placeholder='Search by name'
            value={searchName}
            onChange={this.onChangeSearchName}
          />
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
          {currentPrisoner || currentUser || currentPrison || currentRule ? (
            <>
              <Card>
                <CardHeader>{this.props.subject}</CardHeader> 
                <CardSubtitle></CardSubtitle>
                <CardText className='p-3' tag="span">
                  {this.displayFields(currentPrisoner, currentUser, currentPrison, currentRule)}
                  <Link to={editLink}><Button className='mx-2' size='sm' color='primary'>Edit</Button></Link>
                  <Button onClick={this.deleteItem} size='sm' color='danger' className='mx-2'>Delete</Button>
                </CardText>
              </Card>              
              <p className='text-danger'>{this.state.errorText}</p>

            </>
          ) : (
            <div>
              <br />
              <p>Please click on a {this.props.subject}.</p>        

            </div>
          )}
        </Col>
        </List>
        <Row>
          <Col>

          </Col>
        </Row>
        <InputForm key={this.props} subject={this.props.subject} token={this.props.token} handleDataFromChild={this.handleDataFromChild}/>
      </Container>
    )
  }
}

export default ListPage;