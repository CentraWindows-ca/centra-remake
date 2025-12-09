import React from "react";
import { Avatar } from 'antd';

function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(name) {
  if (!name) return null;

  let initials;
  if (name.includes(" ")) {
    const [firstName, lastName] = name.split(" ");
    initials = `${firstName[0]}${lastName[0]}`;
  } else {
    initials = name.slice(0, 1);
  }

  return {
    style: {
      backgroundColor: stringToColor(name),
      width: 18,
      height: 18,
      fontSize: 14,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    children: initials,
  };
}

export default function UserAvatar(props) {
  const avatarProps = stringAvatar(props?.username);

  return (
    <Avatar {...(avatarProps || {})}>
      {avatarProps?.children ?? ""}
    </Avatar>
  );
}
