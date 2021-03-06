import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
// import {initialize} from 'ember-form-master-2000/initializers/fm-initialize';
//
moduleForComponent('fm-radio-group', 'Integration | Component | fm-radio-group', {
  integration: true,
//   setup: function() {
//     this.container.inject = this.container.injection;
//     initialize(null, this.container);
//   }
});

// test('renders properly', function(assert) {
//   this.render(hbs `{{fm-radio-group}}`);
//   assert.ok(this.$('.form-group').length = 1, 'fm-radio-group has the form-group class');
// });
//
test('renders radio buttons for each content item provided', function(assert) {
  this.set('content', Ember.A([{label: 'label', value: 'value'}, {label: 'two', value: 'two'}]));
  this.render(hbs `{{fm-radio-group content=content optionLabelPath='label' optionValuePath='value'}}`);
  assert.equal(this.$('input').length, 2, 'It rendered two radio buttons');
  assert.equal(this.$('label').length, 2, 'It rendered two labels');
  assert.equal(this.$('label:first').text().trim(), 'label', 'Label text is set properly');
  assert.equal(this.$('input').attr('value'), 'value', 'Value is set propery');
});

test('checks the radio button which value property in content array matches value', function(assert) {
  this.set('value', 'foo');
  this.set('content', Ember.A([{label: 'label', value: 'value'}, {label: 'FOO', value: 'foo'}]));
  this.render(hbs `{{fm-radio-group value=value content=content optionLabelPath='label' optionValuePath='value'}}`);
  assert.notOk(this.$('input')[0].checked);
  assert.ok(this.$('input')[1].checked);
});

test('updates value if one radio button is clicked', function(assert) {
  this.set('value', null);
  this.set('content', Ember.A([{label: 'label', value: 'value'}, {label: 'two', value: 'two'}]));
  this.render(hbs `{{fm-radio-group value=value content=content optionLabelPath='label' optionValuePath='value'}}`);
  this.$('input')[0].click();
  assert.equal(this.get('value'), 'value');
});

test('Observes changes of content arrays label and value', function(assert) {
  this.set('content', Ember.A([{label: 'foo', value: 'foo'}]));
  this.render(hbs `{{fm-radio-group content=content optionLabelPath='label' optionValuePath='value'}}`);
  this.set('content.0.label', 'bar');
  assert.equal(this.$('label').text().trim(), 'bar');
  this.set('content.0.value', 'bar');
  assert.equal(this.$('input').attr('value'), 'bar');
});

test('Adds another option if an element is added to content array', function(assert) {
  assert.expect(3);
  this.set('content', Ember.A());
  this.render(hbs `{{fm-radio-group content=content optionLabelPath='label' optionValuePath='value'}}`);

  Ember.run.begin();
  Ember.run.schedule('sync', () => {
    this.get('content').pushObject({label: 'foo', value: 'foo'});
  });
  Ember.run.schedule('afterRender', () => {
    assert.equal(this.$('input').length, 1, 'Option is added');
    assert.equal(this.$('input').attr('value'), 'foo', 'Value of new option is correct');
    assert.equal(this.$('label').text().trim(), 'foo', 'Label of new option is correct');
  });
  Ember.run.end();
});

test('Option is removed if element is removed from content array', function(assert) {
  assert.expect(2);
  this.set('content', Ember.A([{label: 'foo', value: 'foo'}, {label: 'bar', value: 'bar'}]));
  this.render(hbs `{{fm-radio-group content=content optionLabelPath='label' optionValuePath='value'}}`);

  Ember.run.begin();
  Ember.run.schedule('sync', () => {
    this.get('content').removeAt(0);
  });
  Ember.run.schedule('afterRender', () => {
    assert.equal(this.$('input').length, 1, 'Option is removed');
    assert.equal(this.$('input').attr('value'), 'bar', 'Correct option is removed');
  });
  Ember.run.end();
});

test('errors are shown after user interaction but not before', function(assert) {
  this.set('errors', ['error message']);
  this.set('content', [{value: 'foo', label: 'foo'}]);
  this.render(hbs `{{fm-radio-group errors=errors content=content}}`);
  assert.ok(
    this.$('.help-block').length === 0,
    'error message is not shown before user interaction'
  );
  assert.notOk(
    this.$('div').hasClass('has-error'),
    'errorClass is not present before user interaction'
  );

  this.$('input').trigger('focusout');
  assert.equal(
    this.$('.help-block').text().trim(), 'error message',
    'error message is shown after user interaction'
  );
  assert.ok(
    this.$('div').hasClass('has-error'),
    'errorClass is present after user interaction'
  );
});