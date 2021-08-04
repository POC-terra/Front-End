import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  Grid,
  Slide,
  Typography,
} from "@material-ui/core";
import { TransitionProps } from "@material-ui/core/transitions";
import DirectionsCarIcon from "@material-ui/icons/DirectionsCar";
import GetAppIcon from "@material-ui/icons/GetApp";
import RotateRightIcon from "@material-ui/icons/RotateRight";
import StorageIcon from "@material-ui/icons/Storage";
import TrackChangesIcon from "@material-ui/icons/TrackChanges";
import chroma from "chroma-js";
import moment from "moment";
import "moment/locale/fr";
import "moment/min/moment-with-locales";
import React, { useState } from "react";
import { TowerControlDetailDescription, useGetTourControlByID } from "../../../../api-generated/swagger-api";
import { CustomDivider } from "../../../../components/custom-divider";
import { CustomSwitch } from "../../../../components/custom-switch";
import { CustomTimeline } from "../../../../components/custom-timeline";
import { CustomTimelineEvent } from "../../../../components/custom-timeline-event";
import { useUserTheme } from "../../../../hooks/theme-hook";
import { convertHMS } from "../../../../utils/date-utils";
import "./index.scss";
import { TowerControlFullData } from "./types";

const transformData = (dataFromServer: TowerControlDetailDescription | null): TowerControlFullData => {
  return (dataFromServer && dataFromServer.result) || {};
};

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="left" ref={ref} {...props} />;
});

interface InformationModalProps {
  open: boolean;
  handleClose: () => void;
  openId: number;
}

const InformationDivider = () => {
  return <CustomDivider widthPercentage={95} marginTop={10} />;
};

export const InformationModal = (props: InformationModalProps) => {
  const theme = useUserTheme();
  const colors = chroma
    .scale([theme.palette.primary.dark, theme.palette.primary.light])
    .mode("lch")
    .colors(5);
  const { open, handleClose, openId } = props;
  const { data: serverData, loading } = useGetTourControlByID({ id: openId });
  const data = transformData(serverData);

  const hasREC = data && data.REC_CYCLE_VIE && data.REC_CYCLE_VIE.length > 0;
  const hasOFA = data && data.OFA_CYCLE_VIE && data.OFA_CYCLE_VIE.length > 0;
  const hasDOH = data && data.DOH_CYCLE_VIE && data.DOH_CYCLE_VIE.length > 0;
  const hasTAC = data && data.TAC_CYCLE_VIE && data.TAC_CYCLE_VIE.length > 0;
  const hasCTN = data && data.CTN_CYCLE_VIE && data.CTN_CYCLE_VIE.length > 0;

  const [checkedREC, setCheckedREC] = useState(true);
  const [checkedOFA, setCheckedOFA] = useState(true);
  const [checkedDOH, setCheckedDOH] = useState(true);
  const [checkedTAC, setCheckedTAC] = useState(true);
  const [checkedCTN, setCheckedCTN] = useState(true);

  return (
    <Dialog
      fullWidth
      open={open}
      scroll={"paper"}
      TransitionComponent={Transition}
      onClose={handleClose}
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
    >
      <DialogTitle id="scroll-dialog-title" style={{ paddingBottom: "5px" }}>
        Description du flux de Recette id {openId}
      </DialogTitle>
      {loading ? (
        <span>
          <CircularProgress />
        </span>
      ) : (
        <DialogContent dividers={true}>
          <DialogContentText>
            <Typography color="primary" variant="subtitle1" gutterBottom>
              <b>Informations générales</b>
            </Typography>
            <Typography color="primary" variant="subtitle2" gutterBottom>
              <Grid container style={{ padding: "0px 5px" }}>
                <Grid item sm={4} xs={12}>
                  <u>Réception id</u> : {data.REC_ID}
                  <br />
                  <u>Référence</u> : {data.PARTNUMBER}
                  <br />
                  <u>Type de flux</u> : {data.FLUX}
                </Grid>
                <Grid item sm={4} xs={12}>
                  <u>Détail du flux</u> : {data.FLUX_DETAIL}
                  <br />
                  <u>Référence Urgente</u> : {data.URGENCE_RECEPTION}
                  <br />
                  <u>Statut réception</u> : {data.REC_STATUS}
                </Grid>
                <Grid item sm={4} xs={12}>
                  <u>Statut conditionnement</u> : {data.OFA_STATUS}
                  <br />
                  <u>Mise en stock terminée</u> : {data.CTN_NB_STATUS_FINAUX + "/" + data.CTN_NB}
                </Grid>
              </Grid>
            </Typography>
          </DialogContentText>

          <InformationDivider />
          <Grid container style={{ textAlign: "center" }}>
            <Grid item xs={12}>
              {hasREC || hasOFA || hasDOH || hasTAC || hasCTN ? (
                <>
                  {hasREC && (
                    <FormControlLabel
                      control={
                        <CustomSwitch
                          color={colors[0]}
                          checked={checkedREC}
                          onChange={() => setCheckedREC(!checkedREC)}
                        />
                      }
                      label="REC"
                    />
                  )}
                  {hasOFA && (
                    <FormControlLabel
                      control={
                        <CustomSwitch
                          color={colors[1]}
                          checked={checkedOFA}
                          onChange={() => setCheckedOFA(!checkedOFA)}
                        />
                      }
                      label="OFA"
                    />
                  )}
                  {hasDOH && (
                    <FormControlLabel
                      control={
                        <CustomSwitch
                          color={colors[2]}
                          checked={checkedDOH}
                          onChange={() => setCheckedDOH(!checkedDOH)}
                        />
                      }
                      label="DOH"
                    />
                  )}
                  {hasTAC && (
                    <FormControlLabel
                      control={
                        <CustomSwitch
                          color={colors[3]}
                          checked={checkedTAC}
                          onChange={() => setCheckedTAC(!checkedTAC)}
                        />
                      }
                      label="TAC"
                    />
                  )}
                  {hasCTN && (
                    <FormControlLabel
                      control={
                        <CustomSwitch
                          color={colors[4]}
                          checked={checkedCTN}
                          onChange={() => setCheckedCTN(!checkedCTN)}
                        />
                      }
                      label="CTN"
                    />
                  )}
                </>
              ) : (
                <i>Aucune donnée à afficher</i>
              )}
            </Grid>
          </Grid>

          {hasREC && checkedREC ? (
            <>
              <CustomTimeline>
                <CustomTimelineEvent
                  title="Flux réception (REC)"
                  onlyTitle={true}
                  icon={<GetAppIcon />}
                  color={colors[0]}
                />
                {data?.REC_CYCLE_VIE?.map((cycle, index) => {
                  return (
                    <CustomTimelineEvent
                      key={"REC" + index}
                      title={
                        <ul className="custom-list">
                          <li>
                            Status réception: <b>{cycle.REC_STATUS}</b>
                          </li>
                          <li>
                            Temps changemment status: <b>{convertHMS(cycle.TEMPS_CHANGEMENT_STATUS)}</b>
                          </li>
                          <li>
                            Temps Total : <b>{convertHMS(cycle.TEMPS_CUMULATIF)}</b>
                          </li>
                        </ul>
                      }
                      createdAt={moment((cycle.TS || 0) * 1000).format("LLLL")}
                      color={colors[0]}
                    />
                  );
                })}
              </CustomTimeline>

              <InformationDivider />
            </>
          ) : null}

          {hasOFA && checkedOFA ? (
            <>
              <CustomTimeline>
                <CustomTimelineEvent
                  title="Flux conditionnement (OFA)"
                  onlyTitle={true}
                  icon={<RotateRightIcon />}
                  color={colors[1]}
                />
                {data?.OFA_CYCLE_VIE?.map((cycle, index) => {
                  return (
                    <CustomTimelineEvent
                      key={"OFA" + index}
                      title={
                        <ul className="custom-list">
                          <li>
                            Status conditionnement: <b>{cycle.OFA_STATUS}</b>
                          </li>
                          <li>
                            Temps changemment status: <b>{convertHMS(cycle.TEMPS_CHANGEMENT_STATUS)}</b>
                          </li>
                          <li>
                            Temps Total : <b>{convertHMS(cycle.TEMPS_CUMULATIF)}</b>
                          </li>
                        </ul>
                      }
                      createdAt={moment((cycle.TS || 0) * 1000).format("LLLL")}
                      color={colors[1]}
                    />
                  );
                })}
              </CustomTimeline>
              <InformationDivider />
            </>
          ) : null}

          {hasDOH && checkedDOH ? (
            <>
              <CustomTimeline>
                <CustomTimelineEvent
                  title="Flux détail conditionnement (DOH)"
                  onlyTitle={true}
                  icon={<TrackChangesIcon />}
                  color={colors[2]}
                />
                {data?.DOH_CYCLE_VIE?.map((cycle, index) => {
                  return (
                    <CustomTimeline subTimeline={true}>
                      <CustomTimelineEvent
                        title={"id : " + cycle.DOH_ID + ", Status : " + cycle.DOH_STATUS}
                        onlyTitle={true}
                        subTimeline={true}
                        color={colors[2]}
                      />

                      {cycle.CYCLE_VIE_DETAIL?.map((detail, index) => {
                        return (
                          <CustomTimelineEvent
                            title={
                              <ul className="custom-list">
                                <li>
                                  Statut détail conditionnement : <b>{detail.DOH_STATUS}</b>
                                </li>
                                <li>
                                  Temps changemment status: <b>{convertHMS(detail.TEMPS_CHANGEMENT_STATUS)}</b>
                                </li>
                                <li>
                                  Temps Total : <b>{convertHMS(detail.TEMPS_CUMULATIF)}</b>
                                </li>
                              </ul>
                            }
                            createdAt={moment((detail.TS || 0) * 1000).format("LLLL")}
                            color={colors[2]}
                          />
                        );
                      })}
                    </CustomTimeline>
                  );
                })}
              </CustomTimeline>
              <InformationDivider />
            </>
          ) : null}

          {hasTAC && checkedTAC ? (
            <>
              <CustomTimeline>
                <CustomTimelineEvent
                  title="Flux Transport (TAC)"
                  onlyTitle={true}
                  icon={<DirectionsCarIcon />}
                  color={colors[3]}
                />
                {data?.TAC_CYCLE_VIE?.map((cycle, index) => {
                  return (
                    <CustomTimeline subTimeline={true}>
                      <CustomTimelineEvent
                        title={"id : " + cycle.TAC_ID + ", Status : " + cycle.TAC_STATUS}
                        onlyTitle={true}
                        subTimeline={true}
                        color={colors[3]}
                      />

                      {cycle.CYCLE_VIE_DETAIL?.map((detail, index) => {
                        return (
                          <CustomTimelineEvent
                            title={
                              <ul className="custom-list">
                                <li>
                                  Statut transport : <b>{detail.TAC_STATUS}</b>
                                </li>
                                <li>
                                  Temps changemment status: <b>{convertHMS(detail.TEMPS_CHANGEMENT_STATUS)}</b>
                                </li>
                                <li>
                                  Temps Total : <b>{convertHMS(detail.TEMPS_CUMULATIF)}</b>
                                </li>
                              </ul>
                            }
                            createdAt={moment((detail.TS || 0) * 1000).format("LLLL")}
                            color={colors[3]}
                          />
                        );
                      })}
                    </CustomTimeline>
                  );
                })}
              </CustomTimeline>
              <InformationDivider />
            </>
          ) : null}

          {hasCTN && checkedCTN ? (
            <>
              <CustomTimeline>
                <CustomTimelineEvent
                  title="Flux Stockage (CTN)"
                  onlyTitle={true}
                  icon={<StorageIcon />}
                  color={colors[4]}
                />
                {data?.CTN_CYCLE_VIE?.map((cycle, index) => {
                  return (
                    <CustomTimeline subTimeline={true}>
                      <CustomTimelineEvent
                        title={"id : " + cycle.CTN_ID + ", Status : " + cycle.CTN_STATUS}
                        onlyTitle={true}
                        subTimeline={true}
                        color={colors[4]}
                      />

                      {cycle.CYCLE_VIE_DETAIL?.map((detail, index) => {
                        return (
                          <CustomTimelineEvent
                            title={
                              <ul className="custom-list">
                                <li>
                                  Statut stockage : <b>{detail.CTN_STATUS}</b>
                                </li>
                                <li>
                                  Temps changemment status: <b>{convertHMS(detail.TEMPS_CHANGEMENT_STATUS)}</b>
                                </li>
                                <li>
                                  Temps Total : <b>{convertHMS(detail.TEMPS_CUMULATIF)}</b>
                                </li>
                              </ul>
                            }
                            createdAt={moment((detail.TS || 0) * 1000).format("LLLL")}
                            color={colors[4]}
                          />
                        );
                      })}
                    </CustomTimeline>
                  );
                })}
              </CustomTimeline>
            </>
          ) : null}
        </DialogContent>
      )}
      <DialogActions>
        <Button fullWidth onClick={handleClose} color="secondary">
          Fermer
        </Button>
      </DialogActions>
    </Dialog>
  );
};
