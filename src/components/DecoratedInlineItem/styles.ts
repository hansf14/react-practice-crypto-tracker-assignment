import styled, { css } from "styled-components";
import {
	DecoratedInlineItemBaseElementTypeValue,
	DecoratedInlineItemDecoratorProps,
	DecoratedInlineItemProps,
	DecoratedInlineItemDecoratorPropsDefault,
	DecoratedInlineItemInternalComponentProps,
} from "./types";

export const InlineItemDecoratorCss = css<DecoratedInlineItemDecoratorProps>`
	display: inline-flex;
	content: "";

	${({ customProps }) => css`
		${customProps?.shouldFloatDecorator ??
		DecoratedInlineItemDecoratorPropsDefault.shouldFloatDecorator
			? css`
					margin-right: ${customProps?.decoratorMarginRight ??
					DecoratedInlineItemDecoratorPropsDefault.decoratorMarginRight};
					vertical-align: middle;
					margin-bottom: calc(calc(calc(0.5lh + 0.5cap + 0.5em) / 3) - 0.5cap);
			  `
			: css`
					position: absolute;
					top: calc(calc(1lh - 1ex) / 2);
			  `}
	`}

	${({ customProps }) => css`
		width: ${customProps?.decoratorWidth ??
		DecoratedInlineItemDecoratorPropsDefault.decoratorWidth};
		max-width: ${customProps?.decoratorWidth ??
		DecoratedInlineItemDecoratorPropsDefault.decoratorWidth};
		min-width: ${customProps?.decoratorWidth ??
		DecoratedInlineItemDecoratorPropsDefault.decoratorWidth};
		height: ${customProps?.decoratorHeight ??
		DecoratedInlineItemDecoratorPropsDefault.decoratorHeight};
		max-height: ${customProps?.decoratorHeight ??
		DecoratedInlineItemDecoratorPropsDefault.decoratorHeight};
		min-height: ${customProps?.decoratorHeight ??
		DecoratedInlineItemDecoratorPropsDefault.decoratorHeight};

		// clip-path: circle();
		clip-path: ${customProps?.decoratorClipPath ??
		DecoratedInlineItemDecoratorPropsDefault.decoratorClipPath};

		// fixes subpixel-rendering when full height (1cap)
		// clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
	`}

	background-color: ${({ theme }) => theme.nestedListDecoratorColor ?? "#000"};
`;
// top: calc(
//   calc(calc(0.5lh + 0.5cap + 0.5em) / 3) -
//     calc(
//       ${customProps?.decoratorHeight ??
//         DecoratedInlineItemDecoratorPropsDefault.decoratorHeight} / 2
//     )
// );

export const DecoratedInlineItem = styled(
	DecoratedInlineItemBaseElementTypeValue
).withConfig({
	shouldForwardProp: (prop) => !["customProps"].includes(prop),
})<DecoratedInlineItemProps>`
	position: relative;
	display: inline;
	white-space: nowrap;
	// Makes inline/inline-block children items don't wrap

	// But do need to make its children's texts can be wrapped as default behavior.
	> * {
		white-space: initial;
	}

	&::before {
		${InlineItemDecoratorCss}
	}
`;

export const DecoratedInlineItemInternalComponent = styled.div.withConfig({
	shouldForwardProp: (prop) => !["customProps"].includes(prop),
})<DecoratedInlineItemInternalComponentProps>`
	display: inline;

	-webkit-box-decoration-break: clone;
	box-decoration-break: clone;

	${({ customProps }) =>
		customProps?.shouldFloatDecorator ??
		DecoratedInlineItemDecoratorPropsDefault.shouldFloatDecorator
			? ""
			: css`
					padding-left: calc(
						${customProps?.decoratorWidth ??
							DecoratedInlineItemDecoratorPropsDefault.decoratorWidth} +
							${customProps?.decoratorMarginRight ??
							DecoratedInlineItemDecoratorPropsDefault.decoratorMarginRight}
					);
			  `}
`;
