import UserAvatar from "./userAvatar";
import Tooltip from "app/components/atoms/tooltip/tooltip";

export default function UserLabel(props) {
  const { username } = props;

  return (
    <div className="flex items-center space-x-2">
      <Tooltip title={username}>
        <UserAvatar username={username} />
      </Tooltip>
      <div>{`${username}`}</div>
    </div>
  );
}
