import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  private isDisabled = false;
	constructor() {
		try {
			localStorage.getItem("key");
		} catch (err) {
			console.error("Failed to use local storage", err);
			this.isDisabled = true;
		}
	}

	public getItem<T>(key: string): T | null {
		if (this.isDisabled) {
			return null;
		}
		const data: string | null = localStorage.getItem(key);

		try {
			if (data !== null) {
				return JSON.parse(data);
			}
		} catch (error) {
			console.error(error);
			this.removeItem(key);
		}

		return null;
	}

	public setItem<T>(key: string, value: T): void {
		if (this.isDisabled) {
			return;
		}
		localStorage.setItem(key, JSON.stringify(value));
	}

	public removeItem(key: string): void {
		if (this.isDisabled) {
			return;
		}
		localStorage.removeItem(key);
	}

	public clear(): void {
		if (this.isDisabled) {
			return;
		}
		localStorage.clear();
	}
}
