
import React from "react";
import { Card, CardBody, CardHeader, ListGroup, ListGroupItem } from "reactstrap";

class ResultsCard extends React.Component {
  render() {
    const { title, tasks, results } = this.props;

    return (
      <Card>
        <CardHeader>{title}</CardHeader>
        <CardBody>
          <ListGroup>
            {tasks.map(task => (
              <ListGroupItem key={task}>
                {task}: {results[task] === null ? "Pending" : results[task] ? "✔️" : "❌"}
              </ListGroupItem>
            ))}
          </ListGroup>
        </CardBody>
      </Card>
    );
  }
}

export default ResultsCard;