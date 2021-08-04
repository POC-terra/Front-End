import chroma from "chroma-js";
import styles from "./color.scss";

export const themeColor = {
  primary: {
    main: styles["bleu_identitaire"],
    light: styles["brique"],
    dark: styles["bleu_semi_fonce"],
  },
  secondary: {
    main: styles["brique"],
    light: styles["light_grey"],
    dark: styles["vert_anis"],
  },
  success: {
    main: styles["success"],
    light: chroma(styles["success"])
      .brighten()
      .css(),
    dark: chroma(styles["success"])
      .darken()
      .css(),
  },
  error: {
    main: styles["error"],
    light: chroma(styles["error"])
      .brighten()
      .css(),
    dark: chroma(styles["error"])
      .darken()
      .css(),
  },
};
