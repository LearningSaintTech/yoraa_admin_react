import React, { useEffect, useState } from 'react';
import { getAllUsers, updateUserRoleAndStatus, getPrivateMessage, getAllRoles } from '../../commonComponent/Api'; // Added getAllRoles import
import '../../../css/admin/allUsers/Allusers.css';

const AllUsers = () => {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]); // State to store all available roles
    const [privateMessage, setPrivateMessage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getAllUsers()
            .then(response => {
                const usersWithEditingFlag = response.map(user => ({
                    ...user,
                    roles: Array.isArray(user.roles) ? user.roles : [{ name: user.role }],
                    isEditing: false
                }));
                setUsers(usersWithEditingFlag);
                setLoading(false);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            });

        getPrivateMessage()
            .then(response => {
                console.log("response", response);
                setPrivateMessage(response.message);
            })
            .catch(error => {
                console.error("Error fetching private message:", error);
            });

        getAllRoles()
            .then(response => {
                console.log("responssssssssseeeeee");
                setRoles(response);
            })
            .catch(error => {
                console.error("Error fetching roles:", error);
            });
    }, []);

    const handleStatusChange = (userId, newStatus) => {
        setUsers(prevUsers => (
            prevUsers.map(user => user.id === userId ? { ...user, status: newStatus } : user)
        ));
    };

    const handleRoleChange = (userId, roleName) => {
        setUsers(prevUsers => (
            prevUsers.map(user => {
                if (user.id === userId) {
                    const roles = user.roles.map(role => role.name);
                    if (roles.includes(roleName)) {
                        return { ...user, roles: user.roles.filter(role => role.name !== roleName) };
                    } else {
                        return { ...user, roles: [...user.roles, { name: roleName }] };
                    }
                }
                return user;
            })
        ));
    };

    const updateUserDetails = (userId, newRoles, newStatus) => {
        const roles = newRoles.map(role => role.name);
        updateUserRoleAndStatus(userId, roles, newStatus)
            .then(response => {
                setUsers(prevUsers => (
                    prevUsers.map(user => user.id === userId ? { ...user, isEditing: false } : user)
                ));
            })
            .catch(error => {
                console.error(`Error updating role and status of user ${userId}:`, error);
            });
    };

    const toggleEditMode = (userId) => {
        setUsers(prevUsers => (
            prevUsers.map(user => user.id === userId ? { ...user, isEditing: !user.isEditing } : user)
        ));
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error loading users: {error.message}</p>;
    }

    return (
        <div className="all-users">
            <h3>All Users</h3>
            {privateMessage && <div className="private-message"><strong>Private Message: </strong>{privateMessage}</div>}
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>
                                {user.isEditing ? (
                                    <div className="roles-grid">
                                        {roles.map(role => (
                                            <label key={role.id}>
                                                <input
                                                    type="checkbox"
                                                    checked={user.roles.some(r => r.name === role.name)}
                                                    onChange={() => handleRoleChange(user.id, role.name)}
                                                />
                                                {role.name}
                                            </label>
                                        ))}
                                    </div>
                                ) : (
                                    user.roles.map(role => role.name).join(', ')
                                )}
                            </td>
                            <td>
                                {user.isEditing ? (
                                    <select 
                                        value={user.status.toLowerCase()} 
                                        onChange={(e) => handleStatusChange(user.id, e.target.value)}>
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                        <option value="terminated">Terminated</option>
                                    </select>
                                ) : (
                                    user.status
                                )}
                            </td>
                            <td>
                                {user.isEditing ? (
                                    <button onClick={() => updateUserDetails(user.id, user.roles, user.status)}>Save</button>
                                ) : (
                                    <button onClick={() => toggleEditMode(user.id)}>Edit</button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AllUsers;
