import {translations} from '@translations';
import {Alert, AlertStatic} from 'react-native';
import {getLanguageCode} from '../language';

export const mySUNIAlert = async (
  title: Parameters<AlertStatic['alert']>['0'],
  message?: Parameters<AlertStatic['alert']>['1'],
  buttons?: Parameters<AlertStatic['alert']>['2'],
  options?: Parameters<AlertStatic['alert']>['3'],
) => {
  const languageCode = await getLanguageCode();

  const translatedButtons = buttons?.map(button => {
    if (button.text && translations?.[button.text] === undefined) {
      console.error(`${JSON.stringify(button.text)} not found`);
    }
    const translatedButtonText = button.text
      ? translations?.[button.text]?.[languageCode] || button.text
      : button.text;

    return {
      ...button,
      text: translatedButtonText,
    };
  });

  return Alert.alert(
    translations?.[title] ? translations?.[title]?.[languageCode] : title,
    message ? translations?.[message]?.[languageCode] || message : message,
    buttons ? translatedButtons : buttons,
    options,
  );
};
