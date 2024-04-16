import styled from "styled-components";

const Title = styled.h1`
	color: ${({ theme }) => (theme.keyColor03 ? theme.keyColor03 : "#ffe600")};
	transition: color 0.3s ease-in-out;
	font-size: 40px;
	font-weight: bold;
`;

export default Title;
