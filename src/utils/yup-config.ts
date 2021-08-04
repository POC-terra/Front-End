import * as Yup from "yup";

//TODO use translation
//TODO add the controls when specified. c.f. https://github.com/jquense/yup#number
const todoUseFormattedMessage = "Veuillez remplir ce champ obligatoire";
export const ThresholdSchema = Yup.object().shape({
  magasin: Yup.string().required(todoUseFormattedMessage),
  zone: Yup.string().required(todoUseFormattedMessage),
  seuil_min: Yup.number()
    .max(Yup.ref("seuil_max"), "Ce champ doit être inférieur à Seuil Max")
    .required(todoUseFormattedMessage),
  seuil_max: Yup.number()
    .min(Yup.ref("seuil_min"), "Ce champ doit être supérieur à Seuil Min")
    .required(todoUseFormattedMessage),
  critere: Yup.string().required(todoUseFormattedMessage),
});
