import React from "react";
import ReactDOM from "react-dom";
import { ThemeProvider } from "styled-components";
import App from "./App";
import { theme } from "./theme";
import { HelmetProvider } from "react-helmet-async";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

ReactDOM.render(
	<React.StrictMode>
		<HelmetProvider>
			<QueryClientProvider client={queryClient}>
				<ThemeProvider theme={theme}>
					<App />
				</ThemeProvider>
			</QueryClientProvider>
		</HelmetProvider>
	</React.StrictMode>,
	document.getElementById("root")
);
