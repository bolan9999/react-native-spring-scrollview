//
//  STSpringScrollView.h
//  RNSpringScrollView
//
//  Created by 石破天 on 2019/1/21.
//  Copyright © 2019年 Facebook. All rights reserved.
//

#import <React/RCTScrollView.h>

NS_ASSUME_NONNULL_BEGIN

@interface RCTScrollView()

- (void)sendScrollEventWithName:(NSString *)eventName
                     scrollView:(UIScrollView *)scrollView
                       userData:(NSDictionary *)userData;

@end

@interface STSpringScrollView : RCTScrollView

-(void)endRefresh;
- (void)endLoading;

@end

NS_ASSUME_NONNULL_END
