import { Divider } from "@material-ui/core";
import React from "react";

interface CustomDividerProps {
  widthPercentage?: number;
  marginTop?: number;
}

export const CustomDivider = (props: CustomDividerProps) => {
  const { widthPercentage, marginTop } = props;
  return (
    <Divider
      style={{
        padding: 0,
        border: "none",
        height: "1px",
        backgroundImage: "-webkit-linear-gradient(left, rgba(0,0,0,0), rgba(186, 148, 148, 0.8), rgba(0,0,0,0))",
        color: "#333",
        width: widthPercentage ? widthPercentage + "%" : "40%",
        marginRight: "auto",
        marginLeft: "auto",
        marginBottom: "10px",
        marginTop: marginTop + "px" || undefined,
      }}
    />
  );
};
