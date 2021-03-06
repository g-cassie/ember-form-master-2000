import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import fmConfig from 'ember-form-master-2000/services/fm-config';
// import {initialize} from 'ember-form-master-2000/initializers/fm-initialize';
//
moduleForComponent('fm-form', 'Integration | Component | fm-form', {
  integration: true,
   setup: function() {
     this.register('service:fm-config', fmConfig);
     this.inject.service('fm-config', { as: 'config' });
//     this.container.inject = this.container.injection;
//     initialize(null, this.container);
   }
});
//
// test('renders properly', function(assert) {
//   this.render(hbs `{{#fm-form}}inside{{/fm-form}}`);
//   assert.ok(this.$('form').length > 0, 'The form element did not render');
//   assert.equal(this.$('form').text(), 'inside', 'The block did not yield the form content');
// });
//
// test('it uses allows classNames to be passed in', function(assert) {
//   this.set('classNames', ['ember-view', 'form-horizontal']);
//   this.render(hbs `{{#fm-form classNames=classNames}}{{/fm-form}}`);
//   assert.ok(this.$('form').hasClass('form-horizontal'), 'Has the form-horizontal class');
//   assert.ok(!this.$('form').hasClass('form-vertical'), 'Does not have the default form-vertical class');
// });

test('form shows errors on submit', function(assert) {
  this.set('config.showErrorsByDefault', false);
  this.set('errors', ['error message']);
  this.render(hbs `
    {{#fm-form}}
      {{fm-field errors=errors}}
    {{/fm-form}}
  `);
  assert.notOk(this.$('.form-group').hasClass('has-error'));
  this.$('form').submit();
  assert.ok(this.$('.form-group').hasClass('has-error'));
});
