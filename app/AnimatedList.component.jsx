import React from "react";
import {TransitionMotion, spring} from "react-motion";
import getStyles from "./staggerAnimator";

export default({list}) => (
    <TransitionMotion willLeave={() => ({h: spring(0), w: spring(0)})}
                      willEnter={() => ({h: 0, w: 0})}
                      styles={prev => getStyles(
                          list,
                          {
                              start: {
                                  h: 0, w: 2
                              },
                              end: {
                                  h: 18, w: 100
                              },
                              force: 60
                          },
                          prev)}>
        {interpolatedData => (
            <div>
                {interpolatedData.map(config => (
                    <div key={config.key}
                         style={{
                             height: config.style.h,
                             width: config.style.w,
                             overflow: 'hidden',
                             whiteSpace: 'nowrap'
                         }}>
                        {config.data}
                    </div>
                ))}
            </div>
        )}
    </TransitionMotion>
);
