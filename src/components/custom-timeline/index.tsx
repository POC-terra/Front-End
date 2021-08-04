import React, { ReactNode } from "react";
import { Timeline } from "react-event-timeline";

interface CustomTimelineProps {
  subTimeline?: boolean;
  children: ReactNode;
}
export const CustomTimeline = (props: CustomTimelineProps) => {
  const { subTimeline, children } = props;
  return (
    <Timeline style={subTimeline ? { marginLeft: "15px", marginBottom: "5px" } : undefined} {...props}>
      {children}
    </Timeline>
  );
};
