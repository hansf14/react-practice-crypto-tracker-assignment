import styled from "styled-components";

const Container = styled.div`
	${({ theme }) =>
		theme.navBarHeight ? `padding-top: ${theme.navBarHeight}px;` : ""};
	max-width: 600px;
	margin: 0 auto;
`;

export default Container;
