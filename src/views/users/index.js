import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {
  Container,
  Table,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  Pagination,
  PaginationItem,
  PaginationLink,
} from 'reactstrap';

const Index = () => {
  // states
  const [user, setUser] = useState([]);
  const [selectedUser, setSelectedUser] = useState([]);
  const [deleteModalToggle, setDeleteModalToggle] = useState(false);
  const [createModalToggle, setCreateModalToggle] = useState(false);
  const [editModalToggle, setEditModalToggle] = useState(false);
  const [pagination, setPagination] = useState({
    start: 0,
    end: 10,
  });
  const [newUser, setNewUser] = useState({
    email: '',
    first_name: '',
    last_name: '',
  });
  const [counter, setCounter] = useState(6);

  // functionality to get the users from api
  const getMethod = React.useCallback(() => {
    axios.get('https://reqres.in/api/users?page=1').then((response) => {
      console.log(response);
      const {data} = response.data;
      setUser(data);
    });
  }, []);

  // functionality to create user with put method and passing the new user data on axios
  const createMethod = React.useCallback(
    (e) => {
      e.preventDefault();

      const {id} = newUser;
      axios
        .put(`https://reqres.in/api/users/${id}`, newUser)
        .then((res) => console.log(res));
      setUser([...user, newUser]);
      setCreateModalToggle(!createModalToggle);
      setNewUser({
        email: '',
        first_name: '',
        last_name: '',
      });
    },
    [createModalToggle, newUser, user]
  );

  // functionality to delete user by id with axios delete method and passing the id of deleted user
  const deleteMethod = React.useCallback(async () => {
    const {id} = selectedUser;
    setDeleteModalToggle(!deleteModalToggle);
    axios
      .delete(`https://reqres.in/api/users/${id}`)
      .then((res) => console.log(res));
    const filteredUser = user.filter((item) => item.id !== id);
    setUser(filteredUser);
  }, [deleteModalToggle, selectedUser, user]);

  // functionality to edit user with axios put method with the id and data of edited user
  const editMethod = React.useCallback(
    (e) => {
      const {id} = selectedUser;
      axios
        .put(`https://reqres.in/api/users/${id}`, selectedUser)
        .then((res) => console.log(res));
      e.preventDefault();

      var data = [...user];
      var index = data.findIndex((obj) => obj.id === id);
      data[index].first_name = selectedUser.first_name;
      data[index].last_name = selectedUser.last_name;
      data[index].email = selectedUser.email;
      setUser([...data]);
      setEditModalToggle(!editModalToggle);
    },
    [editModalToggle, selectedUser, user]
  );

  // getting the api using axios
  useEffect(() => {
    getMethod();
  }, [getMethod]);

  // toggle the close and open of user creation modal
  const handleCreateModalToggle = React.useCallback(() => {
    setUser([...user]);
    setCreateModalToggle(!createModalToggle);
    setCounter((counter) => counter + 1);
  }, [createModalToggle, user]);

  // toggle the close and open of user delete modal
  const handleDeleteModalToggle = React.useCallback(
    (item) => {
      setSelectedUser(item);
      setDeleteModalToggle(!deleteModalToggle);
    },
    [deleteModalToggle]
  );

  // toggle the close and open of user edit modal
  const handleEditModalToggle = React.useCallback(
    (item) => {
      setSelectedUser(item);
      setEditModalToggle(!editModalToggle);
    },
    [editModalToggle]
  );

  // controls the form values of user creation form
  const handleCreateForm = React.useCallback(
    (event) => {
      const {name, value} = event.target;
      setNewUser((prevState) => ({
        ...prevState,
        [name]: value,
        id: counter,
        avatar: 'https://picsum.photos/200/300',
      }));
    },
    [counter]
  );

  // controls the input field of user edit form
  const handleEditForm = React.useCallback((event) => {
    const {name, value} = event.target;

    setSelectedUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  // cancel the user creation
  const cancelCreateModal = React.useCallback(() => {
    setCreateModalToggle(!createModalToggle);
    setCounter(counter - 1);
  }, [counter, createModalToggle]);

  // renders all the users
  const tableRenderer = React.useMemo(() => {
    const pageRenderer = user.slice(pagination.start, pagination.end);

    return pageRenderer.map((item) => {
      const {id, email, first_name, last_name, avatar} = item;
      return (
        <tbody key={id}>
          <tr>
            <th scope="row">{id}</th>
            <th>
              <img src={avatar} alt="user profile" width="65" height="65" />
            </th>
            <th>{email}</th>
            <th>{first_name}</th>
            <th>{last_name}</th>
            <th>
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => handleEditModalToggle(item)}
              >
                Edit
              </button>
            </th>
            <th>
              <button
                className="btn btn-danger"
                type="button"
                onClick={() => handleDeleteModalToggle(item)}
              >
                Delete
              </button>
            </th>
            <th />
          </tr>
        </tbody>
      );
    });
  }, [
    handleDeleteModalToggle,
    handleEditModalToggle,
    pagination.end,
    pagination.start,
    user,
  ]);

  // returns delete modal html elements
  const deleteModal = React.useMemo(() => {
    const {id, email, first_name, last_name, avatar} = selectedUser;
    return (
      <Modal isOpen={deleteModalToggle}>
        <ModalHeader>Delete User</ModalHeader>

        <ModalBody>
          <div>
            <p>
              <img src={avatar} alt="user profile" width="200" height="200" />
            </p>
            <p>{`user id: ${id}`}</p>
            <p>{`email: ${email}`}</p>
            <p>{`First name: ${first_name}`}</p>
            <p>{`Last name: ${last_name}`}</p>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={deleteMethod}>
            submit
          </Button>{' '}
          <Button
            color="secondary"
            onClick={() => setDeleteModalToggle(!deleteModalToggle)}
          >
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    );
  }, [deleteModalToggle, deleteMethod, selectedUser]);

  // returns create user modal html elements
  const createModal = React.useMemo(() => {
    return (
      <Modal isOpen={createModalToggle}>
        <ModalHeader>Create User</ModalHeader>
        <ModalBody>
          <Form onSubmit={createMethod}>
            <FormGroup>
              <Label for="Email">Email</Label>
              <Input
                required
                value={newUser.email}
                name="email"
                placeholder="Enter email"
                onChange={handleCreateForm}
              />

              <Label for="Firstname">Firstname</Label>
              <Input
                required
                value={newUser.firstname}
                name="first_name"
                placeholder="Enter firstname"
                onChange={handleCreateForm}
              />

              <Label for="lastname">Lastname</Label>
              <Input
                required
                value={newUser.lastname}
                name="last_name"
                placeholder="Enter lastname"
                onChange={handleCreateForm}
              />
            </FormGroup>
            <Button color="primary" type="submit">
              submit
            </Button>{' '}
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={cancelCreateModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    );
  }, [
    createModalToggle,
    createMethod,
    newUser.email,
    newUser.firstname,
    newUser.lastname,
    handleCreateForm,
    cancelCreateModal,
  ]);

  // returns edit modal html elements
  const editModal = React.useMemo(() => {
    const {first_name, last_name} = selectedUser;
    return (
      <Modal isOpen={editModalToggle}>
        <ModalHeader>Edit User</ModalHeader>
        <ModalBody>
          <h1>{`${last_name} , ${first_name}`}</h1>
          <Form onSubmit={editMethod}>
            <FormGroup>
              <Label for="Email">Enter new email:</Label>
              <Input
                value={selectedUser.email}
                name="email"
                placeholder=""
                onChange={handleEditForm}
                required
              />

              <Label for="Firstname">Enter new firstname:</Label>
              <Input
                value={selectedUser.first_name}
                name="first_name"
                placeholder=""
                onChange={handleEditForm}
                required
              />

              <Label for="lastname">Enter new lastname:</Label>
              <Input
                value={selectedUser.last_name}
                name="last_name"
                placeholder=""
                onChange={handleEditForm}
                required
              />
            </FormGroup>
            <Button color="primary" type="submit">
              submit
            </Button>{' '}
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button
            color="secondary"
            onClick={() => setEditModalToggle(!editModalToggle)}
          >
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    );
  }, [editMethod, editModalToggle, handleEditForm, selectedUser]);

  // handles next page
  const handleNextPage = React.useCallback(
    (e) => {
      e.preventDefault();
      const {start, end} = pagination;
      const usersArray = user.slice(start + 10, end + 10);
      usersArray.length !== 0 &&
        setPagination({
          ...pagination,
          start: start + 10,
          end: end + 10,
        });
    },
    [pagination, user]
  );

  // handles back apge
  const handleBackPage = React.useCallback(
    (e) => {
      e.preventDefault();
      pagination.start !== 0 &&
        pagination.end !== 10 &&
        setPagination({
          ...pagination,
          start: pagination.start - 10,
          end: pagination.end - 10,
        });
    },
    [pagination]
  );
  return (
    <Container>
      <div className="mt-3 text-right">
        <Button color="primary" onClick={handleCreateModalToggle}>
          + Add User
        </Button>
      </div>
      {createModal}
      {deleteModal}
      {editModal}

      <Table className="mt-3">
        <thead>
          <tr>
            <th>ID</th>
            <th>Profile</th>
            <th>Email</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th colspan="2">Action Buttons</th>
            <th />
          </tr>
        </thead>
        {tableRenderer}
      </Table>
      <Pagination aria-label="Page navigation example">
        <PaginationItem>
          <PaginationLink first href="#" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink previous href="#" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" onClick={handleNextPage}>
            Next
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" onClick={handleBackPage}>
            Back
          </PaginationLink>
        </PaginationItem>
      </Pagination>
    </Container>
  );
};

export default Index;
