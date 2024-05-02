// import React, { Component, useEffect, useState, componentIsMounted } from "react";
// import { getConfig } from '../config';
// import { useAuth0, withAuthenticationRequired, getAccessTokenSilently } from "@auth0/auth0-react";

// function FetchAllBooks() {
//   const { apiOrigin = "http://localhost:3001", config } = getConfig();
//   const { getAccessTokenSilently } = useAuth0();

//   const [books, setBooks] = useState(null);

//   useEffect(() => {
//     const fetchBooks = async () => {
//       try {
//         const token = await getAccessTokenSilently();

//         const response = await fetch(`${apiOrigin}/api/books/details`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (!response.ok) {
//           throw new Error('Failed to fetch books');
//         }

//         const result = await response.json();
//         setBooks(result.message);
//       } catch (error) {
//         console.error('Error fetching books:', error);
//         // Optionally, handle error state
//       }
//     };

// fetchBooks(); //run function
//     }, [apiOrigin, books, getAccessTokenSilently]);

//    <div>
//         <h1>Books</h1>
//         {books.map((book, index) => {
//             <div key={index}>
//                 <p>{book}</p>
          
//           </div>
//         })}
// {/* render using 'books' state */}
//     </div>
// }

// export default FetchAllBooks;

            
//         // }();
//         //     


// function BookItem({ book }) {
//   return (
//     <div>
//       <h2>{book.title}</h2>
//       <p></p>
//     </div>
//   );
// }

// class BooksList extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       books: [],
//     };
//   }

//   componentDidMount() {
//     // ask server - check endpoint
//     this.getBooks();
//   }

//   getBooks = () => {
//     <FetchAllBooks/>
//   };

//   render() {
//     return (
//       <div>
//         {this.state.books.map(book => (
//           <BookItem key={book.id} book={book} />
//         ))}
//       </div>
//     );
//   }
// }
