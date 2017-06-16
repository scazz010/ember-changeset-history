import Ember from 'ember';
import ChangesetHistory from 'ember-changeset-history';
import { module, test } from 'qunit';

const {
  get,
  Object: EmberObject,
  RSVP: {resolve}
} = Ember;

let dummyModel;
let changeset;

const defaultProperty = 'defaultProperty';
const newProperty = 'newProperty';
const defaultPropertyValue = 'I am a default value';
const firstStringValue = 'first value';
const secondStringValue = 'second value';

const initialState = {
  defaultProperty: defaultPropertyValue
};

module('Unit | Utility | changeset-history', {
  beforeEach() {
    dummyModel = EmberObject.extend(initialState, {
      save() {
        return resolve({});
      }
    }).create();

    changeset = new ChangesetHistory(dummyModel);
  }
});

test('#undo rolls back changes to predefined property', function(assert) {
  changeset.set(defaultProperty, firstStringValue);
  changeset.set(defaultProperty, secondStringValue);

  changeset.undo();
  assert.equal(get(changeset, defaultProperty), firstStringValue);
  changeset.undo();
  assert.equal(get(changeset, defaultProperty), defaultPropertyValue);
});

test('#history only updated when something changes', function(assert) {
  changeset.set(defaultProperty, firstStringValue);
  changeset.set(defaultProperty, firstStringValue);
  changeset.set(defaultProperty, firstStringValue);
  changeset.undo();
  assert.equal(get(changeset, defaultProperty), defaultPropertyValue);
});

test('#undo rolls back changes to new property', function(assert) {
  changeset.set(newProperty, firstStringValue);
  changeset.set(newProperty, secondStringValue);

  changeset.undo();
  assert.equal(get(changeset, newProperty), firstStringValue, '#undo can roll back changes to an attribute');
  changeset.undo();
  assert.equal(get(changeset, newProperty), undefined, '#undo can move back more than 1 place in history');
  changeset.undo();
  assert.equal(get(changeset, newProperty), undefined, '#undo doesn\'t try to move before time began');
});

test('#redo reapplies changes to a string', function(assert) {
  changeset.set(defaultProperty, firstStringValue);
  changeset.set(defaultProperty, secondStringValue);
  changeset.undo(); changeset.undo();

  changeset.redo();
  assert.equal(get(changeset, defaultProperty), firstStringValue);

  changeset.redo();
  assert.equal(get(changeset, defaultProperty), secondStringValue);

  changeset.redo();
  assert.equal(get(changeset, defaultProperty), secondStringValue);
});

test('#undo and #redo work with arrays', function(assert) {
  let firstValue = ['one value'];
  let secondValue = ['one value', 'two values'];
  let thirdValue = ['one value', 'two values', 'three values'];

  let arrayProperty = 'arrayProperty';
  changeset.set(arrayProperty, firstValue);
  changeset.set(arrayProperty, secondValue);
  changeset.set(arrayProperty, thirdValue);

  assert.equal(get(changeset, arrayProperty), thirdValue);
  changeset.undo();
  assert.equal(get(changeset, arrayProperty), secondValue);
  changeset.undo();
  assert.equal(get(changeset, arrayProperty), firstValue);
  changeset.undo();
  assert.equal(get(changeset, arrayProperty), undefined);
  changeset.undo();
  assert.equal(get(changeset, arrayProperty), undefined);
  changeset.redo();
  assert.equal(get(changeset, arrayProperty), firstValue);
  changeset.redo();
  assert.equal(get(changeset, arrayProperty), secondValue);
  changeset.redo();
  assert.equal(get(changeset, arrayProperty), thirdValue);
  changeset.redo();
  assert.equal(get(changeset, arrayProperty), thirdValue);
});

test('#redo forgets the future after a change', function(assert) {
  changeset.set(defaultProperty, firstStringValue);
  changeset.undo();

  changeset.set(defaultProperty, secondStringValue);

  changeset.redo();
  assert.equal(get(changeset, defaultProperty), secondStringValue);
});

test('#undo remembers history after a save', function(assert) {
  changeset.set(defaultProperty, firstStringValue);
  changeset.set(defaultProperty, secondStringValue);
  changeset.save().then(() => {
    changeset.undo();
    assert.equal(get(changeset, defaultProperty), firstStringValue);
  });
});

test('#undo resets history after merge (since a new changeset is created, it shouldn\'t have history)', function(assert) {
  let changesetToMerge = new ChangesetHistory(dummyModel);

  changeset.set(defaultProperty, firstStringValue);
  changesetToMerge.set(defaultProperty, secondStringValue);

  let newChangeset = changeset.merge(changesetToMerge);
  newChangeset.undo();

  assert.equal(get(newChangeset, defaultProperty), secondStringValue);
});

test('#undo remembers history after a rollback', function(assert) {
  changeset.set(defaultProperty, firstStringValue);
  changeset.rollback();
  changeset.undo();
  assert.equal(get(changeset, defaultProperty), firstStringValue);

});

test('snapshot/restore also saves and removes history', function(assert) {
  changeset.set(defaultProperty, firstStringValue);
  changeset.set(defaultProperty, secondStringValue);

  let snapshot = changeset.snapshot();
  changeset.set(defaultProperty, 'a random string');

  changeset.restore(snapshot);
  changeset.undo();
  assert.equal(get(changeset, defaultProperty), firstStringValue);
});

test('#undo is observable', function(assert) {
  assert.expect(1);

  changeset.set(defaultProperty, 'a new random string');

  changeset.addObserver(defaultProperty, function() {
    assert.equal(changeset.get(defaultProperty), defaultPropertyValue);
  });

  changeset.undo();
});

test('#redo is observable', function(assert) {
  assert.expect(1);

  changeset.set(defaultProperty, firstStringValue);
  changeset.undo();

  changeset.addObserver(defaultProperty, function() {
    assert.equal(changeset.get(defaultProperty), firstStringValue);
  });

  changeset.redo();
});

test('#resetHistory removes past and future state', function(assert) {
  changeset.set(defaultProperty, firstStringValue);
  changeset.resetHistory();
  changeset.undo();
  assert.equal(changeset.get(defaultProperty), firstStringValue);
});
