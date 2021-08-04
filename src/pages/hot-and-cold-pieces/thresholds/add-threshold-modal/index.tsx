import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  makeStyles,
  Slide,
} from "@material-ui/core";
import { TransitionProps } from "@material-ui/core/transitions";
import { useFormik } from "formik";
import "moment/locale/fr";
import "moment/min/moment-with-locales";
import React from "react";
import { CustomTextField } from "../../../../components/custom-text-field";
import { useNotification } from "../../../../hooks/notification-hook";
import { ThresholdSchema } from "../../../../utils/yup-config";
import { usePutSeuil } from "../api-post";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="down" ref={ref} {...props} />;
});

interface AddThresholdModalProps {
  open: boolean;
  handleClose: () => void;
}

const useStyles = makeStyles({
  inputMargin: {
    margin: "5px 0",
  },
  inputBlock: {
    width: "90%",
    margin: "0 auto",
  },
  center: {
    justifyContent: "space-between",
    display: "flex",
  },
  sameLine: {
    width: "48%",
  },
});

export const AddThresholdModal = (props: AddThresholdModalProps) => {
  const { open, handleClose } = props;
  const classes = useStyles();
  const { mutate } = usePutSeuil();
  const { showSuccess } = useNotification();

  const formik = useFormik({
    initialValues: {
      magasin: "",
      zone: "",
      seuil_min: undefined,
      seuil_max: undefined,
      critere: "",
    },
    onSubmit: values => {
      mutate({ seuils: [values] }).then(() => {
        handleClose();
        showSuccess("Ligne ajoutée avec succès!");
      });
    },
    validationSchema: ThresholdSchema,
  });

  return (
    <Dialog fullWidth open={open} scroll={"paper"} TransitionComponent={Transition} onClose={handleClose}>
      <DialogTitle id="scroll-dialog-title" style={{ paddingBottom: "5px" }}>
        Ajout d'un nouveau seuil
      </DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent style={{ paddingTop: "0px" }}>
          <DialogContentText>
            Veuillez saisir tous les champs suivants afin d'ajouter le nouveau seuil.
          </DialogContentText>
          <div className={classes.inputBlock}>
            <CustomTextField formik={formik} className={classes.inputMargin} name="magasin" />
            <CustomTextField formik={formik} className={classes.inputMargin} name="zone" />
            <div className={classes.center}>
              <CustomTextField
                fullWidth={false}
                formik={formik}
                className={(classes.inputMargin, classes.sameLine)}
                name="seuil_min"
                type="number"
              />
              <CustomTextField
                fullWidth={false}
                formik={formik}
                className={(classes.inputMargin, classes.sameLine)}
                name="seuil_max"
                type="number"
              />
            </div>
            <CustomTextField formik={formik} className={classes.inputMargin} name="critere" />
          </div>
        </DialogContent>
        <DialogActions>
          <Button color="primary" type="submit">
            {/* TODO créer un custom-button comme un custom-switch qui prend la couleur theme.palette.success.main */}
            Ajouter
          </Button>
          <Button onClick={handleClose} color="secondary">
            Annuler
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
