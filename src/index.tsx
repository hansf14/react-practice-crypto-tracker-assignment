import React from "react";
import ReactDOM from "react-dom";
import App from "@/App";
import { HelmetProvider } from "react-helmet-async";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

const Root = () => {
	return (
		// <React.StrictMode>
		<HelmetProvider>
			<QueryClientProvider client={queryClient}>
				<App />
			</QueryClientProvider>
		</HelmetProvider>
		// </React.StrictMode>,
	);
};

ReactDOM.render(<Root />, document.getElementById("root"));
