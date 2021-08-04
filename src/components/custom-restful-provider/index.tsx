import React, { ReactNode } from "react";
import { RestfulProvider } from "restful-react";
import { useNotification } from "../../hooks/notification-hook";

const buildHeader = (token: string | null) => {
  if (token == null) return {};
  return { headers: { Authorization: "Bearer " + token } };
};

const manageToken = (updatedToken: () => Promise<string | null>) => {
  return updatedToken().then(token => buildHeader(token));
};

interface CustomRestfulProviderProps {
  base: string;
  children: ReactNode;
}

export const CustomRestfulProvider = (props: CustomRestfulProviderProps) => {
  const { showError } = useNotification();

  return (
    <RestfulProvider
      base={props.base}
      // requestOptions={() => manageToken(updatedToken)}
      onError={err => showError(err.message)}
    >
      {props.children}
    </RestfulProvider>
  );
};
