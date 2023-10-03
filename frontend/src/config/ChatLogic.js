// Objective: get the sender name of the message
const getSender = (loggedUser, users) => {
    // console.log("loggedUser: ", loggedUser);
//   console.log(loggedUser);
  return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
};

export default getSender;
