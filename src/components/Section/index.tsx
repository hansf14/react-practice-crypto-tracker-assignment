import styled from "styled-components";

export const SectionTitle = styled.h2`
	margin-bottom: 15px;
	font-size: 20px;
	font-weight: bold;
`;

const Section = styled.section`
	display: flex;
	flex-direction: column;

	padding: 20px;
	${({ theme }) =>
		theme.sectionBorderStyle ? `border: ${theme.sectionBorderStyle};` : ""}

	// &:not(:first-of-type) {
	// 	border-top: none;
	// }
	& + & {
		border-top: none;
	}

	&:nth-of-type(2n + 1) {
		background-color: ${({ theme }) =>
			theme.sectionBackgroundColor01 ? theme.sectionBackgroundColor01 : "#fff"};
	}

	&:nth-of-type(2n) {
		background-color: ${({ theme }) =>
			theme.sectionBackgroundColor02 ? theme.sectionBackgroundColor02 : "#fff"};
	}

	&:nth-of-type(2n + 1) ${SectionTitle} {
		color: ${({ theme }) =>
			theme.sectionTitleTextColor01 ? theme.sectionTitleTextColor01 : "#000"};
	}
`;

export default Section;
