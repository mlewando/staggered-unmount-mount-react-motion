import React from 'react';
import {TransitionMotion, spring} from 'react-motion';
import getStyles from './staggerAnimator';

export default({list}) => (
    <TransitionMotion willLeave={() => ({h: spring(0)})} willEnter={() => ({h: 0})} styles={prev => getStyles(prev, list, {
        start: {
            h: 0
        },
        end: {
            h: 18
        },
        force: 60
    })}>
        {interpolatedData => (
            <div>
                {interpolatedData.map(config => (
                    <div key={config.key} style={{
                        height: config.style.h,
                        overflow: 'hidden'
                    }}>
                        {config.data}
                    </div>
                ))}
            </div>
        )}
    </TransitionMotion>
);
