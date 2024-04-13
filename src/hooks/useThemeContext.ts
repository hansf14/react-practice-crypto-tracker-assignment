import React, { useEffect, useState } from "react";
import { DefaultTheme } from "styled-components";

let isInitialized = false;
let currentTheme: DefaultTheme | undefined = undefined;

class Singleton {
	private static _instance: Singleton;
	private constructor() {
		if (!Singleton._instance) {
			Singleton._instance = this;
		}

		return Singleton._instance;
	}
	public static get instance() {
		return this._instance || (this._instance = new this());
	}

	private static _staticUseState = (() => {
		let state: DefaultTheme | undefined = undefined;
		let setStateCallbacks: React.Dispatch<
			React.SetStateAction<DefaultTheme>
		>[] = []; // Array to hold callbacks to update state

		return (initialValue: DefaultTheme) => {
			if (typeof state === "undefined") {
				state = initialValue;
			}

			const setState = (newValue: DefaultTheme) => {
				state = newValue;
				// Call all callbacks to trigger re-renders
				setStateCallbacks.forEach((callback) => callback(newValue));
			};

			// Register the component's setState function
			const [, setCallback] = useState<DefaultTheme>(state!);
			useEffect(() => {
				setStateCallbacks.push(setCallback);
				return () => {
					setStateCallbacks = setStateCallbacks.filter(
						(cb) => cb !== setCallback
					);
				};
			}, []);

			const a = [state, setState] as [
				DefaultTheme,
				React.Dispatch<React.SetStateAction<DefaultTheme>>
			];
			return a;
		};
	})();

	public static useThemeContext = (initialTheme?: DefaultTheme) => {
		if (!isInitialized && initialTheme) {
			currentTheme = initialTheme;
		}

		if (!currentTheme) {
			return {
				theme: null,
				setTheme: () => {},
			};
		}

		const [theme, setTheme] = Singleton._staticUseState(currentTheme);
		return {
			theme,
			setTheme,
		};
	};
}

// const singleton = Singleton.instance;
export default Singleton.useThemeContext;
