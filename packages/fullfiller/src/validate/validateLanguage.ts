import { invalidStopwordsLanguage } from 'fullfiller-common/src/errorMessages';
import stopwords from 'fullfiller-common/src/stopwords.json';
import { languagesType } from 'fullfiller-common/src/types';

function validateLanguage(language: languagesType): string[] {
  const errors: string[] = [];

  if (!(language in stopwords)) {
    errors.push(
      invalidStopwordsLanguage(language, Object.keys(stopwords).sort())
    );
  }

  return errors;
}

export default validateLanguage;
