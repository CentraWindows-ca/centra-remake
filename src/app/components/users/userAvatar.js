import React from "react";
import Icon, { UserOutlined } from "@ant-design/icons";
import Avatar from "@mui/material/Avatar";

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
  if (name === "Unassigned") {
    return {
      icon: (
        <Icon
          component={<UserOutlined />}
          sx={{ width: 10, height: 10 }}
        ></Icon>
      ),
      sx: {
        width: 19,
        height: 19,
        fontSize: 8,
      },
    };
  } else {
    let initials;
    if (name.includes(" ")) {
      // If the name contains a space, split it into first and last names
      const [firstName, lastName] = name.split(" ");
      initials = `${firstName[0]}${lastName[0]}`;
    } else {
      // If there's no space, use the first two characters of the name
      initials = name.slice(0, 1);
    }
    return {
      sx: {
        bgcolor: stringToColor(name),
        width: 19,
        height: 19,
        fontSize: 8,
        paddingTop: "1px",
      },
      children: initials,
    };
  }
}

export default function UserAvatar(props) {
  const { username, image } = props;

  return <Avatar {...stringAvatar(username)} />;
}
