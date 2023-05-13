import { invalidLanguage } from 'fullfiller-common/src/errorMessages';
import stopwords from 'fullfiller-common/src/stopwords.json';
import { languageType } from 'fullfiller-common/src/types';

function validateLanguage(language: languageType): string[] {
  const errors: string[] = [];

  if (!(language in stopwords)) {
    errors.push(invalidLanguage(language, Object.keys(stopwords).sort()));
  }

  return errors;
}

export default validateLanguage;
