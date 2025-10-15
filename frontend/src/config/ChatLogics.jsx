export const getSender = (loggedUser, users) => {
  if (!users || users.length < 2 || !loggedUser) return "";
  return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
};

export const getfullSender = (loggedUser, users) => {
  if (!users || users.length < 2 || !loggedUser) return null;
  return users[0]._id === loggedUser._id ? users[1] : users[0];
};


export const isSameSender = (messages, m, i, userId) => {
  return (
    i < messages.length - 1 &&
    (messages[i + 1].sender._id !== m.sender._id ||
      messages[i + 1].sender._id === undefined) &&
    messages[i].sender._id !== userId
  );
};

export const isLastMessage = (messages, i, userId) => {
  return (
    i === messages.length - 1 &&
    messages[i].sender._id !== userId &&
    messages[i].sender._id
  );
};

export const isSameSenderMargin = (messages, m, i, userId) => {
  // sender messages on left (not me)
  if (
    i < messages.length - 1 &&
    messages[i + 1].sender._id === m.sender._id &&
    m.sender._id !== userId
  ) {
    return 33; // keep space for avatar
  } else if (
    (i < messages.length - 1 &&
      messages[i + 1].sender._id !== m.sender._id &&
      m.sender._id !== userId) ||
    (i === messages.length - 1 && m.sender._id !== userId)
  ) {
    return 0; // last message of that sender → no margin before avatar
  } else {
    return "auto"; // my messages on right
  }
};

export const isSameUser = (messages, m, i) => {
  return i > 0 && messages[i - 1].sender._id === m.sender._id;
};
