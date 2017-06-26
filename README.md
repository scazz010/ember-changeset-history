# ember-changeset-history [![Travis](https://travis-ci.org/scazz010/ember-changeset-history.svg?branch=master)](https://travis-ci.org/scazz010/ember-changeset-history) [![Code Climate](https://img.shields.io/codeclimate/github/scazz010/ember-changeset-history.svg)](https://codeclimate.com/github/scazz010/ember-changeset-history)

Check out the [live demo](https://ember-changeset-history-demo.pagefrontapp.com)

Extension of ember-changeset, providing undo/redo features. Also ships with a debounced-value helper for grouping changes together 

To install:

`ember install ember-changeset-history`

## Usage

Create a new changeset
```js
  // omitting maxHistoryLength option or setting to 0 keeps infinite history
  ChangesetHistory(model, validator, {}, { maxHistoryLength: 0 }); 
```

```js
import Ember from 'ember';
import ChangesetWithHistory from 'ember-changeset-history';

const { Component, computed } = Ember;
 
export default Component.extend({
  init() {
    this._super(...arguments);
    this.changeset = new ChangesetWithHistory(this.get('model'), () => true, {}, { maxHistoryLength: 100}); 
  },
  
  undoDisabled: computed.not('changeset.canUndo'),
  
  actions: {
    undo() {
      this.changeset.undo();
    }
  }
});
```

```hbs
<form>
  {{#debounced-value property=changeset.property as |debouncer|}}
    <input type="text" value=changeset.property oninput={{action debouncer value="target.value"}}>
  {{/debounced-value}}
  
  <button {{action "undo"}} disabled={{undoDisabled}}>Undo</button>
</form>
```

## API

### ChangesetHistory 
* Properties
  + [`canUndo`](#canundo)
  + [`canRedo`](#canredo)
* Methods
  + [`undo`](#undo)
  + [`redo`](#redo)
  + [`resetHistory`](#resethistory)
  
#### `canUndo`

Returns a Boolean - true if there is something that can be undone in the changeset

```js
get(changeset, 'canUndo'); // true
```
**[⬆️ back to top](#api)**

#### `canRedo`

Returns a Boolean - true if there is something that can be redone in the changeset

```js
get(changeset, 'canRedo'); // false
``` 
**[⬆️ back to top](#api)**

#### `undo`

Undoes the last change made to the changeset, if there is one available: 

```js
changeset.undo();
```

**[⬆️ back to top](#api)**

#### `redo`

Redoes the last change made to the changeset, if some changes have been undo: 

```js
changeset.redo();
```

**[⬆️ back to top](#api)**

#### `resetHistory`

Removes all stored history for a changeset. Can be useful if rolling back a changeset and you want to destroy previous history:

```js
changeset.resetHistory();
```

### debounced-helper
Yields an action which is debounced. 
 
* Properties
  + [`wait`](#wait)
  + [`property`](#property)
  + [`propertyPath`](#propertypath)
  + [`onChange`](#onchange)

#### `wait`

The time in milliseconds to debounce changes. The default is 400. 

#### `property`

The property to debounce changes to. Not required if you're updating the property yourselve via the onchange action
   
#### `propertyPath`

Will be send along with the new value to the onChange action, if one is provided

#### `onChange`

Action to fire after changes have been debounced. If this is not provided, the value will be mutated by debounced-value component directly. 

```hbs
{{#debounced-value
  propertyPath="changeset.description"
  onChange=(action "customSetter")
  as |debouncer|}}

    <input class="form-control" value={{changeset.description}} oninput={{action debouncer value="target.value"}}>

{{/debounced-value}}
```

```js
  actions: {
    customSetter(propertyPath, newValue) {
      this.set(propertyPath, newValue);
    }
  }
```
  

## Running Tests

* `npm test` (Runs `ember try:each` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).
