import UserAvatar from "app/components/organisms/users/userAvatar";
import OrdersMenuItem from "./ordersMenuItem";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useAuthData } from "context/authContext";
import { Tooltip } from "antd";

export default function OrdersMenuList(props) {
  const { department, statusOptions } = props;
  const router = useRouter();
  const { loggedInUser } = useAuthData();
  const { drawerOpen } = useSelector((state) => state.app);
  const { statusCount, statusView, assignedToMe, assignedToMeCount } =
    useSelector((state) => state.orders);

  const [totalCount, setTotalCount] = useState(0);

  const handleStatusFilterChange = (status, assignedToMe = false) => {
    if (status.length > 0)
      router.push(`?status=${status}`, undefined, {
        shallow: true,
      });
    else {
      let _url = `${assignedToMe ? `?assignedToMe=1` : ""
      }`;
      router.push(_url, undefined, { shallow: true });
    }
  };

  useEffect(() => {
    let total = 0;

    for (let i = 0; i < statusCount.length; i++) {
      total += statusCount[i].count || 0;
    }

    setTotalCount(total);
  }, [statusCount]);

  return (
    <>
      <OrdersMenuItem
        key={`menu_item_assigned_to_me_filter}`}
        selected={assignedToMe}
        onClick={() => handleStatusFilterChange("", true)}
      >
        {drawerOpen ? (
          <>
            <div className="flex space-x-3 items-center">
              <UserAvatar username={loggedInUser?.name ?? "test"} />
              <div className="flex space-x-2 items-center">Assigned to Me</div>
            </div>
            {assignedToMeCount > 0 && (
              <div className="px-2 text-xs rounded-md">{assignedToMeCount}</div>
            )}
          </>
        ) : (
          <div className="">
            <Tooltip title="Assigned To Me" placement="right" zIndex={9999}>
              <UserAvatar username={loggedInUser?.name ?? "test"} />
            </Tooltip>
          </div>

        )}
      </OrdersMenuItem>

      <OrdersMenuItem
        key={`menu_item_all_filter}`}
        selected={statusView === "" && !assignedToMe}
        onClick={() => handleStatusFilterChange("")}
      >
        {drawerOpen ? (
          <>
            <div className="flex space-x-2 items-center">All {department}s</div>
            {totalCount > 0 && (
              <div className="px-2 text-xs rounded-md">{totalCount}</div>
            )}
          </>
        ) : (
          <>
            <Tooltip title="All Records" placement="right">
              All
            </Tooltip>
          </>
        )}
      </OrdersMenuItem>

      {statusOptions.map((status, index) => {
        let _statCount = statusCount?.filter(
          (x) => x.status === status.value
        )[0]?.count;

        return (
          <OrdersMenuItem
            key={`menu_item_status_${index}_filter`}
            selected={statusView === status.key && !assignedToMe}
            onClick={() => handleStatusFilterChange(status.key)}
          >
            {drawerOpen ? (
              <>
                <div className="flex space-x-2 items-center">
                  <i
                    className={`${status.icon} pr-4`}
                    style={{ color: `${status.color}` }}
                  ></i>
                  {status.value}
                </div>
                {_statCount > 0 && (
                  <div className="px-2 text-xs rounded-md">{_statCount}</div>
                )}
              </>
            ) : (
              <Tooltip title={status.value} placement="right">
                <i
                  className={`${status.icon}`}
                  style={{ color: `${status.color}` }}
                />
              </Tooltip>
            )}
          </OrdersMenuItem>
        );
      })}
    </>
  );
}
