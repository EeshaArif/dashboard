import { TuiDay, TuiTime } from "@taiga-ui/cdk";

export function toTuiDatetime(dateValue: any): [TuiDay, TuiTime] | null {
	if (!dateValue) {
		return null;
	}

	if (typeof dateValue == "string") {
		dateValue = new Date(dateValue);
	}

	return [new TuiDay(dateValue.getFullYear(), dateValue.getMonth(), dateValue.getDate()), new TuiTime(dateValue.getHours(), dateValue.getMinutes())];
}