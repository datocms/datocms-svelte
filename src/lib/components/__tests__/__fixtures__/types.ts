export type QuoteRecord = {
  id: string;
  __typename: 'QuoteRecord';
  quote: string;
  author: string;
};

export type DocPageRecord = {
  id: string;
  __typename: 'DocPageRecord';
  slug: string;
  title: string;
};