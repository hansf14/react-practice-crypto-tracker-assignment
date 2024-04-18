import "styled-components";

declare module "styled-components" {
	export interface DefaultTheme {
		bodyTextColor: string;
		bodyBackgroundColor: string;
		navBarHeight: string;
		navBarTextColor: string;
		navBarHoverTextColor: string;
		navBarBackgroundColor: string;
		navBarBorderColor: string;
		mainTitleTextColor: string;
		linkHoverTextColor: string;
		sectionTitleTextColor01: string;
		sectionBackgroundColor01: string;
		sectionBackgroundColor02: string;
		sectionBorderStyle: string;
		lastUpdatedContainerTextColor: string;
		listTextColor: string;
		listBoxTextColor: string;
		listBoxHoverTextColor: string;
		listBoxBorderStyle: string;
		listBoxBackgroundColor: string;
		nestedListDecoratorColor: string;
		tabBackgroundColor: string;
		tabActiveBackgroundColor: string;
	}
}
