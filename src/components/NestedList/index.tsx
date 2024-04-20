import styled from "styled-components";

export const NestedListCssVars = {
	marginLeft: "--nested-list-margin-left",
	lineHeight: "--nested-list-line-height",
};

const NestedList = styled.ul`
	${NestedListCssVars.marginLeft}: 6px;
	${NestedListCssVars.lineHeight}: 1.2;

	margin-left: var(${NestedListCssVars.marginLeft}, 0);
`;

export const NestedListItem = styled.li`
	line-height: var(${NestedListCssVars.lineHeight}, normal);
`;

export default NestedList;
