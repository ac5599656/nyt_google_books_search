import React, { Component } from "react";
import SaveBtn from "../components/SaveBtn";
import Jumbotron from "../components/Jumbotron";
import API from "../utils/API";
import GoogleAPI from "../utils/GoogleAPI";
import { Col, Row, Container } from "../components/Grid";
import { List, ListItem } from "../components/List";
import { Input, FormBtn } from "../components/Form";

class Books extends Component {
  state = {
    books: [],
    search: ""
  };

  handleFormSubmit = event => {
    event.preventDefault();
    let query = this.state.search.replace(" ", "+");
    GoogleAPI.getGoogleBooks(query)
      .then(res => {
        this.setState({ books: res.data.items });
      })
      .catch(err => console.log(err));
  };

  saveBook = id => {
    API.savedBook({
      title: this.state.books[id].volumeInfo.title,
      authors: this.state.books[id].volumeInfo.authors,
      description: this.state.books[id].volumeInfo.description,
      image: this.state.books[id].volumeInfo.imageLinks.smallThumbnail,
      link: this.state.books[id].volumeInfo.infoLink
    }).then(this.props.history.push("/saved"));
  };

  handleInputChange = event => {
    this.setState({ search: event.target.value });
  };

  render() {
    return (
      <Container fluid>
        <Row>
          <Col size="md-6">
            <Jumbotron>
              <h1>What Books Should I Read?</h1>
            </Jumbotron>
            <form onSubmit={this.handleFormSubmit}>
              <Input
                type="text"
                id="search"
                value={this.state.search}
                onChange={this.handleInputChange}
                aria-label="search"
                placeholder="title book (required)"
              />
              <FormBtn>Submit Book</FormBtn>
            </form>
          </Col>
          <Col size="md-6 sm-12">
            <Jumbotron>
              <h1>Books On My List</h1>
            </Jumbotron>
            {this.state.books.length ? (
              <List>
                {this.state.books.map((book, index) => {
                  return (
                    <ListItem key={index}>
                      <img
                        src={book.volumeInfo.imageLinks.smallThumbnail}
                        alt={book.volumeInfo.title}
                      />
                      <strong>
                        {book.volumeInfo.title} by {book.volumeInfo.authors}
                      </strong>
                      <p>{book.volumeInfo.description}</p>
                      <a href={book.volumeInfo.infoLink} target="_blank">
                        View More
                      </a>
                      <SaveBtn
                        onClick={() =>
                          this.saveBook(
                            index,
                            book.volumeInfo.imageLinks.smallThumbnal,
                            book.volumeInfo.title,
                            book.volumeInfo.description,
                            book.volumeInfo.authors,
                            book.volumeInfo.infoLink
                          )
                        }
                      />
                    </ListItem>
                  );
                })}
              </List>
            ) : (
              <h3>No Results to Display</h3>
            )}
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Books;
