import React, {
	useCallback,
	useImperativeHandle,
	useLayoutEffect,
	useRef,
} from "react";
import flattenChildren from "react-keyed-flatten-children";
import {
	MasonryGridBaseElement,
	MasonryGridHandle,
	MasonryGridProps,
} from "./types";
import * as Styles from "./styles";
import useUniqueRandomIds from "@/hooks/useUniqueRandomIds";
import useBeforeRender from "@/hooks/useBeforeRender";

const MasonryGrid = React.memo(
	React.forwardRef<MasonryGridHandle, MasonryGridProps>(
		({ customProps, children, ...otherProps }, ref) => {
			const columnCnt = customProps.columnCnt;
			const columnGap = customProps.columnGap;
			const rowGap = customProps.rowGap;

			const gridRootElementRef = useRef<MasonryGridBaseElement | null>(null);
			const gridElementRef = useRef<HTMLDivElement | null>(null);

			const { ids: separatorKeys, keepOrExpandIds: keepOrExpandSeparatorKeys } =
				useUniqueRandomIds(columnCnt - 1);

			useBeforeRender(() => {
				keepOrExpandSeparatorKeys(columnCnt - 1 ?? 0);
			}, [columnCnt]);

			const flattenedChildren = flattenChildren(children);
			console.log(flattenedChildren);

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
					rootElement: gridRootElementRef.current,
					gridElement: gridElementRef.current,
				};
			});

			const layout = useCallback(() => {
				const gridElement = gridElementRef.current;
				const gridRootElement = gridRootElementRef.current;
				if (!gridElement || !gridRootElement) {
					return;
				}

				// console.log("[layout]");

				let itemCnt = 0;
				const separatorCnt = columnCnt - 1;
				const columnHeights: number[] = [];
				for (let col = 1; col <= columnCnt; col++) {
					columnHeights[col - 1] =
						gridElement.children[col - 1].getBoundingClientRect().height;
					(gridElement.children[col - 1] as HTMLElement).style.setProperty(
						"order",
						col.toString()
					);

					itemCnt++;
				}
				// console.log(columnHeights);

				const rowGapHeightRaw =
					getComputedStyle(gridElement).getPropertyValue("row-gap");
				const rowGapHeight =
					rowGapHeightRaw === "" ? 0 : parseFloat(rowGapHeightRaw);
				// console.log(rowGapHeightRaw);
				// console.log("rowGapHeight:", rowGapHeight);

				for (
					;
					itemCnt < gridElement.children.length - separatorCnt;
					itemCnt++
				) {
					const minHeight = Math.min(...columnHeights);
					const minHeightColumnIdx = columnHeights.findIndex(
						(height) => height === minHeight
					);

					const currentItemStyle = getComputedStyle(
						gridElement.children[itemCnt]
					);
					const currentItemHeight =
						gridElement.children[itemCnt].getBoundingClientRect().height;
					const currentItemMarginTopRaw =
						currentItemStyle.getPropertyValue("margin-top");
					const currentItemMarginTop =
						currentItemMarginTopRaw === ""
							? 0
							: parseFloat(currentItemMarginTopRaw);
					const currentItemMarginBottomRaw =
						currentItemStyle.getPropertyValue("margin-bottom");
					const currentItemMarginBottom =
						currentItemMarginBottomRaw === ""
							? 0
							: parseFloat(currentItemMarginBottomRaw);

					(gridElement.children[itemCnt] as HTMLElement).style.setProperty(
						"order",
						(minHeightColumnIdx + 1).toString()
					);
					columnHeights[minHeightColumnIdx] +=
						rowGapHeight +
						currentItemHeight +
						currentItemMarginTop +
						currentItemMarginBottom;
				}

				for (
					let separator = 1;
					separator <= separatorCnt;
					separator++, itemCnt++
				) {
					(gridElement.children[itemCnt] as HTMLElement).style.setProperty(
						"order",
						separator.toString()
					);
				}

				const maxHeight = Math.max(...columnHeights);
				const gridElementStyle = getComputedStyle(gridElement);
				const gridElementPaddingTopRaw =
					gridElementStyle.getPropertyValue("padding-top");
				const gridElementPaddingTop =
					gridElementPaddingTopRaw === ""
						? 0
						: parseFloat(gridElementPaddingTopRaw);
				const gridElementPaddingBottomRaw =
					gridElementStyle.getPropertyValue("padding-top");
				const gridElementPaddingBottom =
					gridElementPaddingBottomRaw === ""
						? 0
						: parseFloat(gridElementPaddingBottomRaw);
				const gridElementHeight =
					maxHeight + gridElementPaddingTop + gridElementPaddingBottom;

				// console.log("columnHeights:", columnHeights);
				// console.log("gridElementHeight:", gridElementHeight);

				gridElement.style.setProperty("height", `${gridElementHeight}px`);
				gridRootElement.style.setProperty(
					"min-height",
					`${gridElementHeight}px`
				);
			}, [columnCnt]);

			useLayoutEffect(() => {
				const gridElement = (
					gridElementRef as React.RefObject<HTMLDivElement | null>
				).current;
				if (!gridElement) {
					return;
				}

				let animationFrame: number | null = null;
				const resizeObserver = new ResizeObserver((entries, observer) => {
					// console.log("entries:", entries);
					animationFrame = requestAnimationFrame(layout);
				});
				if (resizeObserver) {
					([...gridElement.children] as HTMLElement[]).forEach((child) =>
						resizeObserver.observe(child)
					);
					resizeObserver.observe(gridElement);
				}

				layout();

				return () => {
					if (animationFrame !== null) {
						cancelAnimationFrame(animationFrame);
					}
					resizeObserver?.disconnect();
				};
			}, [flattenedChildren, layout]);
			// }, [ref, itemsPerRow]);

			return (
				<Styles.MasonryGridRootElement ref={gridRootElementRef}>
					<Styles.MasonryGridElement
						ref={gridElementRef}
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
							columnCnt - 1
						)
							.fill(null)
							.map((separator, idx) => (
								<Styles.MasonryGridColumnSeparator key={separatorKeys[idx]} />
							))}
					</Styles.MasonryGridElement>
				</Styles.MasonryGridRootElement>
			);
		}
	)
);

MasonryGrid.displayName = "MasonryGrid";

export default MasonryGrid;
