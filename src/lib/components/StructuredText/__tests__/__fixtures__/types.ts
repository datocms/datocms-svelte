export type QuoteRecord = {
	id: string;
	__typename: 'QuoteRecord';
	quote: string;
	author: string;
};

export type MentionRecord = {
	id: string;
	__typename: 'MentionRecord';
	name: string;
};

export type DocPageRecord = {
	id: string;
	__typename: 'DocPageRecord';
	slug: string;
	title: string;
};

export type ImageRecord = {
	id: string;
	__typename: 'ImageRecord';
	image: {
		url: string;
	};
};

export type BlogPostRecord = {
	id: string;
	__typename: 'BlogPostRecord';
	title: string;
	author: {
		name: string;
	};
};
