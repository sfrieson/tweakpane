import {ViewProps} from '../../../common/model/view-props';
import {ClassName} from '../../../common/view/class-name';
import {bindClassModifier} from '../../../common/view/reactive';
import {View} from '../../../common/view/view';

interface Config {
	contentsElement: HTMLElement;
	viewProps: ViewProps;
}

const className = ClassName('tab');

/**
 * @hidden
 */
export class TabView implements View {
	public readonly element: HTMLElement;
	public readonly itemsElement: HTMLElement;
	public readonly contentsElement: HTMLElement;

	constructor(doc: Document, config: Config) {
		this.element = doc.createElement('div');
		this.element.classList.add(className());
		bindClassModifier(config.viewProps, this.element);

		const itemsElem = doc.createElement('div');
		itemsElem.classList.add(className('i'));
		this.element.appendChild(itemsElem);
		this.itemsElement = itemsElem;

		const contentsElem = config.contentsElement;
		contentsElem.classList.add(className('c'));
		this.element.appendChild(contentsElem);
		this.contentsElement = contentsElem;
	}
}
