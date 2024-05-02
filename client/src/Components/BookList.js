import React, { Component } from 'react';
import axios from 'axios';

class BookList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      books: [],
      loading: true,
      error: null
    };
  }

  componentDidMount() {
    this.fetchBooks();
  }

  fetchBooks() {
    axios.get('/api/books')
      .then(response => {
        this.setState({
          books: response.data,
          loading: false,
          error: null
        });
      })
      .catch(error => {
        this.setState({
          books: [],
          loading: false,
          error: 'Error fetching books.'
        });
      });
  }

  render() {
    const { books, loading, error } = this.state;

    if (loading) {
      return <div>Loading...</div>;
    }

    if (error) {
      return <div>Error: {error}</div>;
    }

    return (
      <div>
        <h2>Book List</h2>
        <ul>
          {books.map(book => (
            <li key={book.book_id}>{book.title}</li>
          ))}
        </ul>
      </div>
    );
  }
}

export default BookList;
