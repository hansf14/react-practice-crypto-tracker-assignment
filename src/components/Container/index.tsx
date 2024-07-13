import styled from "styled-components";

const Container = styled.div`
	max-width: 600px;
	margin: 0 auto;

	${({ theme }) =>
		theme.navBarHeight ? `padding-top: ${theme.navBarHeight}px;` : ""};
	padding-left: 15px;
	padding-right: 15px;
`;

export default Container;
