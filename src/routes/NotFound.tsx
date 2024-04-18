import { Helmet } from "react-helmet-async";
import Container from "@/components/Container";
import Header from "@/components/Header";
import MainTitle from "@/components/MainTitle";
import styled from "styled-components";

const Description = styled.span`
	text-align: center;
	display: block;
`;

function NotFound() {
	return (
		<Container>
			<Helmet>
				<title>Error 404</title>
				<link
					rel="icon"
					type="image/png"
					href={`${process.env.PUBLIC_URL}/favicon.png`}
					sizes="16x16"
				/>
			</Helmet>
			<Header>
				<MainTitle>Error 404</MainTitle>
			</Header>
			<Description>Error 404: Page not found.</Description>
		</Container>
	);
}

export default NotFound;
