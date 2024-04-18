import styled from "styled-components";

const MainTitle = styled.h1`
	color: ${({ theme }) =>
		theme.mainTitleTextColor ? theme.mainTitleTextColor : "#000"};
	transition: color 0.3s ease-in-out;
	font-size: 40px;
	font-weight: bold;
`;

export default MainTitle;
