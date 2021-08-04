import { TextField } from "@material-ui/core";
import { FormikProps } from "formik";
import React from "react";
import { FormattedMessage } from "react-intl";

interface CustomTextFieldProps {
  formik: FormikProps<any>;
  name: string;
  type?: string;
  className?: string;
  labelKey?: string;
  fullWidth?: boolean;
}

export const CustomTextField = (props: CustomTextFieldProps) => {
  const { formik, name, className, type = "text", labelKey = name, fullWidth = true } = props;
  return (
    <TextField
      fullWidth={fullWidth}
      name={name}
      className={className}
      type={type}
      label={<FormattedMessage id={labelKey} />}
      onChange={formik.handleChange}
      value={formik.values[name]}
      error={formik.submitCount > 0 && !!formik.errors[name]}
      helperText={formik.submitCount > 0 && formik.errors[name]}
    />
  );
};
