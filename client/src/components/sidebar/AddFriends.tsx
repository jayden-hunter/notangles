import SearchIcon from '@mui/icons-material/Search';
import { Box, Button, Divider, Link, TextField, Typography } from '@mui/material';
import { styled } from '@mui/system';
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User } from '../../interfaces/User';

const ChangeItem = styled('div')`
  padding: 0.5vh 0;
`;

const ChangeTitle = styled('div')`
  font-weight: bold;
  font-size: 1.1rem;
`;

const AddFriends: React.FC = () => {
  const [search, setSearch] = useState('');
  const [userList, setUserList] = useState<User[]>([]);
  const listItems = userList.map((d) => (
    <div key={d.google_uid}>
      {d.firstname}
      {d.lastname}

      <Button variant="contained">Add</Button>
    </div>
  ));

  // use auth
  const { user, token } = useAuth();

  // // fucntion for adding friends
  // const addFriend = (id: string) => {
  //   // create a new friend object
  //   const body = {
  //     senderId: user?.sub,
  //     receiverId: id,
  //   };
  //   fetch('http://localhost:3001/api/friend/request', { method: 'post', body: JSON.stringify(body) }).then(response);
  // };

  // add friend to user

  // pass search into actual search and return a list of users
  // that match the search
  const searchUsers = () => {
    // make a state for search
    const underscoredName = search.replaceAll(' ', '_');
    fetch(`http://localhost:3001/api/friend/search?name=${underscoredName}`, {
      headers: new Headers({
        Authorization: `Bearer ${token}`,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setUserList(data.data);
      });
  };

  return (
    <>
      <Typography gutterBottom variant="body2">
        Add existing friends on Notangles or send them an invite to Notangles, both via their zID. Friends can view each other's
        timetables or collaborate on timetables.
      </Typography>
      <Divider />
      <Box>
        <TextField
          label="Add Friends By Full Name"
          margin="normal"
          onInput={(e) => setSearch((e.target as HTMLInputElement).value)}
        />
        <Button variant="contained" endIcon={<SearchIcon />} onClick={searchUsers} />
        <div>{listItems}</div>
      </Box>
    </>
  );
};

export default AddFriends;
