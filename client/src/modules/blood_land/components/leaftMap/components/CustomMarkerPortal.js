import PropTypes from "prop-types";
import { createPortal } from "react-dom";
import { DivIcon, marker } from "leaflet";
import { MapLayer } from "react-leaflet";
import { difference } from "lodash";

class CustomMarkerPortal extends MapLayer {
	getChildContext() {
		return {
			popupContainer: this.leafletElement
		};
	}

	createLeafletElement(newProps) {
		const { map, position, ...props } = newProps;
		this.icon = new DivIcon(props);
		return marker(position, { icon: this.icon, ...props });
	}

	updateLeafletElement(fromProps, toProps) {
		if (toProps.position !== fromProps.position) {
			this.leafletElement.setLatLng(toProps.position);
		}
		if (toProps.zIndexOffset !== fromProps.zIndexOffset) {
			this.leafletElement.setZIndexOffset(toProps.zIndexOffset);
		}
		if (toProps.opacity !== fromProps.opacity) {
			this.leafletElement.setOpacity(toProps.opacity);
		}
		if (toProps.draggable !== fromProps.draggable) {
			if (toProps.draggable) {
				this.leafletElement.dragging.enable();
			} else {
				this.leafletElement.dragging.disable();
			}
		}
		if (toProps.className !== fromProps.className) {
			const fromClasses = fromProps.className.split(" ");
			const toClasses = toProps.className.split(" ");
			this.leafletElement._icon.classList.remove(
				...difference(fromClasses, toClasses)
			);
			this.leafletElement._icon.classList.add(
				...difference(toClasses, fromClasses)
			);
		}
	}

	componentWillMount() {
		//super.componentWillMount();
		this.leafletElement = this.createLeafletElement(this.props);
		this.leafletElement.on("add", () => this.forceUpdate());
	}

	componentDidUpdate(fromProps) {
		this.updateLeafletElement(fromProps, this.props);
	}

	render() {
		const container = this.leafletElement._icon;

		if (!container) {
			return null;
		}

		return createPortal(this.props.children, container);
	}
}

CustomMarkerPortal.propTypes = {
	opacity: PropTypes.number,
	zIndexOffset: PropTypes.number
};

CustomMarkerPortal.childContextTypes = {
	popupContainer: PropTypes.object
};

export default CustomMarkerPortal;