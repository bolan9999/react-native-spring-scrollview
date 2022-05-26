/*
 * @Author: 石破天惊
 * @email: shanshang130@gmail.com
 * @Date: 2022-01-11 22:20:52
 * @LastEditTime: 2022-01-12 14:00:15
 * @LastEditors: 石破天惊
 * @Description:
 */

import * as React from "react";
import { ScrollView as GHScrollView } from "react-native-gesture-handler";
import { View, Text, StyleSheet, ScrollView, Animated } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

const AnimatedGHScrollView = Animated.createAnimatedComponent(GHScrollView);

export class CrossHeaderTabWithoutAnimated extends React.Component {
  scroll0;
  scroll1;

  state = {
    slectedIndex: 0,
    width: 0,
    height: 0,
    headerHeight: 0,
    x: new Animated.Value(0),
    y0: new Animated.Value(0),
    y1: new Animated.Value(0),
  };
  render() {
    return (
      <AnimatedGHScrollView
        horizontal
        pagingEnabled
        nestedScrollEnabled
        overScrollMode="never"
        scrollEventThrottle={1}
        style={{ flex: 1 }}
        contentContainerStyle={{ width: "200%" }}
        onMomentumScrollEnd={(e) => {
          const slectedIndex = Math.floor((e.nativeEvent.contentOffset.x * 2) / this.state.width);
          this.setState({ slectedIndex });
        }}
        onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: {
                  x: this.state.x,
                },
              },
            },
          ],
          { useNativeDriver: true },
        )}
      >
        <Animated.ScrollView
          ref={(ref) => (this.scroll1 = ref)}
          overScrollMode="never"
          scrollEnabled={this.state.slectedIndex === 1}
          pointerEvents={this.state.slectedIndex === 1 ? "auto" : "box-none"}
          onLayout={(e) =>
            this.setState({
              width: e.nativeEvent.layout.width,
              height: e.nativeEvent.layout.height,
            })
          }
          style={{ flex: 1, backgroundColor: undefined }}
          contentContainerStyle={{ flexGrow: 1, flexDirection: "row" }}
          onMomentumScrollEnd={(e) => {
            if (
              this.state.slectedIndex === 1 &&
              e.nativeEvent.contentOffset.y < this.state.headerHeight + 50
            ) {
              this.scroll0.scrollTo({
                x: 0,
                y: e.nativeEvent.contentOffset.y,
                animated: false,
              });
            }
          }}
          onScroll={Animated.event(
            [
              {
                nativeEvent: {
                  contentOffset: {
                    y: this.state.y1,
                  },
                },
              },
            ],
            {
              useNativeDriver: true,
              // listener: (e) => {
              //   if (
              //     this.state.slectedIndex === 1 &&
              //     e.nativeEvent.contentOffset.y < this.state.headerHeight + 50
              //   ) {
              //     this.scroll0.scrollTo({
              //       x: 0,
              //       y: e.nativeEvent.contentOffset.y,
              //       animated: false,
              //     });
              //   }
              // },
            },
          )}
        >
          <View style={{ flex: 1, marginTop: this.state.headerHeight + 50, marginLeft: "50%" }}>
            <TouchableOpacity>
              <Text>Second</Text>
            </TouchableOpacity>
            <Text>{content}</Text>
            <Text>{content}</Text>
          </View>

          <Animated.ScrollView
            ref={(ref) => (this.scroll0 = ref)}
            overScrollMode="never"
            scrollEnabled={this.state.slectedIndex === 0}
            pointerEvents={this.state.slectedIndex === 0 ? "auto" : "box-none"}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              height: this.state.height,
              transform: [{ translateY: this.state.y1 }],
            }}
            contentContainerStyle={{
              paddingRight: "50%",
              paddingTop: this.state.headerHeight + 50,
            }}
            onMomentumScrollEnd={(e) => {
              const offset = e.nativeEvent.contentOffset.y;
              if (this.state.slectedIndex === 0 && offset < this.state.headerHeight + 50) {
                this.scroll1.scrollTo({
                  x: 0,
                  y: offset,
                  animated: false,
                });
                console.log("scroll1", offset);
              }
            }}
            onScroll={Animated.event(
              [
                {
                  nativeEvent: {
                    contentOffset: {
                      y: this.state.y0,
                    },
                  },
                },
              ],
              {
                useNativeDriver: true,
                // listener: (e) => {
                //   if (
                //     this.state.slectedIndex === 0 &&
                //     e.nativeEvent.contentOffset.y < this.state.headerHeight + 50
                //   ) {
                //     this.scroll1.scrollTo({
                //       x: 0,
                //       y: e.nativeEvent.contentOffset.y,
                //       animated: false,
                //     });
                //   }
                // },
              },
            )}
          >
            <Text>
              First
              {content}
              {content}
            </Text>
            <AnimatedGHScrollView
              horizontal
              style={{
                backgroundColor: "red",
                position: "absolute",
                left: 0,
                width: "100%",
                top: 0,
                flexDirection: "column",
                transform: [{ translateX: this.state.x }],
              }}
              contentContainerStyle={{ flexDirection: "column", alignItems: "stretch" }}
            >
              <this.Header />
            </AnimatedGHScrollView>
            <Animated.View
              style={{
                position: "absolute",
                left: 0,
                width: "100%",
                top: this.state.headerHeight,
                flexDirection: "row",
                height: 50,
                alignItems: "center",
                backgroundColor: "#CCC",
                transform: [
                  { translateX: this.state.x },
                  {
                    translateY: this.state.y0.interpolate({
                      inputRange: [0, this.state.headerHeight, this.state.headerHeight + 1],
                      outputRange: [0, 0, 1],
                    }),
                  },
                ],
              }}
            >
              <Text style={{ flex: 1, textAlign: "center" }}>Tab1</Text>
              <Text style={{ flex: 1, textAlign: "center" }}>Tab2</Text>
              {/* <Text style={{ flex: 1, textAlign: "center" }}>Tab3</Text> */}
              <Animated.View
                style={{
                  position: "absolute",
                  left: 0,
                  bottom: 0,
                  height: 3,
                  width: "50%",
                  backgroundColor: "gray",
                  transform: [{ translateX: Animated.divide(this.state.x, 2) }],
                }}
              />
            </Animated.View>
          </Animated.ScrollView>
        </Animated.ScrollView>
      </AnimatedGHScrollView>
    );
  }

  Header = () => (
    <View
      style={styles.headContainer}
      onLayout={(e) => {
        this.setState({ headerHeight: e.nativeEvent.layout.height });
      }}
    >
      <Text>I am Header</Text>
      <GHScrollView
        horizontal
        pagingEnabled
        nestedScrollEnabled
        style={styles.bannerContainer}
        contentContainerStyle={{ width: "300%", flexDirection: "row" }}
      >
        <View style={styles.banner}>
          <TouchableOpacity>
            <Text>I am Banner1</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.banner}>
          <TouchableOpacity>
            <Text>I am Banner2</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.banner}>
          <TouchableOpacity>
            <Text>I am Banner3</Text>
          </TouchableOpacity>
        </View>
      </GHScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  headContainer: {
    padding: 25,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EEE",
  },
  bannerContainer: {
    flex: 0,
    width: 150,
    height: 100,
    backgroundColor: "lightgray",
  },
  banner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

const content =
  "\n\nIn React Native apps, the application code is executed outside of the " +
  "application main thread. \nThis is one of the key elements of React Native " +
  "architecture and helps with preventing frame drops in cases where JavaScript" +
  " has some heavy work to do. \nUnfortunately this design does not play well" +
  " when it comes to event driven interactions. \nWhen interacting with a touch" +
  " screen, the user expects effects on screen to be immediate. \nIf updates are" +
  " happening in a separate thread it is often a case that changes done in the" +
  " JavaScript thread cannot be reflected in the same frame. \nIn React Native by" +
  " default all updates are delayed by at least one frame as the communication" +
  " between UI and JavaScript thread is asynchronous and UI thread never waits" +
  " for the JavaScript thread to finish processing events. \nOn top of the lag" +
  " with JavaScript playing many roles like running react diffing and updates," +
  " executing app's business logic, processing network requests, etc., it is" +
  " often the case that events can't be immediately processed thus causing even" +
  " more significant delays. \nReanimated aims to provide ways of offloading" +
  " animation and event handling logic off of the JavaScript thread and onto" +
  " the UI thread. \nThis is achieved by defining Reanimated worklets – a tiny " +
  "chunks of JavaScript code that can be moved to a separate JavaScript VM and" +
  " executed synchronously on the UI thread. \nThis makes it possible to respond " +
  "to touch events immediately and update the UI within the same frame when the" +
  " event happens without worrying about the load that is put on the main " +
  "JavaScript thread.";
