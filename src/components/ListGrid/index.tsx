import React from "react";
import * as Styles from "./styles";
import { ListGridProps, ListGridRefElement } from "./types";
export * from "./types";
export { ListGridItem } from "./styles";

const ListGrid = React.memo(
	React.forwardRef<ListGridRefElement, ListGridProps>(
		({ children, customProps, ...otherProps }, ref) => {
			return (
				<Styles.ListGrid ref={ref} customProps={customProps} {...otherProps}>
					{children}
				</Styles.ListGrid>
			);
		}
	)
);

ListGrid.displayName = "ListGrid";

export default ListGrid;
