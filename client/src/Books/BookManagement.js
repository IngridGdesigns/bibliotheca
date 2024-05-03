import React, { Component } from 'react';
import axios from 'axios';
import { withAuth0 } from "@auth0/auth0-react";
import AddBookForm from './addBook';

class BookManagement extends Component {
  constructor(props) {
    super(props);
      this.state = {
        books: [],
        loading: true,
        error: null
    };
  
    // Bind handleAddBook method
    this.handleAddBook = this.handleAddBook.bind(this);
    // this.getAccessToken = this.getAccessToken.bind(this);

}

  // getAccessToken = () => { 
  //     //  const headers = { 'Authorization': `Bearer ${this.props.auth.accessToken}`, 'Content-Type': 'application/json'}
        
  //     if(!accessToken) {
  //         throw new Error('No access token found');
  //         } 
          
  //    return accessToken;
  // }
  
    componentDidMount() {
      this.handleGettingBooks();
  }
  

  handleGettingBooks() {
    const { getAccessTokenSilently } = this.props.auth0;
    const accessToken = getAccessTokenSilently();

    axios.get('http://localhost:3001/api/books',{
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
        }
      })
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
  
  handleAddBook(newBook) {
    //no need to declare prevent default
    const { getAccessTokenSilently } = this.props.auth0;

        getAccessTokenSilently()
      .then((accessToken) => {
        axios
          .post("http://localhost:3001/api/books/add", newBook, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          })
          .then((response) => {
            this.setState((prevState) => ({
              books: [...prevState.books, newBook],
            }));
          })
          .catch((error) => {
            console.error("Error adding book:", error);
          });
      })
      .catch((error) => {
        console.error("Error getting access token:", error);
      });
  }
    // const accessToken = getAccessTokenSilently();

//     axios.post('http://localhost:3001/api/books/add', newBook, {
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${accessToken}`
//       }
//     })
//     .then(response => {
//       this.setState(prevState => ({
//         books: [...prevState.books, newBook], //include new book
//       }));
//     })
//     .catch(error => {
//       console.error('Error adding book:', error);
//     });
//  }
  
  onDeleteBook(bookId) {
    const { getAccessTokenSilently } = this.props.auth0;
    const accessToken = getAccessTokenSilently();

    axios.delete(`https://localhost:3001/api/books/delete/${bookId}`, {
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    }).then(response => {
    
      this.setState(prevState => ({
        books: prevState.books.filter(book => book.book_id !== bookId)
      }));
    })
      .catch(error => {
          console.log('Error while deleting a book', error);
      })
  }

  // // Method to get books (not directly related to AddBookForm)
  // getBooks() {
  //   // This method can be used to retrieve books from an API or elsewhere
  //   // Return the book data
  //   return this.state.books;
  // }

  // addNewBook = (newBook) => {
  //   // let newBook = {
  //   //   category_name:
  //   //   publisher_name:
  //   //   title:
  //   //   description:
  //   //   publication_year:
  //   //   pages:
  //   //   isbn:
  //   //   language:
  //   //   publisher_name
  // }   

//   handleAddBook() = {
//     // axios

//     this.setState(prevState => ({
//       books: [...prevState, newBook],
//     }))
// }
  // createBook(bookData) {
   
  //   // this.books.push(bookData);
  // }


  // getAllBooks() {
  //   return this.books;
  // }


  // getBook(id) {
  //   return this.books[id];
  // }

 
  // updateBook(id, updatedBookData) {
  //   this.books[id] = updatedBookData;
  // }

 
  // deleteBook(id) {
  //   this.books.splice(id, 1);
  // }

// // Example usage
// const bookManager = new BookManager();

// // Create books
// bookManager.createBook({ title: "Book 1", author: "Author 1" });
// bookManager.createBook({ title: "Book 2", author: "Author 2" });

// // Read all books
// console.log(bookManager.getAllBooks());

// // Read a single book
// console.log(bookManager.getBook(0));

// // Update a book
// bookManager.updateBook(0, { title: "Updated Book 1", author: "Updated Author 1" });
// console.log(bookManager.getAllBooks());

// // Delete a book
// bookManager.deleteBook(0);
// console.log(bookManager.getAllBooks());


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
        <h1>Book Management</h1>
        {/* Pass the handleAddBook function as a prop to AddBookForm */}
        <AddBookForm handleAddBook={this.handleAddBook} />

          {/* <ListBooks books={books} loading={loading} error={error} onDeleteBook={this.onDeleteBook} /> */}
        {/* render other components or data related to book management */}
        <div>
            <h2>Book List</h2>
            <div className="card-deck">
                {books ? books.map(book => (
                    <div key={book.book_id} className="card">
                        <div className="card-body">
                            <h5 className="card-title">{book.title}</h5>
                            <p className="card-text">Publication Year: {book.publication_year}</p>
                      {/* Add more details here */}
                      <button className="btn btn-danger" onClick={() => this.onDeleteBook(book.book_id)}>
                            Delete
                      </button>

                        </div>
                    </div>
                )) : 'No data available'}
            </div>
        </div>
      </div>
    );
  }
}

export default withAuth0(BookManagement);