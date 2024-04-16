import React from "react";
import * as Styles from "./styles";
import { ErrorDescriptionProps, ErrorDescriptionRefElement } from "./types";

const ErrorDescription = React.memo(
	React.forwardRef<ErrorDescriptionRefElement, ErrorDescriptionProps>(
		({ customProps, ...otherProps }, ref) => {
			const error = customProps.error;

			return (
				<Styles.ErrorDescription ref={ref} {...otherProps}>
					{error instanceof Error
						? `Error ${error.message}`
						: `Error: ${error as string}`}
				</Styles.ErrorDescription>
			);
		}
	)
);

ErrorDescription.displayName = "ErrorDescription";

export default ErrorDescription;
