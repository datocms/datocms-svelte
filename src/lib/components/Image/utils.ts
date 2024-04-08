import type * as CSS from 'csstype';

export const isSsr = () => typeof window === 'undefined';

export const isIntersectionObserverAvailable = () =>
	isSsr() ? false : !!(window as any).IntersectionObserver;

export const universalBtoa = (str: string): string =>
	isSsr() ? Buffer.from(str.toString(), 'binary').toString('base64') : window.btoa(str);

type State = {
	priority: boolean;
	inView: boolean;
	loaded: boolean;
};

export const imageAddStrategy = ({ priority, inView, loaded }: State) => {
	if (priority) {
		return true;
	}

	if (isSsr()) {
		return false;
	}

	if (isIntersectionObserverAvailable()) {
		return inView || loaded;
	}

	return true;
};

export const imageShowStrategy = ({ priority, loaded }: State) => {
	if (priority) {
		return true;
	}

	if (isSsr()) {
		return false;
	}

	if (isIntersectionObserverAvailable()) {
		return loaded;
	}

	return true;
};

export const absolutePositioning: CSS.PropertiesHyphen = {
	position: 'absolute',
	left: '0px',
	top: '0px',
	width: '100%',
	height: '100%',
	'max-width': 'none',
	'max-height': 'none'
};
