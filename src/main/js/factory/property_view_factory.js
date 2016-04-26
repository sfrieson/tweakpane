const Errors          = require('../misc/errors');
const PropertyBuilder = require('../misc/property_builder');
const Control         = require('../view/control/control');
const PropertyView    = require('../view/property_view');

class PropertyViewFactory {
	static supports(value) {
		throw Errors.notImplemented('supports');
	}

	static create(target, propName, forMonitor, opt_options) {
		const options = (opt_options !== undefined) ?
			opt_options :
			{};
		const model = this.createModel_(forMonitor, options);
		const prop = this.createProperty_(target, propName, model, options);
		prop.applySourceValue();

		const propView = new PropertyView(prop);

		if (forMonitor) {
			const monitor = this.createMonitor_(prop, options);
			monitor.start(options.interval);
			propView.addSubview(monitor);
		}
		else {
			const control = this.createControl_(model, options);
			control.getEmitter().on(
				Control.EVENT_CHANGE,
				(value) => {
					prop.setValue(value);
					prop.updateSourceValue();
				}
			);
			propView.addSubview(control);
		}

		return propView;
	}

	static createProperty_(target, propName, model, options) {
		const builder = new PropertyBuilder(target, propName, model);
		if (options.id !== undefined) {
			builder.setId(options.id);
		}
		if (options.label !== undefined) {
			builder.setLabel(options.label);
		}
		return builder.build();
	}

	static createControl_(model, options) {
		throw Errors.notImplemented('createControl_');
	}

	static createMonitor_(property, options) {
		throw Errors.notImplemented('createMonitor_');
	}

	static instanciateModel_(forMonitor, options) {
		throw Errors.notImplemented('instanciateModel_');
	}

	static createModel_(forMonitor, options) {
		const model = this.instanciateModel_(forMonitor, options);

		Object.keys(this.CONSTRAINT_FACTORIES).forEach((key) => {
			const value = options[key];
			if (value === undefined) {
				return;
			}

			const constraint = this.CONSTRAINT_FACTORIES[key](value);
			model.addConstraint(constraint);
		});

		return model;
	}
}

module.exports = PropertyViewFactory
