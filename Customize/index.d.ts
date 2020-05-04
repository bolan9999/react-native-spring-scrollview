/**
 * Author: Shi(bolan0000@icloud.com)
 * Date: 2019/3/8
 * Copyright (c) 2018, AoTang, Inc.
 *
 * Description:
 */

declare module "react-native-spring-scrollview/Customize" {
    import { NormalHeader, NormalFooter,RefreshHeader,LoadingFooter } from "react-native-spring-scrollview";

    export class ChineseNormalHeader extends NormalHeader {}
    export class ChineseNormalFooter extends NormalFooter {}
    export class WithLastDateHeader extends NormalHeader {}
    export class ChineseWithLastDateHeader extends NormalHeader {}
    export class WithLastDateFooter extends NormalFooter {}
    export class ChineseWithLastDateFooter extends NormalFooter {}
    // export class CommonLottieHeader extends RefreshHeader {}
    // export class CommonLottieFooter extends LoadingFooter {}
}
