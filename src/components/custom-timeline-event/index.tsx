import React, { ReactNode } from "react";
import { TimelineEvent } from "react-event-timeline";
import { useUserTheme } from "../../hooks/theme-hook";

interface CustomTimelineEventProps {
  title: JSX.Element | string;
  subtitle?: string;
  createdAt?: string;
  children?: ReactNode;
  icon?: JSX.Element;
  color?: string;
  onlyTitle?: boolean;
  subTimeline?: boolean;
}

export const CustomTimelineEvent = (props: CustomTimelineEventProps) => {
  const theme = useUserTheme();
  const { title, subtitle, createdAt, icon, color, onlyTitle, subTimeline } = props;
  return (
    <TimelineEvent
      title={title}
      subtitle={subtitle}
      createdAt={
        onlyTitle ? null : <div style={{ fontWeight: "bold", fontSize: "12px", fontStyle: "italic" }}>{createdAt}</div>
      }
      icon={icon}
      contentStyle={
        onlyTitle
          ? {
              boxShadow: "none",
            }
          : undefined
      }
      // contentStyle={{ backgroundColor: "#00BCD4", color: "#fff" }}
      titleStyle={
        onlyTitle
          ? subTimeline
            ? { fontWeight: "bold", fontSize: "13px" }
            : { fontWeight: "bold", fontSize: "15px", paddingTop: "5px" }
          : undefined
      }
      iconColor={color || theme.palette.primary.dark}
      iconStyle={{ marginLeft: 0, marginTop: 0 }}
      bubbleStyle={
        icon == null
          ? subTimeline
            ? { width: "18px", height: "18px", marginLeft: "8px" }
            : { width: "10px", height: "10px", marginLeft: "12px", marginTop: "3px" }
          : {}
      }
    >
      {props.children}
    </TimelineEvent>
  );
};
