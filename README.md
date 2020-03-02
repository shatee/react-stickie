# react-stickie

React sticky component.  
and IE11 support!  
sticky + ie = stickie.

## Usage

```jsx
import { Sticky } from 'react-stickie';

// { position: sticky; top: 10px }
return (
  <Sticky top={10}>
    <div>sticky target</div>
  </Sticky>
);
```

## Properties

### top

* type: number | undefined
* optional (default: undefined)

Like top style of sticky position.  
Not string like '1px'.  
Specified either of top or bottom.

### bottom

* type : number | undefined
* optional (default: undefined)

Like bottom style of sticky position.  
Not string like '1px'.  
Specified either of top or bottom.

### onChange

* type: function
* optional (default: undefined)

Called at stick state changed.

### ignorePositionSticky

* type: boolean
* optional (default: false)

Specified false to disable sticky position.
It works the same as legacy browser.

## example

run command

```
npm run example
```

and access to http://localhost:8080/
