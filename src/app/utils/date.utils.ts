import { TuiDay, TuiTime } from "@taiga-ui/cdk";

export function getFormattedDate(date: Date) {
  const year = date.getFullYear();
  const month = (1 + date.getMonth()).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function getFormattedTime(date: Date) {
  const hour = date.getUTCHours().toString().padStart(2, '0');
  const minute = date.getUTCMinutes().toString().padStart(2, '0');

  return `${hour}:${minute}`;
}

export function getBrowserLocales(options = {}) {
  const defaultOptions = {
    languageCodeOnly: false,
  };
  const opt = {
    ...defaultOptions,
    ...options,
  };
  const browserLocales =
    navigator.languages === undefined
      ? [navigator.language]
      : navigator.languages;

  if (!browserLocales) {
    return [];
  }

  return browserLocales.map((locale) => {
    const trimmedLocale = locale.trim();
    return opt.languageCodeOnly ? trimmedLocale.split(/-|_/)[0] : trimmedLocale;
  });
}

export function parseDateToEpoch(dateString: string) {
  if (!dateString) {
    return;
  }

  // Convert to ISO 8601 calendar date
  const splitDate = dateString.split('+');
  dateString = splitDate[0] + '.000+' + splitDate[1];
  return Date.parse(dateString);
}

export function parseCreatedAtToEpoch(dateString: string) {
  const createdAtString = removeMiliseconds(dateString);
  return Date.parse(createdAtString);
}

export function parseDate(dateString: string) {
  // Convert to ISO 8601 calendar date
  const dateEpoch = parseDateToEpoch(dateString);
  if (dateEpoch) {
    return new Date(dateEpoch);
  }
  return null;
}

export function parseCreatedAtToString(
  dateString: string,
  showTime?: boolean,
  locale?: string
) {
  const defaultLocale = locale ? locale : getBrowserLocales()[0];
  const createdAtString = removeMiliseconds(dateString);
  const createdAtEpoch = Date.parse(createdAtString);
  const date = new Date(createdAtEpoch);
  return showTime
    ? date.toLocaleDateString(defaultLocale) +
        ' ' +
        date.toLocaleTimeString(defaultLocale, {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })
    : date.toLocaleDateString(defaultLocale);
}

export function parseDateToLocaleDateString(
  dateString: string,
  showTime?: boolean,
  locale?: string
) {
  const defaultLocale = locale ? locale : getBrowserLocales()[0];

  // Convert to ISO 8601 calendar date
  const dateEpoch = parseDateToEpoch(dateString);
  const date = dateEpoch ? new Date(dateEpoch) : null;
  if (!date) {
    return null;
  }
  return showTime
    ? date.toLocaleDateString(defaultLocale) +
        ' ' +
        date.toLocaleTimeString(defaultLocale, {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })
    : date.toLocaleDateString(defaultLocale);
}

export function parseDateToLocaleTimeString(
  dateString: string,
  locale?: string
) {
  const defaultLocale = locale ? locale : getBrowserLocales()[0];

  // Convert to ISO 8601 calendar date
  const dateEpoch = parseDateToEpoch(dateString);
  const date = dateEpoch ? new Date(dateEpoch) : null;
  return date
    ? date.toLocaleTimeString(defaultLocale, {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
    : null;
}

export function removeMiliseconds(dateString: string) {
  const splitDate = dateString.split('+');
  const datetime = splitDate[0].split('.');
  return datetime[0] + '.000+' + (splitDate[1] ?? '00:00');
}


export function toTuiDatetime(date: any): [TuiDay, TuiTime] | null {
	if (!date) {
		return null;
	}

	if (typeof date == "string") {
		date = new Date(date);
	}

	return [new TuiDay(date.getFullYear(), date.getMonth(), date.getDate()), new TuiTime(date.getHours(), date.getMinutes())];
}