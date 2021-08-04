export interface TowerControlFullData {
  _id?: string;
  REC_ID?: number;
  REC_STATUS?: number;
  OFA_STATUS?: number;
  CTN_NB_STATUS_FINAUX?: number;
  CTN_NB?: number;
  TAC_NB_STATUS_FINAUX?: number;
  TAC_NB?: number;
  PARTNUMBER?: string;
  URGENCE_RECEPTION?: string;
  FLUX?: string;
  FLUX_DETAIL?: string;
  OFA_TYPE_PRELEVEMENT?: string;
  OFA_QUANTITE?: number;
  TOF_ID?: number;
  DATE_CREATION?: string;
  TS_CREATION?: number;
  DATE_FERMETURE?: string;
  TS_FERMETURE?: number;
  CYCLE_VIE?: {
    REC_ID?: number;
  }[];
  REC_CYCLE_VIE?: RecCycleVieData[];
  OFA_CYCLE_VIE?: OfaCycleVieData[];
  CTN_CYCLE_VIE?: CtnCycleVieData[];
  TAC_CYCLE_VIE?: TacCycleVieData[];
  DOH_CYCLE_VIE?: DohCycleVieData[];
}

interface RecCycleVieData {
  REC_ID?: number;
  OP_TYPE?: string;
  REC_STATUS?: number;
  REC_URGENCE?: string;
  REC_ART_PARTNO?: string;
  REC_QUANTITE_RECUE?: number;
  TRE_ID?: string;
  TFR_ID?: string;
  TS?: number;
  TEMPS_CHANGEMENT_STATUS?: number;
  TEMPS_CUMULATIF?: number;
}

interface OfaCycleVieData {
  REC_ID?: number;
  OP_TYPE?: string;
  OFA_STATUS?: number;
  OFA_ID?: number;
  TS?: number;
  TOF_ID?: number;
  OFA_ART_PARTNO?: string;
  OFA_TYPE_PRELEVEMENT?: string;
  OFA_QUANTITE?: number;
  TEMPS_CHANGEMENT_STATUS?: number;
  TEMPS_CUMULATIF?: number;
}

interface CtnCycleVieData {
  CTN_ID?: number;
  CTN_STATUS?: number;
  CYCLE_VIE_DETAIL?: CtnCycleVieDetailData[];
}

interface CtnCycleVieDetailData {
  REC_ID?: number;
  OP_TYPE?: string;
  CTN_STATUS?: number;
  CTN_ID?: number;
  CTN_QUANTITE?: number;
  TS?: number;
  TEMPS_CHANGEMENT_STATUS?: number;
  TEMPS_CUMULATIF?: number;
}

interface TacCycleVieData {
  TAC_ID?: number;
  TAC_STATUS?: number;
  CYCLE_VIE_DETAIL?: TacCycleVieDetailData[];
}

interface TacCycleVieDetailData {
  REC_ID?: number;
  OP_TYPE?: string;
  TAC_STATUS?: number;
  TAC_ID?: number;
  MET_LIBELLE?: string;
  TS?: number;
  TEMPS_CHANGEMENT_STATUS?: number;
  TEMPS_CUMULATIF?: number;
}

interface DohCycleVieData {
  DOH_ID?: number;
  DOH_STATUS?: number;
  CYCLE_VIE_DETAIL?: DohCycleVieDetailData[];
}

interface DohCycleVieDetailData {
  REC_ID?: number;
  OFA_ID?: number;
  OP_TYPE?: string;
  DOH_STATUS?: number;
  DOH_ID?: number;
  DOH_DATE_ENGAGEMENT?: string;
  OFA_QUANTITE?: number;
  TS?: number;
  TEMPS_CHANGEMENT_STATUS?: number;
  TEMPS_CUMULATIF?: number;
}
