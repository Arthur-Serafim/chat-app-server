let users = [];

function addUser({ id, name, room }) {
  name = name.trim();
  room = room.trim().toLowerCase();

  const existingUser = users.find(
    user => user.room === room && user.name === name
  );

  if (existingUser) {
    return { error: "Username is taken" };
  }

  const user = { id, name, room };
  users = [...users, user]

  return { user };
}

function removeUser(id) {
  user = users.find(user => user.id === id)
  users = users.filter(user => user.id !== id);

  return user;
}

function getUser(id) {
  return users.find(user => user.id === id)
}

function getUsersInRoom(room) {
  return users.filter(user => user.room === room);
}

module.exports = { addUser, removeUser, getUser, getUsersInRoom };
