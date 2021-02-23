import {InputParams} from '../../../api/types';
import {
	CompositeConstraint,
	findConstraint,
} from '../../common/constraint/composite';
import {Constraint} from '../../common/constraint/constraint';
import {ListConstraint} from '../../common/constraint/list';
import {Value} from '../../common/model/value';
import {stringFromUnknown} from '../../common/reader/string';
import {StringFormatter} from '../../common/writer/string';
import {InputBindingPlugin} from '../../input-binding';
import {findListItems, normalizeInputParamsOptions} from '../../util';
import {ListController} from '../common/controller/list';
import {TextController} from '../common/controller/text';

function createConstraint(params: InputParams): Constraint<string> {
	const constraints: Constraint<string>[] = [];

	if ('options' in params && params.options !== undefined) {
		constraints.push(
			new ListConstraint({
				options: normalizeInputParamsOptions(params.options, stringFromUnknown),
			}),
		);
	}

	return new CompositeConstraint({
		constraints: constraints,
	});
}

function createController(doc: Document, value: Value<string>) {
	const c = value.constraint;

	if (c && findConstraint(c, ListConstraint)) {
		return new ListController(doc, {
			listItems: findListItems(c) ?? [],
			stringifyValue: (v) => v,
			value: value,
		});
	}

	return new TextController(doc, {
		formatter: new StringFormatter(),
		parser: (v) => v,
		value: value,
	});
}

/**
 * @hidden
 */
export const StringInputPlugin: InputBindingPlugin<string, string> = {
	id: 'input-string',
	binding: {
		accept: (value, _params) => (typeof value === 'string' ? value : null),
		constraint: (args) => createConstraint(args.params),
		reader: (_args) => stringFromUnknown,
		writer: (_args) => (v: string) => v,
	},
	controller: (params) => {
		return createController(params.document, params.binding.value);
	},
};
