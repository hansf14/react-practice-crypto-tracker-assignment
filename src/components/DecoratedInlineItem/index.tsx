import React from "react";
import * as Styles from "./styles";
import {
	DecoratedInlineItemProps,
	DecoratedInlineItemRefElement,
} from "./types";
export * from "./types";

const DecoratedInlineItem = React.memo(
	React.forwardRef<DecoratedInlineItemRefElement, DecoratedInlineItemProps>(
		({ customProps, children, ...otherProps }, ref) => {
			return (
				<Styles.DecoratedInlineItem
					ref={ref}
					customProps={customProps}
					{...otherProps}
				>
					<Styles.DecoratedInlineItemInternalComponent
						customProps={customProps}
					>
						{children}
					</Styles.DecoratedInlineItemInternalComponent>
				</Styles.DecoratedInlineItem>
			);
		}
	)
);

DecoratedInlineItem.displayName = "DecoratedInlineItem";

export default DecoratedInlineItem;
