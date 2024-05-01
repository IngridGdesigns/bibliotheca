import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const UserProfile = () => {
    const { user, isAuthenticated, isLoading } = useAuth0();
    console.log(useAuth0.user)

    if (isLoading) {
        return <div>Loading...</div>;
    } 

    return (
        isAuthenticated && (
            <div>
                <img src={user.picture} alt={user.name} />
                <h2>{user.name}</h2>
                <p>{user.email}</p>
                <p>{user.updated_at}</p>
            </div>
        )
    )
}

export default UserProfile;

