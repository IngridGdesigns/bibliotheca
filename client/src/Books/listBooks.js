import React from 'react';


const ListBooks = (props) => {

  const { books, loading, error, onDeleteBook } = props;
  
  const handleDelete = (bookId) => {
    onDeleteBook(bookId)
    console.log('book was successfully deleted')
  }

    if (loading) {
      return <div>Loading...</div>;
    }

    if (error) {
      return <div>Error: {error}</div>;
    }

     return (
        <div>
            <h2>Book List</h2>
            <div className="card-deck">
                {books ? books.map(book => (
                    <div key={book.book_id} className="card">
                        <div className="card-body">
                            <h5 className="card-title">{book.title}</h5>
                            <p className="card-text">Publication Year: {book.publication_year}</p>
                      {/* Add more details here */}
                      <button className="btn btn-danger" onClick={() => handleDelete(book.book_id)}>
                            Delete
                      </button>

                        </div>
                    </div>
                )) : 'No data available'}
            </div>
        </div>
    );
}

export default ListBooks;


