#inputBubbles

inputBubbles is a javascript plugin, that can help transfom text in text fields in small panels (bubbles). It is absolutely free, [open source](https://github.com/lutaev/inputBubbles) and distributed under the MIT license.

 This plugin is very simple and may be used native or as jQuery plugin. 

 
 
## Installing input-bubbles 

You can install this package locally either with `npm`, or `bower`. 

### npm

To install latest formal release 
```shell
npm install input-bubbles
```

To install latest release and update package.json
```shell
npm install input-bubbles --save-dev
```

### bower

To get the latest stable version, use bower from the command line.
```shell
bower install input-bubbles
```

To save the bower settings for future use:
```shell
bower install input-bubbles --save
```

Later, you can use easily update with:
```shell
bower update
```



## Usage

### Include all neccessary files
To get started you need 3 things in your page:
 1. A css file with styles for bubbles
 2. The javascript source file
 3. jQuery library (optional, if you want)
 
```html
<link type="text/css" rel="stylesheet" href="dist/css/input-bubbles.min.css">

<script src="//cdnjs.cloudflare.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
<script src="dist/js/input-bubbles.min.js"></script>
```



### Initialize container for bubbles (native)

#### Simple usage:

```html
<div id="bubbleWrapper"></div>

<script>
    var bubblesObj = inputBubbles(document.getElementById('bubbleWrapper'));
</script>
```

#### Initialize as jQuery plugin

```html
<div id="bubbleWrapper"></div>

<script>
    var bubbles = $('#bubbleWrapper').inputBubbles({
        width: 500,
        height: 50
    });
</script>
```



### Options

#### Setting options with native initialization
```javascript
     // Initialization
     var bubbles = inputBubbles({
         element: document.getElementById('bubbleWrapper'),   
         width: 500,
         height: 30
     });
     
     // Setting after initialization
     bubbles.set('allowSpaces', true);
 ```
 
#### As jQuery plugin
```javascript
    // Initialization
    $('#bubbleWrapper').inputBubbles({ 
        width: 500,
        height: 30
    });
      
    // Setting after initialization, with jQuery use method "set"
    $('#bubbleWrapper').inputBubbles('set', 'maxLength', 15);
```

#### Available options are:

 * `element` - Is necessary for native usage only. DOM-element, which will be transformed to container with bubbles and input field.
 * `width` - Width of container in pixels.
 * `height` - Minimum of height of container in pixels.
 * `bubbleTextWidth` - Maximum width of bubble's INNER text container. If this options is defined, too large text will be shown with three dots
 * `separator` - Array with symbols-delimeters. Once you type one of this symbols, next bubble will be created. For example: 
 
 ```javascript
     $('#bubbleWrapper').inputBubbles({
         separator: [',', ':']
     });
 ```
 
 * `allowSpaces` - This options allows typing whitespaces in bubbles without creating new bubble after each whitespace.
 * `allowEnter` - This options doesn't prevents default functionality of enter key and doesn't create new bubble after each enter key pressing.
 * `placeholder` - Adds placeholder to your container. 
 * `placeholderClass` - Custom class for placeholder.
 

#### Disable all actions

If you want to deny ALL actions with bubbles and save (freeze) current state, just add class 'bubbles-disabled' to main element.
 
 
### Methods

#### Calls method with native initialization
```javascript
     // Initialization
     var bubbles = inputBubbles({
         element: document.getElementById('bubbleWrapper'),
         click: function() {
            alert('click'!)
         }
     });
     
     // Calling after initialization
     bubbles.trigger('click');
 ```
 
#### As jQuery plugin
```javascript
    // Initialization
    $('#bubbleWrapper').inputBubbles({ 
        width: 500,
        height: 30
    });
      
    // Calling after initialization
    $('#bubbleWrapper').inputBubbles('trigger', 'click');
``` 
 
#### Available methods are:

 * `set` - This method sets an option after initialization.
 
 ```javascript
     $('#bubbleWrapper').inputBubbles('set', 'maxLength', 15);
 ```
 
 * `on` - Adds an event listener after initialization
 
 ```javascript
     $('#bubbleWrapper').inputBubbles('on', 'click', function(event) {
         console.log(event.currentTarget.innerText);   
     });
 ```
 
 * `trigger` - Triggers event, which was defined earlier
 
 ```javascript
     $('#bubbleWrapper').inputBubbles('trigger', 'click');
 ```
 
 * `addBubble` - Using this method, you can manually add new bubble. 
 
 ```javascript
      $('#bubbleWrapper').inputBubbles('addBubble', 'I am a bubble!');
 ```
 
 * `removeBubble` - Removes selected bubble. Parameter must be a DOM-element
 
 ```javascript
      $('#bubbleWrapper').inputBubbles('removeBubble', $('#someBubbleId')[0]);        
 ```  
 
 * `removeLastBubble` - Removes last bubble
 
 ```javascript
      $('#bubbleWrapper').inputBubbles('removeLastBubble');
 ```  
 
 * `clearAll` Removes all bubbles
 
 ```javascript
      $('#bubbleWrapper').inputBubbles('clearAll');
 ```
 
 * `values` Returns text content of all bubbles as array of strings
 
 ```javascript
      $('#bubbleWrapper').inputBubbles('values');
 ```
 
 * `nodes` Returns all bubbles as array of DOM-elements
 
 ```javascript
      $('#bubbleWrapper').inputBubbles('nodes');
 ```
 
 * `refreshData` Refreshes values and bubbles data (gets data from DOM)

 ```javascript
     $('#bubbleWrapper').inputBubbles('refreshData');
 ```



### Events

#### Adds an event listener with native initialization
```javascript
     // Initialization
     var bubbles = inputBubbles({
         element: document.getElementById('bubbleWrapper'),
         click: function() {
            alert('click'!)
         }
     });
     
     // After initialization
     bubbles.on('keyup', function(event) {
        console.log(event)
     });
 ```
 
#### As jQuery plugin
```javascript
    // Initialization
    $('#bubbleWrapper').inputBubbles({ 
        width: 500,
        height: 30,
        keyup: function(event) {
            console.log(event);    
        }
    });
      
    // After initialization
    $('#bubbleWrapper').inputBubbles('on', 'click', function(event) {
        console.log(event.currentTarget.innerText);   
    });
``` 

#### Availalble events are:

 * `add` - Fires adding new bubble.

 * `click` - Fires by mouse click on any bubble.
 
 * `keyup` - Fires after input some symbols in text field.
 
 * `remove` - Fires by removing any bubble.
 
 * `clear` - Fires by removing all bubbles (method clearAll).




