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
			const columnCnt = customProps.columnCnt;
			const columnGap = customProps.columnGap ?? "0";
			const rowGap = customProps.rowGap ?? "0";

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

			const layout = useCallback(() => {
				const gridInternalComponentBaseElement =
					gridInternalComponentBaseElementRef.current;
				const gridBaseElement = gridBaseElementRef.current;
				if (!gridInternalComponentBaseElement || !gridBaseElement) {
					return;
				}

				// console.log("[layout]");

				let itemCnt = 0;
				const columnHeights: number[] = [];
				for (let col = 1; col <= columnCnt; col++) {
					columnHeights[col - 1] =
						gridInternalComponentBaseElement.children[
							col - 1
						].getBoundingClientRect().height;
					(
						gridInternalComponentBaseElement.children[col - 1] as HTMLElement
					).setAttribute(
						MasonryGridCustomAttributes.dataMasonryGridColumnNumber,
						col.toString()
					);

					itemCnt++;
				}

				const rowGapHeightRaw = getComputedStyle(
					gridInternalComponentBaseElement
				).getPropertyValue("row-gap");
				const rowGapHeight =
					rowGapHeightRaw === "" ? 0 : parseFloat(rowGapHeightRaw);
				// console.log(rowGapHeightRaw);
				// console.log("rowGapHeight:", rowGapHeight);

				for (
					;
					itemCnt <
					gridInternalComponentBaseElement.children.length - separatorCnt;
					itemCnt++
				) {
					const minHeight = Math.min(...columnHeights);
					const minHeightColumnIdx = columnHeights.findIndex(
						(height) => height === minHeight
					);

					const currentItemStyle = getComputedStyle(
						gridInternalComponentBaseElement.children[itemCnt]
					);
					const currentItemHeight =
						gridInternalComponentBaseElement.children[
							itemCnt
						].getBoundingClientRect().height;
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

					(
						gridInternalComponentBaseElement.children[itemCnt] as HTMLElement
					).setAttribute(
						MasonryGridCustomAttributes.dataMasonryGridColumnNumber,
						(minHeightColumnIdx + 1).toString()
					);

					// console.log("itemCnt:", itemCnt);
					// console.log("minHeightColumnIdx:", minHeightColumnIdx);

					columnHeights[minHeightColumnIdx] +=
						rowGapHeight +
						currentItemHeight +
						currentItemMarginTop +
						currentItemMarginBottom;

					// console.log(columnHeights);
				}

				const maxHeight = Math.max(...columnHeights);
				const gridInternalComponentBaseElementStyle = getComputedStyle(
					gridInternalComponentBaseElement
				);
				const gridInternalComponentBaseElementPaddingTopRaw =
					gridInternalComponentBaseElementStyle.getPropertyValue("padding-top");
				const gridInternalComponentBaseElementPaddingTop =
					gridInternalComponentBaseElementPaddingTopRaw === ""
						? 0
						: parseFloat(gridInternalComponentBaseElementPaddingTopRaw);
				const gridInternalComponentBaseElementPaddingBottomRaw =
					gridInternalComponentBaseElementStyle.getPropertyValue("padding-top");
				const gridInternalComponentBaseElementPaddingBottom =
					gridInternalComponentBaseElementPaddingBottomRaw === ""
						? 0
						: parseFloat(gridInternalComponentBaseElementPaddingBottomRaw);
				const gridInternalComponentBaseElementHeight =
					maxHeight +
					gridInternalComponentBaseElementPaddingTop +
					gridInternalComponentBaseElementPaddingBottom;

				gridInternalComponentBaseElement.style.setProperty(
					"height",
					`${gridInternalComponentBaseElementHeight}px`
				);
				gridBaseElement.style.setProperty(
					"min-height",
					`${gridInternalComponentBaseElementHeight}px`
				);

				for (let col = 1; col <= separatorCnt; col++) {
					// console.log(
					// 	"[1]:",
					// 	Math.round(columnHeights[col - 1] + 2 * rowGapHeight)
					// );
					// console.log("[2] maxHeight:", Math.round(maxHeight));

					arrIsSeparatorNeededRef.current[col - 1] =
						Math.round(columnHeights[col - 1] + 2 * rowGapHeight) <
						Math.round(maxHeight)
							? true
							: false;
				}

				for (
					let separatorNumber = 1;
					separatorNumber <= separatorCnt;
					separatorNumber++
				) {
					(
						gridInternalComponentBaseElement.children[
							itemCnt + separatorNumber - 1
						] as HTMLElement
					).setAttribute(
						MasonryGridCustomAttributes.dataMasonryGridColumnNumber,
						separatorNumber.toString()
					);
				}

				// console.log(arrIsSeparatorNeededRef.current);
				rerender((prev) => (prev > 1000 ? 0 : prev + 1));
			}, [columnCnt, separatorCnt, rerender]);

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
