import React, {Component} from "react";
import ManageUsers from "./ManageUsers"
// import BookList from "../Books/BookList";
// import { AddBookForm } from "../Books/addBook";
// import BookList from "../Books/BookList";
// import BookManagement from "../Books/BookManagement";
import { withAuth0 } from "@auth0/auth0-react";
import BookManagement from "../Books/BookManagement";

class Dashboard extends Component {
    render() {
        return (
            <>
                {/* <BookManagement/> */}
                <div>
                    <h1>Hello</h1>
                    <div>
                        <h1>Welcome to the Admin Dashboard</h1>
                    </div>
                    <div>
                        <h2>Manage Users</h2>
                        <div>
                            <ManageUsers />
                        </div>
                        
                        <div>
                            <BookManagement/>
                            {/* <BookList/> */}
                            {/* <AddBookForm /> */}
                                {/* <BookList/> */}
                        </div>
                
                    </div>


                
                </div>
        
            </>
    
        );
    }
}

export default withAuth0(Dashboard);

  