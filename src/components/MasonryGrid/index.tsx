import React, {
	useCallback,
	useImperativeHandle,
	useLayoutEffect,
	useRef,
	useState,
} from "react";
import flattenChildren from "react-keyed-flatten-children";
import {
	MasonryGridBaseElement,
	MasonryGridCustomAttributes,
	MasonryGridHandle,
	MasonryGridProps,
} from "./types";
import * as Styles from "./styles";
import useUniqueRandomIds from "@/hooks/useUniqueRandomIds";
import useBeforeRender from "@/hooks/useBeforeRender";
export * from "./types";
export { MasonryGridItem } from "./styles";

const MasonryGrid = React.memo(
	React.forwardRef<MasonryGridHandle, MasonryGridProps>(
		({ customProps, children, ...otherProps }, ref) => {
			const sequential = customProps.sequential ?? false;
			const columnCnt = customProps.columnCnt;
			const columnGap = customProps.columnGap ?? "0";
			const rowGap = customProps.rowGap ?? "0";
			const forwardGridInternalComponentAs =
				customProps.forwardGridInternalComponentAs;

			const separatorCnt = columnCnt - 1;

			const gridBaseElementRef = useRef<MasonryGridBaseElement | null>(null);
			const gridInternalComponentBaseElementRef = useRef<HTMLDivElement | null>(
				null
			);

			const rerender = useState<number>(0)[1];

			const { ids: separatorKeys, keepOrExpandIds: keepOrExpandSeparatorKeys } =
				useUniqueRandomIds(columnCnt - 1);

			useBeforeRender(() => {
				keepOrExpandSeparatorKeys(columnCnt - 1 ?? 0);
			}, [columnCnt]);

			const arrIsSeparatorNeededRef = useRef<boolean[]>(
				new Array(separatorCnt).fill(false)
			);

			const flattenedChildren = flattenChildren(children);
			// console.log(flattenedChildren);

			const {
				ids: tempFlattenedChildrenKeys,
				keepOrExpandIds: keepOrExpandFlattenedChildrenKeys,
			} = useUniqueRandomIds(flattenedChildren.length - 1);

			useBeforeRender(() => {
				keepOrExpandFlattenedChildrenKeys(flattenedChildren.length - 1 ?? 0);
			}, [columnCnt]);

			const flattenedChildrenKeys = flattenedChildren.map(
				(flattenedChild, idx) =>
					React.isValidElement(flattenedChild) && flattenedChild.key !== null
						? flattenedChild.key
						: tempFlattenedChildrenKeys[idx]
			);

			useImperativeHandle(ref, () => {
				return {
					gridBaseElement: gridBaseElementRef.current,
					gridInternalComponentBaseElement:
						gridInternalComponentBaseElementRef.current,
				};
			});

			const getGridInternalComponentBaseElementInfo = useCallback(
				({
					gridInternalComponentBaseElement,
				}: {
					gridInternalComponentBaseElement: HTMLElement;
				}) => {
					const gridInternalComponentBaseElementStyle = getComputedStyle(
						gridInternalComponentBaseElement
					);

					const gridInternalComponentBaseElementPaddingTopRaw =
						gridInternalComponentBaseElementStyle.getPropertyValue(
							"padding-top"
						);
					const gridInternalComponentBaseElementPaddingTop =
						gridInternalComponentBaseElementPaddingTopRaw === ""
							? 0
							: parseFloat(gridInternalComponentBaseElementPaddingTopRaw);

					const gridInternalComponentBaseElementPaddingBottomRaw =
						gridInternalComponentBaseElementStyle.getPropertyValue(
							"padding-bottom"
						);
					const gridInternalComponentBaseElementPaddingBottom =
						gridInternalComponentBaseElementPaddingBottomRaw === ""
							? 0
							: parseFloat(gridInternalComponentBaseElementPaddingBottomRaw);

					return {
						paddingTop: gridInternalComponentBaseElementPaddingTop,
						paddingBottom: gridInternalComponentBaseElementPaddingBottom,
					};
				},
				[]
			);

			const getGridItemsInfo = useCallback(
				({ gridItems }: { gridItems: HTMLElement[] }) => {
					const gridItemsInfo: {
						element: HTMLElement;
						verticalSpace: number;
					}[] = [];

					gridItems.forEach((gridItem) => {
						const gridItemStyle = getComputedStyle(gridItem);

						const gridItemHeight = gridItem.getBoundingClientRect().height;

						const gridItemMarginTopRaw =
							gridItemStyle.getPropertyValue("margin-top");
						const gridItemMarginTop =
							gridItemMarginTopRaw === ""
								? 0
								: parseFloat(gridItemMarginTopRaw);

						const gridItemMarginBottomRaw =
							gridItemStyle.getPropertyValue("margin-bottom");
						const gridItemMarginBottom =
							gridItemMarginBottomRaw === ""
								? 0
								: parseFloat(gridItemMarginBottomRaw);

						const gridItemVerticalSpace =
							gridItemHeight + gridItemMarginTop + gridItemMarginBottom;

						gridItemsInfo.push({
							element: gridItem,
							verticalSpace: gridItemVerticalSpace,
						});
					});
					return gridItemsInfo;
				},
				[]
			);

			const getRowGap = useCallback(
				({
					gridInternalComponentBaseElement,
				}: {
					gridInternalComponentBaseElement: HTMLElement;
				}) => {
					const rowGapRaw = getComputedStyle(
						gridInternalComponentBaseElement
					).getPropertyValue("row-gap");
					const rowGap = rowGapRaw === "" ? 0 : parseFloat(rowGapRaw);
					// console.log("rowGapRaw:", rowGapRaw);
					// console.log("rowGap:", rowGap);

					return rowGap;
				},
				[]
			);

			const layout = useCallback(() => {
				const gridInternalComponentBaseElement =
					gridInternalComponentBaseElementRef.current;
				const gridBaseElement = gridBaseElementRef.current;
				if (!gridInternalComponentBaseElement || !gridBaseElement) {
					return;
				}

				// console.log("[layout]");

				const gridItemTotalCnt =
					gridInternalComponentBaseElement.children.length - separatorCnt;
				const toBePreoccupiedGridItemTotalCnt =
					gridItemTotalCnt < columnCnt ? gridItemTotalCnt : columnCnt;

				// console.log("gridItemTotalCnt:", gridItemTotalCnt);
				// console.log(
				// 	"toBePreoccupiedGridItemTotalCnt:",
				// 	toBePreoccupiedGridItemTotalCnt
				// );

				const gridItems = getGridItemsInfo({
					gridItems: (
						[...gridInternalComponentBaseElement.children] as HTMLElement[]
					).slice(0, gridItemTotalCnt),
				});
				const gridInternalComponentBaseElementInfo =
					getGridInternalComponentBaseElementInfo({
						gridInternalComponentBaseElement,
					});
				const rowGap = getRowGap({ gridInternalComponentBaseElement });

				// console.log("gridItems:", gridItems);
				// console.log(
				// 	"gridInternalComponentBaseElementInfo:",
				// 	gridInternalComponentBaseElementInfo
				// );

				const columnHeights = Array<number>(columnCnt).fill(0);
				let maxHeight = 0;

				if (sequential) {
					let gridItemIdx = 0;

					for (; gridItemIdx < toBePreoccupiedGridItemTotalCnt; gridItemIdx++) {
						const colIdx = gridItemIdx;

						const currentGridItemVerticalSpace =
							gridItems[gridItemIdx].verticalSpace;
						columnHeights[colIdx] = currentGridItemVerticalSpace;

						const currentGridItem = gridItems[gridItemIdx].element;
						currentGridItem.setAttribute(
							MasonryGridCustomAttributes.dataMasonryGridColumnNumber,
							(colIdx + 1).toString()
						);
					}
					// console.log(columnHeights);
					// console.log("gridItemIdx:", gridItemIdx);

					for (; gridItemIdx < gridItemTotalCnt; gridItemIdx++) {
						const minHeight = Math.min(...columnHeights);
						const minHeightColIdx = columnHeights.findIndex(
							(height) => height === minHeight
						);

						const currentGridItem = gridItems[gridItemIdx].element;
						currentGridItem.setAttribute(
							MasonryGridCustomAttributes.dataMasonryGridColumnNumber,
							(minHeightColIdx + 1).toString()
						);

						columnHeights[minHeightColIdx] +=
							rowGap + gridItems[gridItemIdx].verticalSpace;

						// console.log("gridItemIdx:", gridItemIdx);
						// console.log("verticalSpace:", gridItems[gridItemIdx].verticalSpace);
						// console.log("minHeightColIdx:", minHeightColIdx);
						// console.log(columnHeights);
					}

					maxHeight = Math.max(...columnHeights);

					const gridInternalComponentBaseElementHeight =
						maxHeight +
						gridInternalComponentBaseElementInfo.paddingTop +
						gridInternalComponentBaseElementInfo.paddingBottom;

					gridInternalComponentBaseElement.style.setProperty(
						"height",
						`${gridInternalComponentBaseElementHeight}px`
					);
					gridBaseElement.style.setProperty(
						"min-height",
						`${gridInternalComponentBaseElementHeight}px`
					);
				} else {
					type GridItem = {
						domOrderIdx: number;
						element: HTMLElement;
						verticalSpace: number;
					};
					type Column = {
						minDomOrderIdx: number | null;
						heightSum: number;
						gridItems: GridItem[];
					};
					function createEmptyColumn(): Column {
						return {
							minDomOrderIdx: null,
							heightSum: 0,
							gridItems: [],
						};
					}

					const columns = Array.from<Column, Column>(
						{ length: columnCnt },
						() => createEmptyColumn()
					);
					// console.log("columns:", columns);

					// Clone the gridItems with a name descendingOrderGridItems then
					// Sort in vertical space descending order
					const descendingOrderGridItems = gridItems.map<{
						domOrderIdx: number;
						element: HTMLElement;
						verticalSpace: number;
					}>((gridItem, gridItemIdx) => ({
						domOrderIdx: gridItemIdx,
						element: gridItem.element,
						verticalSpace: gridItem.verticalSpace,
					}));
					descendingOrderGridItems.sort(
						(gridItem1, gridItem2) =>
							gridItem2.verticalSpace - gridItem1.verticalSpace
					);
					let descendingOrderGridItemsIdx = 0;

					// console.log("descendingOrderGridItems:", descendingOrderGridItems);

					for (
						;
						descendingOrderGridItemsIdx < toBePreoccupiedGridItemTotalCnt;
						descendingOrderGridItemsIdx++
					) {
						const tmpColIdx = descendingOrderGridItemsIdx;

						columns[tmpColIdx].gridItems.push({
							domOrderIdx:
								descendingOrderGridItems[descendingOrderGridItemsIdx]
									.domOrderIdx,
							element:
								descendingOrderGridItems[descendingOrderGridItemsIdx].element,
							verticalSpace:
								descendingOrderGridItems[descendingOrderGridItemsIdx]
									.verticalSpace,
						});
						columns[tmpColIdx].heightSum +=
							descendingOrderGridItems[
								descendingOrderGridItemsIdx
							].verticalSpace;
						columnHeights[tmpColIdx] = columns[tmpColIdx].heightSum;

						// console.log("tmpColIdx:", tmpColIdx);
						// console.log("columns[tmpColIdx]:", columns[tmpColIdx]);
						// console.log(
						// 	"verticalSpace:",
						// 	descendingOrderGridItems[descendingOrderGridItemsIdx]
						// 		.verticalSpace
						// );
						// console.log("heightSum:", columns[tmpColIdx].heightSum);
					}

					// console.log("columns:", columns);
					// console.log("descendingOrderGridItems:", descendingOrderGridItems);

					for (
						;
						descendingOrderGridItemsIdx < gridItemTotalCnt;
						descendingOrderGridItemsIdx++
					) {
						// Find the column with the smallest heightSum
						const minColumnHeight = Math.min(...columnHeights);
						const minHeightColTmpColIdx = columns.findIndex(
							(column) => column.heightSum === minColumnHeight
						);

						// console.log("columnHeights:", columnHeights);

						columns[minHeightColTmpColIdx].gridItems.push({
							domOrderIdx:
								descendingOrderGridItems[descendingOrderGridItemsIdx]
									.domOrderIdx,
							element:
								descendingOrderGridItems[descendingOrderGridItemsIdx].element,
							verticalSpace:
								descendingOrderGridItems[descendingOrderGridItemsIdx]
									.verticalSpace,
						});
						columns[minHeightColTmpColIdx].heightSum +=
							rowGap +
							descendingOrderGridItems[descendingOrderGridItemsIdx]
								.verticalSpace;
						columnHeights[minHeightColTmpColIdx] =
							columns[minHeightColTmpColIdx].heightSum;

						// console.log(
						// 	"descendingOrderGridItemsIdx:",
						// 	descendingOrderGridItemsIdx
						// );
						// console.log(
						// 	"verticalSpace:",
						// 	descendingOrderGridItems[descendingOrderGridItemsIdx]
						// 		.verticalSpace
						// );
						// console.log("minColumnHeight:", minColumnHeight);
						// console.log("smallestColumnTempIdx:", smallestColumnTempIdx);
					}

					// console.log("columns:", columns);

					for (let tmpColIdx = 0; tmpColIdx < columnCnt; tmpColIdx++) {
						if (columns[tmpColIdx].gridItems.length === 0) {
							columns[tmpColIdx].minDomOrderIdx = gridItemTotalCnt; // max value
						} else {
							const minDomOrderIdx = Math.min(
								...columns[tmpColIdx].gridItems.map(
									(gridItem) => gridItem.domOrderIdx
								)
							);
							columns[tmpColIdx].minDomOrderIdx = minDomOrderIdx;
						}
					}

					// Sort in minDomOrderIdx ascending order
					columns.sort(
						(column1, column2) =>
							column1.minDomOrderIdx! - column2.minDomOrderIdx!
					);

					columns.forEach((column, colIdx) => {
						// Update the `columnHeights` order to be in sync with `domOrderColumns`
						columnHeights[colIdx] = column.heightSum;

						// Set column attribute for every gridItem
						column.gridItems.forEach((gridItem) => {
							gridItem.element.setAttribute(
								MasonryGridCustomAttributes.dataMasonryGridColumnNumber,
								(colIdx + 1).toString()
							);
						});
					});

					maxHeight = Math.max(...columnHeights);

					const gridInternalComponentBaseElementHeight =
						maxHeight +
						gridInternalComponentBaseElementInfo.paddingTop +
						gridInternalComponentBaseElementInfo.paddingBottom;

					gridInternalComponentBaseElement.style.setProperty(
						"height",
						`${gridInternalComponentBaseElementHeight}px`
					);
					gridBaseElement.style.setProperty(
						"min-height",
						`${gridInternalComponentBaseElementHeight}px`
					);
				}

				const maxHeightColIdx = columnHeights.findIndex(
					(height) => height === maxHeight
				);
				console.log("columnHeights:", columnHeights);
				console.log("maxHeightColIdx:", maxHeightColIdx);

				for (
					let separatorIdx = 0;
					separatorIdx < separatorCnt;
					separatorIdx++
				) {
					const colIdx = separatorIdx;

					const separator = gridInternalComponentBaseElement.children[
						gridItemTotalCnt + separatorIdx
					] as HTMLElement;

					separator.setAttribute(
						MasonryGridCustomAttributes.dataMasonryGridColumnNumber,
						(separatorIdx + 1).toString()
					);

					arrIsSeparatorNeededRef.current[separatorIdx] =
						colIdx === maxHeightColIdx
							? false
							: columnHeights[colIdx] + rowGap < maxHeight
							? true
							: false;

					console.log(arrIsSeparatorNeededRef.current);

					if (arrIsSeparatorNeededRef.current[separatorIdx]) {
						const separatorHeight =
							maxHeight - (columnHeights[colIdx] + rowGap);
						separator.style.setProperty("height", `${separatorHeight}px`);
					} else {
						separator.style.setProperty("display", "none");
					}
				}

				// console.log(columnHeights);
				// console.log(arrIsSeparatorNeededRef.current);
				rerender((prev) => (prev > 1000 ? 0 : prev + 1));
			}, [
				sequential,
				columnCnt,
				separatorCnt,
				rerender,
				getGridInternalComponentBaseElementInfo,
				getGridItemsInfo,
				getRowGap,
			]);

			useLayoutEffect(() => {
				const gridInternalComponentBaseElement = (
					gridInternalComponentBaseElementRef as React.RefObject<HTMLDivElement | null>
				).current;
				if (!gridInternalComponentBaseElement) {
					return;
				}

				let animationFrame: number | null = null;
				const resizeObserver = new ResizeObserver((entries, observer) => {
					// console.log("entries:", entries);
					animationFrame = requestAnimationFrame(layout);
				});
				if (resizeObserver) {
					const gridItemTotalCnt =
						gridInternalComponentBaseElement.children.length - separatorCnt;

					const gridItems = (
						[...gridInternalComponentBaseElement.children] as HTMLElement[]
					).slice(0, gridItemTotalCnt);

					gridItems.forEach((child) => resizeObserver.observe(child));
				}

				layout();

				return () => {
					if (animationFrame !== null) {
						cancelAnimationFrame(animationFrame);
					}
					resizeObserver?.disconnect();
				};
			}, [separatorCnt, layout]);

			return (
				<Styles.MasonryGrid ref={gridBaseElementRef}>
					<Styles.MasonryGridInternalComponent
						ref={gridInternalComponentBaseElementRef}
						forwardedAs={forwardGridInternalComponentAs}
						customProps={{ columnCnt, columnGap, rowGap }}
						{...otherProps}
					>
						{/* To detect margin size change in each child, each child is wrapped with div of which the size is being monitored by the ResizeObserver. */}
						{flattenedChildren.map((flattenedChild, idx) =>
							React.isValidElement(flattenedChild) ? (
								<div key={flattenedChildrenKeys[idx]}>
									{React.cloneElement(flattenedChild, {
										key: flattenedChildrenKeys[idx],
									})}
								</div>
							) : (
								flattenedChild
							)
						)}
						{new Array<typeof Styles.MasonryGridColumnSeparator | null>(
							separatorCnt
						)
							.fill(null)
							.map((separator, idx) => {
								// console.log(`[${idx}]:`, arrIsSeparatorNeededRef.current[idx]);
								return (
									<Styles.MasonryGridColumnSeparator
										key={separatorKeys[idx]}
										customProps={{
											isNeeded: arrIsSeparatorNeededRef.current[idx],
										}}
									/>
								);
							})}
					</Styles.MasonryGridInternalComponent>
				</Styles.MasonryGrid>
			);
		}
	)
);

MasonryGrid.displayName = "MasonryGrid";

export default MasonryGrid;
