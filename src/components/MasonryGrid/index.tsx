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

				let columnHeights: number[] = [];
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
						const minHeightColumnIdx = columnHeights.findIndex(
							(height) => height === minHeight
						);

						const currentGridItem = gridItems[gridItemIdx].element;
						currentGridItem.setAttribute(
							MasonryGridCustomAttributes.dataMasonryGridColumnNumber,
							(minHeightColumnIdx + 1).toString()
						);

						columnHeights[minHeightColumnIdx] +=
							rowGap + gridItems[gridItemIdx].verticalSpace;

						// console.log("gridItemIdx:", gridItemIdx);
						// console.log("verticalSpace:", gridItems[gridItemIdx].verticalSpace);
						// console.log("minHeightColumnIdx:", minHeightColumnIdx);
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
					const columns = Array.from<
						{
							columnIdx: number | null;
							heightSum: number;
							gridItems: {
								domOrderIdx: number;
								element: HTMLElement;
								verticalSpace: number;
							}[];
						},
						{
							columnIdx: number | null;
							heightSum: number;
							gridItems: {
								domOrderIdx: number;
								element: HTMLElement;
								verticalSpace: number;
							}[];
						}
					>({ length: columnCnt }, () => ({
						columnIdx: null,
						heightSum: 0,
						gridItems: [],
					}));

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
						const columnHeights = columns.map((column) => column.heightSum);
						const minColumnHeight = Math.min(...columnHeights);
						const smallestColumnTempIdx = columns.findIndex(
							(column) => column.heightSum === minColumnHeight
						);

						// console.log("columnHeights:", columnHeights);

						columns[smallestColumnTempIdx].gridItems.push({
							domOrderIdx:
								descendingOrderGridItems[descendingOrderGridItemsIdx]
									.domOrderIdx,
							element:
								descendingOrderGridItems[descendingOrderGridItemsIdx].element,
							verticalSpace:
								descendingOrderGridItems[descendingOrderGridItemsIdx]
									.verticalSpace,
						});
						columns[smallestColumnTempIdx].heightSum +=
							rowGap +
							descendingOrderGridItems[descendingOrderGridItemsIdx]
								.verticalSpace;

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

					const minDomOrderIdxArr: {
						tmpColIdx: number;
						minDomOrderIdx: number;
					}[] = [];
					for (let tmpColIdx = 0; tmpColIdx < columnCnt; tmpColIdx++) {
						const domOrderIdxArr = columns[tmpColIdx].gridItems.map(
							(gridItem) => gridItem.domOrderIdx
						);
						const minDomOrderIdx = Math.min(...domOrderIdxArr);
						minDomOrderIdxArr.push({
							tmpColIdx,
							minDomOrderIdx,
						});
					}

					// Sort in minDomOrderIdx ascending order
					minDomOrderIdxArr.sort(
						(minDomOrderIdxInColumn1, minDomOrderIdxArrInColumn2) =>
							minDomOrderIdxInColumn1.minDomOrderIdx -
							minDomOrderIdxArrInColumn2.minDomOrderIdx
					);
					minDomOrderIdxArr.forEach((column, domOrderIdx) => {
						columns[column.tmpColIdx].columnIdx = domOrderIdx;
					});

					// Sort the columns in minDomIdx ascending order.
					// domOrderColumns.length <= columns.length
					const domOrderColumns = columns
						.filter((column) => column.columnIdx !== null)
						.sort(
							(column1, column2) => column1.columnIdx! - column2.columnIdx!
						);
					if (domOrderColumns.length < columns.length) {
						for (
							let colIdx = domOrderColumns.length;
							colIdx < columns.length;
							colIdx++
						) {
							domOrderColumns[colIdx] = {
								columnIdx: colIdx,
								gridItems: [],
								heightSum: 0,
							};
						}
					}
					// Now, domOrderColumns.length == columns.length

					domOrderColumns.forEach((column) => {
						column.gridItems.forEach((gridItem) => {
							gridItem.element.setAttribute(
								MasonryGridCustomAttributes.dataMasonryGridColumnNumber,
								(column.columnIdx! + 1).toString()
							);
						});
					});

					const domOrderColumnHeights = domOrderColumns.map(
						(column) => column.heightSum
					);
					maxHeight = Math.max(...domOrderColumnHeights);

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

					columnHeights = domOrderColumns.map((column) => column.heightSum);
				}

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
						Math.round(columnHeights[colIdx] + rowGap) < Math.round(maxHeight)
							? true
							: false;

					if (arrIsSeparatorNeededRef.current[colIdx]) {
						const separatorHeight =
							Math.round(maxHeight) -
							Math.round(columnHeights[colIdx] + rowGap) -
							1;
						separator.style.setProperty("height", `${separatorHeight}px`);
					}
				}

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
					(
						[...gridInternalComponentBaseElement.children] as HTMLElement[]
					).forEach((child) => resizeObserver.observe(child));
					resizeObserver.observe(gridInternalComponentBaseElement);
				}

				layout();

				return () => {
					if (animationFrame !== null) {
						cancelAnimationFrame(animationFrame);
					}
					resizeObserver?.disconnect();
				};
			}, [layout]);

			// console.log(arrIsSeparatorNeededRef.current);

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
