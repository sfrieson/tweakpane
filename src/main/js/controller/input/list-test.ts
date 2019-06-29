import {assert} from 'chai';
import {describe, it} from 'mocha';

import ListConstraint from '../../constraint/list';
import * as NumberConverter from '../../converter/number';
import TestUtil from '../../misc/test-util';
import InputValue from '../../model/input-value';
import ListInputController from './list';

describe(ListInputController.name, () => {
	it('should get value', () => {
		const value = new InputValue(
			0,
			new ListConstraint({
				options: [
					{text: 'foo', value: 12},
					{text: 'bar', value: 34},
					{text: 'baz', value: 56},
				],
			}),
		);
		const doc = TestUtil.createWindow().document;
		const c = new ListInputController(doc, {
			stringifyValue: NumberConverter.toString,
			value: value,
		});

		assert.strictEqual(c.value, value);
	});

	it('should apply input to value', () => {
		const value = new InputValue(
			0,
			new ListConstraint({
				options: [
					{text: 'foo', value: 12},
					{text: 'bar', value: 34},
					{text: 'baz', value: 56},
				],
			}),
		);
		const win = TestUtil.createWindow();
		const doc = win.document;
		const c = new ListInputController(doc, {
			stringifyValue: NumberConverter.toString,
			value: value,
		});

		c.view.selectElement.value = '34';
		c.view.selectElement.dispatchEvent(new (win as any).Event('change'));

		assert.strictEqual(c.value.rawValue, 34);
	});

	it('should dispose', () => {
		const value = new InputValue(
			0,
			new ListConstraint({
				options: [
					{text: 'foo', value: 12},
					{text: 'bar', value: 34},
					{text: 'baz', value: 56},
				],
			}),
		);
		const doc = TestUtil.createWindow().document;
		const c = new ListInputController(doc, {
			stringifyValue: NumberConverter.toString,
			value: value,
		});
		c.dispose();
		assert.strictEqual(c.view.disposed, true);
	});
});
