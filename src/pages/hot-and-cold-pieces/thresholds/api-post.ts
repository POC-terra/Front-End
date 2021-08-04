import { useMutate } from "restful-react";

export const usePutSeuil = () => {
  // We can't use usePostSeuils of swagger-python.ts or we have to change the CustomRestfulProvider Base..
  return useMutate({
    verb: "PUT",
    path: `/seuils`,
    base: window._env_.API_PYTHON_BASE_URL,
  });
};
