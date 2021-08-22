import React from 'react';
import {Container, Jumbotron} from 'reactstrap';
import {profile} from '../../models/models';

const Index = () => {
  const {name, email, number} = profile;

  return (
    <Container>
      <Jumbotron className="mt-5">
        <h1 className="display-4">&#123;{name}&#125;</h1>
        <address>
          <a href={`mailto:${email}`}>{email}</a>
          <br />
          <a href={`+63${number}`}>{`0${number}`}</a>
        </address>
      </Jumbotron>
    </Container>
  );
};

export default Index;
