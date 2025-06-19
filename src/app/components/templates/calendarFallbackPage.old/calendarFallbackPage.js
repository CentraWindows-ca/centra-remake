import React from "react";
import { Typography, Button } from "antd";

const { Text } = Typography;
import Image from "next/image";

export default function CalendarFallbackPage(props) {
  return (
    <div className="flex items-center justify-center w-100 h-100">
      <div className="flex flex-row text-red-400">
        <div className="text-sm">
          <div className="text-center">
            <div className={`inline-block pb-2`}>
              <Image
                src="/warning.png"
                alt="Warning icon"
                width={300} // Properties for resolution, not size
                height={300}
                priority={true}
                style={{ width: "50px", height: "auto" }}
              />
            </div>
          </div>
          <div className="text-center">
            <Text type="danger">
              Unable to load work orders, please try refreshing the page.
            </Text>
          </div>
          <div className="text-center">
            <Text type="danger">
              {" "}
              If the issue persists, kindly report it to support@centra.ca.
            </Text>
          </div>
          {false && (
            <div className="text-center pt-2">
              <Text type="secondary">
                In the meantime, if you require urgent access, you can click the
                button below to access the WebCalendar mirror site:
              </Text>
              <div className="mt-3">
                <a href="http://staging-orders.centra.ca">
                  <Button type="primary">Mirror Site</Button>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
