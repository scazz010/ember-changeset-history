import Ember from 'ember';
import { task, timeout } from 'ember-concurrency';

export default Ember.Component.extend({
  // Params
  onChange: null,
  property: null,
  propertyPath: null,
  wait: 400,

  setValue: task(function * (newValue) {
    yield timeout(this.get('wait'));

    let actionToPerform = this.get('onChange');

    if (actionToPerform) {
      actionToPerform(this.get('propertyPath'), newValue)
    } else {
      this.set('property', newValue);
    }
  }).restartable(),
});
