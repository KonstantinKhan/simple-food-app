export interface MeasureTranslation {
  locale: string;
  measureName: string;
  measureShortName: string;
}

export interface MeasureDetail {
  id: string;
  code: string;
  translations: MeasureTranslation[];
}


