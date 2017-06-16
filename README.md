# ember-changeset-history [![Travis](https://travis-ci.org/scazz010/ember-changeset-history.svg?branch=master)](https://travis-ci.org/scazz010/ember-changeset-history) [![Code Climate](https://img.shields.io/codeclimate/github/scazz010/ember-changeset-history.svg)](https://codeclimate.com/github/scazz010/ember-changeset-history)

Extension of ember-changeset, providing undo/redo features. To install:

`ember install ember-changeset-history`

## Usage

```js
import Ember from 'ember';
import ChangesetWithHistory from 'ember-changeset-history';

const { Component, computed } = Ember;
 
export default Component.extend({
  init() {
    this._super(...arguments);
    this.changeset = new ChangesetWithHistory(this.get('model'));
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
  {{input type="checkbox" value=changeset.property}}
  
  <button {{action "undo"}} disabled={{undoDisabled}}>Undo</button>
</form>
```

## API

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

## Running Tests

* `npm test` (Runs `ember try:each` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).
