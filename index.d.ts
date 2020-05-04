/**
 * Author: Shi(bolan0000@icloud.com)
 * Date: 2018/7/26
 * Copyright (c) 2018, AoTang, Inc.
 *
 * Description:
 */

declare module "react-native-spring-scrollview" {
  import { Animated, ViewProps, ViewStyle } from "react-native";
  import * as React from "react";

  export interface Offset {
    x: number;
    y: number;
  }

  export interface Size {
    width:number;
    height:number;
  }

  export interface NativeContentOffset {
    x?: Animated.Value;
    y?: Animated.Value;
  }

  export type RefreshStyle = "topping" | "stickyScrollView" | "stickyContent";

  export type LoadingStyle = "bottoming" | "stickyScrollView" | "stickyContent";

  export interface ScrollEvent {
    nativeEvent: {
      contentOffset: {
        x: number;
        y: number;
      };
    };
  }

  export type HeaderStatus =
    | "waiting"
    | "pulling"
    | "pullingEnough"
    | "pullingCancel"
    | "refreshing"
    | "rebound";

  export interface RefreshHeaderPropType {
    maxHeight: number;
    offset: Animated.Value;
  }
  export interface RefreshHeaderStateType {
    status: HeaderStatus;
  }
  export class RefreshHeader extends React.Component<
    RefreshHeaderPropType,
    RefreshHeaderStateType
  > {}

  export class NormalHeader extends RefreshHeader {}

  export type FooterStatus =
    | "waiting"
    | "dragging"
    | "draggingEnough"
    | "draggingCancel"
    | "releaseRebound"
    | "loading"
    | "rebound"
    | "allLoaded";

  export interface LoadingFooterPropType {
    maxHeight: number;
    offset: Animated.Value;
    bottomOffset: number;
  }

  export interface LoadingFooterStateType {
    status: FooterStatus;
  }

  export class LoadingFooter extends React.Component<
    LoadingFooterPropType,
    LoadingFooterStateType
  > {}

  export class NormalFooter extends LoadingFooter {}

  export interface SpringScrollViewPropType extends ViewProps {
    contentStyle?: ViewStyle;
    bounces?: boolean;
    scrollEnabled?: boolean;
    directionalLockEnabled?: boolean;
    initialContentOffset?: Offset;
    showsVerticalScrollIndicator?: boolean;
    showsHorizontalScrollIndicator?: boolean;
    refreshHeader?: React.ComponentClass<RefreshHeaderPropType, RefreshHeaderStateType>;
    loadingFooter?: React.ComponentClass<LoadingFooterPropType, LoadingFooterStateType>;
    onRefresh?: () => any;
    onLoading?: () => any;
    allLoaded?: boolean;
    textInputRefs?: any[];
    inputToolBarHeight?: number;
    tapToHideKeyboard?: boolean;
    onTouchBegin?: () => any;
    onTouchEnd?: () => any;
    inverted?: boolean;
    onMomentumScrollBegin?: () => any;
    onMomentumScrollEnd?: () => any;
    onScroll?: (evt: ScrollEvent) => any;
    onNativeContentOffsetExtract?: NativeContentOffset;
    onSizeChange?: (size:Size) => any;
    onContentSizeChange?: (size: Size) => any;
  }
  export class SpringScrollView extends React.PureComponent<SpringScrollViewPropType> {
    scrollTo(offset: Offset, animated?: boolean): Promise<void>;
    scroll(offset: Offset, animated?: boolean): Promise<void>;
    scrollToBegin(animated?: boolean): Promise<void>;
    scrollToEnd(animated?: boolean): Promise<void>;
    endRefresh(): void;
    endLoading(): void;
  }
}
