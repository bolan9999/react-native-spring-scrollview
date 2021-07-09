//
//  STSpringScrollView.m
//  RNSpringScrollView
//
//  Created by 石破天 on 2019/1/21.
//  Copyright © 2019年 Facebook. All rights reserved.
//

#import "STSpringScrollView.h"
#import <React/RCTEventDispatcher.h>

@interface STSpringScrollView ()
@property(nonatomic, assign) float refreshHeaderHeight;
@property(nonatomic, assign) float loadingFooterHeight;
//@property(nonatomic, assign) UIEdgeInsets orgInsets;
@property(nonatomic, copy) NSString *refreshStatus;
@property(nonatomic, copy) NSString *loadingStatus;
@property(nonatomic, copy) NSDictionary *initialContentOffset;
@property(nonatomic, assign) BOOL allLoaded;
@property(nonatomic, assign) BOOL initialed;
@end

@implementation STSpringScrollView

- (instancetype)initWithEventDispatcher:(RCTEventDispatcher *)eventDispatcher{
    if (self=[super initWithEventDispatcher:eventDispatcher]) {
        self.refreshStatus = self.loadingStatus = @"waiting";
    }
    return self;
}

- (void)setInitialContentOffset:(NSDictionary *)initialContentOffset{
    _initialContentOffset = initialContentOffset;
    if (!self.initialed) {
        self.initialed = YES;
        [self.scrollView addObserver:self forKeyPath:@"contentSize" options:NSKeyValueObservingOptionNew context:nil];
    }
}

- (void)observeValueForKeyPath:(NSString *)keyPath ofObject:(id)object change:(NSDictionary<NSKeyValueChangeKey,id> *)change context:(void *)context{
    CGSize size = [change[NSKeyValueChangeNewKey] CGSizeValue];
    float x = [[self.initialContentOffset objectForKey:@"x"] floatValue];
    float y = [[self.initialContentOffset objectForKey:@"y"] floatValue];
    if ([keyPath isEqualToString:@"contentSize"] && size.width > x && size.height>y ) {
        [self.scrollView removeObserver:self forKeyPath:@"contentSize"];
        dispatch_async(dispatch_get_main_queue(), ^{
            [self.scrollView setContentOffset:CGPointMake(x, y)];
        });
    }
}

- (void)scrollViewDidEndDragging:(UIScrollView *)scrollView willDecelerate:(BOOL)decelerate{
    [super scrollViewDidEndDragging:scrollView willDecelerate:decelerate];
    if ([self shouldRefresh]) {
        self.refreshStatus = @"refreshing";
        [self.scrollView setContentInset:UIEdgeInsetsMake(self.refreshHeaderHeight, 0, 0, 0)];
    } else if ([self shouldLoad]) {
        self.loadingStatus = @"loading";
        CGFloat fill = .0f;
        if(self.scrollView.frame.size.height>self.scrollView.contentSize.height){
            fill=self.scrollView.frame.size.height-self.scrollView.contentSize.height;
        }
        [self.scrollView setContentInset:UIEdgeInsetsMake(0, 0, self.loadingFooterHeight+fill, 0)];
    }
    else if ([self hitRefreshStatus:@[@"rebound"]] && !UIEdgeInsetsEqualToEdgeInsets(UIEdgeInsetsZero, scrollView.contentInset)){
        [self.scrollView setContentOffset:CGPointMake(0, 0) animated:YES];
    }
}

- (void)scrollViewDidScroll:(UIScrollView *)scrollView {
    if ([self shouldPulling]) {
        self.refreshStatus = @"pulling";
    } else if ([self shouldPullingEnough]) {
        self.refreshStatus = @"pullingEnough";
    } else if ([self shouldPullingCancel]){
        self.refreshStatus = @"pullingCancel";
    } else if ([self shouldWaiting]){
        self.refreshStatus = @"waiting";
        scrollView.contentInset = UIEdgeInsetsZero;
    }
    if ([self shouldDragging]) {
        self.loadingStatus = @"dragging";
    } else if ([self shouldDraggingEnough]){
        self.loadingStatus = @"draggingEnough";
    } else if ([self shouldDraggingCancel]) {
        self.loadingStatus = @"draggingCancel";
    } else if ([self shouldFooterWaiting]) {
        self.loadingStatus = @"waiting";
        scrollView.contentInset = UIEdgeInsetsZero;
    }
    [super scrollViewDidScroll:scrollView];
}

- (void)endRefresh {
    if ([self hitRefreshStatus:@[@"refreshing"]]) {
        self.refreshStatus = @"rebound";
        [self.scrollView setContentOffset:CGPointMake(self.scrollView.contentOffset.x, 0) animated:YES];
    }
}

- (void)endLoading {
    if ([self hitLoadingStatus:@[@"loading"]]) {
        self.loadingStatus = @"rebound";
        [self.scrollView setContentOffset:CGPointMake(0, self.scrollView.contentSize.height-self.bounds.size.height) animated:YES];
    }
}

- (BOOL) shouldPulling{
    return self.refreshHeaderHeight>0 && [self hitRefreshStatus:@[@"waiting",@"pullingCancel"]] && [self overshootHead];
}

- (BOOL) shouldPullingEnough{
    return self.refreshHeaderHeight>0 && [self hitRefreshStatus:@[@"pulling"]] && [self overshootRefresh];
}

- (BOOL) shouldRefresh{
    return self.refreshHeaderHeight>0 && [self hitRefreshStatus:@[@"pullingEnough"]] && [self overshootRefresh];
}

- (BOOL) shouldPullingCancel{
    return self.refreshHeaderHeight>0 && [self hitRefreshStatus:@[@"pullingEnough"]] && [self overshootHead] && ![self overshootRefresh];
}

- (BOOL) shouldWaiting{
    return self.refreshHeaderHeight>0 && ([self hitRefreshStatus:@[@"rebound",@"pullingCancel"]]) && !UIEdgeInsetsEqualToEdgeInsets(UIEdgeInsetsZero, self.scrollView.contentInset) && self.scrollView.contentOffset.y >=0;
}

- (BOOL) shouldDragging{
    return self.loadingFooterHeight>0 && [self hitLoadingStatus:@[@"waiting",@"draggingCancel"]] && [self overshootFooter];
}

- (BOOL) shouldDraggingEnough{
    return self.loadingFooterHeight>0 && [self hitLoadingStatus:@[@"dragging"]] && [self overshootLoading];
}

- (BOOL) shouldLoad{
    return self.loadingFooterHeight>0 && [self hitLoadingStatus:@[@"draggingEnough"]] && [self overshootLoading];
}

- (BOOL) shouldDraggingCancel{
    return self.loadingFooterHeight>0 && [self hitLoadingStatus:@[@"draggingEnough"]] && [self overshootFooter] && ![self overshootLoading];
}

- (BOOL) shouldFooterWaiting{
    return self.loadingFooterHeight>0 && [self hitLoadingStatus:@[@"rebound",@"draggingCancel"]]&& ![self overshootFooter];
}

- (BOOL) overshootHead{
    return self.scrollView.contentOffset.y<0;
}

- (BOOL) overshootRefresh{
    return self.scrollView.contentOffset.y<-self.refreshHeaderHeight;
}

- (BOOL) overshootFooter{
    return self.scrollView.contentOffset.y>self.scrollView.contentSize.height-self.scrollView.bounds.size.height;
}

- (BOOL) overshootLoading{
    return self.scrollView.contentOffset.y>self.scrollView.contentSize.height-self.scrollView.bounds.size.height+self.loadingFooterHeight;
}

- (BOOL)hitRefreshStatus:(NSArray<NSString *>*) statues {
    if (!statues) {
        return NO;
    }
    for (NSString *statue in statues) {
        if ([self.refreshStatus isEqualToString:statue]) {
            return YES;
        }
    }
    return NO;
}

- (BOOL)hitLoadingStatus:(NSArray<NSString *>*) statues {
    if (!statues) {
        return NO;
    }
    for (NSString *statue in statues) {
        if ([self.loadingStatus isEqualToString:statue]) {
            return YES;
        }
    }
    return NO;
}

- (void)sendScrollEventWithName:(NSString *)eventName
                     scrollView:(UIScrollView *)scrollView
                       userData:(NSDictionary *)userData{
    NSMutableDictionary *data = [NSMutableDictionary dictionaryWithDictionary:userData];
    [data setObject:self.refreshStatus forKey:@"refreshStatus"];
    [data setObject:self.loadingStatus forKey:@"loadingStatus"];
    [super sendScrollEventWithName:eventName scrollView:scrollView userData:data];
}

- (void)scrollToOffset:(CGPoint)offset animated:(BOOL)animated{
    [super scrollToOffset:offset animated:animated];
    if (!animated) {
        [self sendScrollEventWithName:@"onScroll" scrollView:self.scrollView userData:@{}];
    }
}

- (void)setAllLoaded:(BOOL)allLoaded{
    self.loadingStatus = allLoaded?@"allLoaded":@"waiting";
    if (allLoaded && !UIEdgeInsetsEqualToEdgeInsets(UIEdgeInsetsZero, self.scrollView.contentInset)) {
        [self.scrollView setContentInset:UIEdgeInsetsZero];
    }
    [self sendScrollEventWithName:@"onScroll" scrollView:self.scrollView userData:@{}];
}

@end
