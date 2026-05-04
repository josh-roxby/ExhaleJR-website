// Atomic primitives — see styles/DESIGN-SYSTEM.md for the spec.
// Each component carries its §6 ID in a comment at the top of its file.

export { Button } from "./button";
export type { ButtonProps, ButtonVariant } from "./button";

export { IconButton } from "./icon-button";
export type { IconButtonProps } from "./icon-button";

export { Eyebrow } from "./eyebrow";
export type { EyebrowProps } from "./eyebrow";

export { Chip } from "./chip";
export type { ChipVariant } from "./chip";

export { Tag } from "./tag";
export type { TagProps, TagVariant } from "./tag";

export { Pill } from "./pill";
export type { PillProps } from "./pill";

export { Badge } from "./badge";
export type { BadgeProps } from "./badge";

export { Card } from "./card";
export type { CardHover } from "./card";

export { StatCard } from "./stat-card";
export type { StatCardProps } from "./stat-card";

export { Sparkline } from "./sparkline";
export type { SparklineProps } from "./sparkline";

export { NavItem } from "./nav-item";
export type { NavItemProps } from "./nav-item";

export { FloatNav } from "./float-nav";
export type { FloatNavProps } from "./float-nav";

export { ActionMenuCell, AccountMenuCell } from "./menu-cell";
export type { ActionMenuCellProps, AccountMenuCellProps } from "./menu-cell";

export { MenuListCell, MenuListItem } from "./menu-list";
export type { MenuListCellProps, MenuListItemProps } from "./menu-list";

export { MenuPopover, PopoverBackdrop } from "./menu-popover";
export type { MenuPopoverProps } from "./menu-popover";

export { AppNav } from "./app-nav";
export { NavProvider, useNavSlot } from "./nav-context";
export { NavSecondary } from "./nav-secondary";
