# react-motion TransitionMotion staggered unmount/mount animation example

## Instal and run
* Npm: `npm install`
* run: `npm start`
* in prowser enter `http://localhost:10080`

## How to test it
* Enter how much items should be removed and how much of them added to list
* hit `Generate new list button`
* watch the animation
  * app will remove random elements from list
  * after that new elements will be added at random positions

## Where magic id happening
All magic is in `app/AnimatedList.component.jsx` in `getStyls` function and in `app/arraysMerge.js`.
I calculate witch items are added and which should be removed from list in `merge` function.
Then preform staggered unmount animation for them, and after reaching some point I start mounting
animation for new items.
