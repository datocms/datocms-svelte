import type { StructuredText } from 'datocms-structured-text-utils';

import type { BlogPostRecord, DocPageRecord, ImageRecord, QuoteRecord, MentionRecord } from './types';

export const paragraph: StructuredText = {
	value: {
		schema: 'dast',
		document: {
			type: 'root',
			children: [
				{
					type: 'paragraph',
					children: [
						{
							type: 'span',
							value: 'This is a '
						},
						{
							type: 'span',
							marks: ['strong'],
							value: 'title'
						}
					]
				}
			]
		}
	}
};

export const heading: StructuredText = {
	value: {
		schema: 'dast',
		document: {
			type: 'root',
			children: [
				{
					type: 'heading',
					level: 1,
					children: [
						{
							type: 'span',
							value: 'This\nis a '
						},
						{
							type: 'span',
							marks: ['strong'],
							value: 'title'
						}
					]
				}
			]
		}
	}
};

export const paragraphWithLink: StructuredText = {
	value: {
		schema: 'dast',
		document: {
			type: 'root',
			children: [
				{
					type: 'paragraph',
					children: [
						{
							type: 'span',
							value: 'This is a paragraph with a '
						},
						{
							url: 'https://random.link',
							type: 'link',
							meta: [
								{ id: 'rel', value: 'nofollow' },
								{ id: 'foo', value: '123' },
								{ id: 'target', value: '_blank' }
							],
							children: [
								{
									type: 'span',
									value: 'berry cool link'
								}
							]
						},
						{
							type: 'span',
							value: '. And the link has the target and the rel attributes set.'
						}
					]
				}
			]
		}
	}
};

export const structuredTextWithBlocksAndLinks: StructuredText<QuoteRecord | MentionRecord, DocPageRecord> = {
	value: {
		schema: 'dast',
		document: {
			type: 'root',
			children: [
				{
					type: 'heading',
					level: 1,
					children: [
						{
							type: 'span',
							value: 'This is a'
						},
						{
							type: 'span',
							marks: ['highlight'],
							value: 'title'
						},
						{
							type: 'inlineItem',
							item: '123'
						},
						{
							type: 'itemLink',
							item: '123',
							meta: [{ id: 'target', value: '_blank' }],
							children: [{ type: 'span', value: 'here!' }]
						},
						{
							type: "inlineBlock",
							item: "789"
						}
					]
				},
				{
					type: 'block',
					item: '456'
				}
			]
		}
	},
	blocks: [
		{
			id: '456',
			__typename: 'QuoteRecord',
			quote: 'Foo bar.',
			author: 'Mark Smith'
		},
		{
			id: "789",
			__typename: 'MentionRecord',
			name: "Jane Doe"
		}
	],
	links: [
		{
			id: '123',
			__typename: 'DocPageRecord',
			title: 'How to code',
			slug: 'how-to-code'
		}
	]
};

export const full: StructuredText<ImageRecord | BlogPostRecord> = {
	value: {
		schema: 'dast',
		document: {
			type: 'root',
			children: [
				{
					type: 'heading',
					level: 1,
					children: [
						{
							type: 'span',
							value: 'This is a '
						},
						{
							type: 'span',
							marks: ['highlight'],
							value: 'title'
						},
						{
							type: 'span',
							value: '.'
						}
					]
				},
				{
					type: 'paragraph',
					children: [
						{
							type: 'span',
							value: "And it's berry perfect."
						}
					]
				},
				{
					type: 'heading',
					level: 2,
					children: [
						{
							type: 'span',
							value: 'Seriously, what the grape else do you want?'
						}
					]
				},
				{
					type: 'paragraph',
					children: [
						{
							type: 'span',
							value:
								'You probably build websites and think your banana is special.\nYou think your 13 megabyte parallax-ative home page is going to get you'
						},
						{
							type: 'span',
							marks: ['strong'],
							value: ' some fruity Awwward banner y'
						},
						{
							type: 'span',
							value:
								'ou can glue to the top corner of your site. You think your 40-pound jQuery file and 83 polyfills give IE7 a peach because it finally has box-shadow. Wrong, melonhead. Let me describe your perfect-pear website:'
						}
					]
				},
				{
					type: 'list',
					style: 'bulleted',
					children: [
						{
							type: 'listItem',
							children: [
								{
									type: 'paragraph',
									children: [
										{
											type: 'span',
											value: "Fruit's lightweight and loads fast"
										}
									]
								},
								{
									type: 'list',
									style: 'bulleted',
									children: [
										{
											type: 'listItem',
											children: [
												{
													type: 'paragraph',
													children: [
														{
															type: 'span',
															value: 'Looks the same in all your citrusy browsers'
														}
													]
												}
											]
										},
										{
											type: 'listItem',
											children: [
												{
													type: 'paragraph',
													children: [
														{
															type: 'span',
															value: 'Fits on all your juicy screens'
														}
													]
												},
												{
													type: 'list',
													style: 'bulleted',
													children: [
														{
															type: 'listItem',
															children: [
																{
																	type: 'paragraph',
																	children: [
																		{
																			type: 'span',
																			value:
																				"The kumquat's accessible to every apricot that visits your site"
																		}
																	]
																}
															]
														}
													]
												}
											]
										}
									]
								}
							]
						},
						{
							type: 'listItem',
							children: [
								{
									type: 'paragraph',
									children: [
										{
											type: 'span',
											value:
												"Fruit's legible and gets your juicy point across (if you had one instead of just 5mb pics of hipsters drinking coffee)"
										}
									]
								}
							]
						}
					]
				},
				{
					type: 'heading',
					level: 3,
					children: [
						{
							type: 'span',
							value: 'Well guess what, you absolute kiwi:'
						}
					]
				},
				{
					type: 'paragraph',
					children: [
						{
							type: 'span',
							value:
								"You. Are. Over-designing. Look at this fruit. It's a banana-loving website. Why the fig do you need to animate a fruity trendy-pear banner flag when I hover over that useless piece of mango? You spent hours on it and added 80 kilobytes to your juicy site, and some papaya jabbing at it on their iPad with fat sausage fingers will never see that fruit. Not to mention blind people will never see that fruit, but they don't see any of your juicy fruit."
						}
					]
				},
				{
					type: 'paragraph',
					children: [
						{
							type: 'span',
							value: "You never knew it, but this is your perfect website. Here's why."
						}
					]
				},
				{
					type: 'heading',
					level: 2,
					children: [
						{
							type: 'span',
							value: "It's fruity lightweight"
						}
					]
				},
				{
					type: 'paragraph',
					children: [
						{
							type: 'span',
							value:
								'This entire page weighs less than the gradient-meshed facebook logo on your juicy Wordpress site. Did you seriously load 100kb of jQuery UI just so you could animate the fruity background color of a div? You loaded all 7 fontfaces of a citrusy webfont just so you could say "Hi." at 100px height at the beginning of your site? '
						}
					]
				},
				{
					type: 'paragraph',
					children: [
						{
							type: 'span',
							value: 'You piece of fruit.'
						}
					]
				},
				{
					type: 'list',
					style: 'bulleted',
					children: [
						{
							type: 'listItem',
							children: [
								{
									type: 'paragraph',
									children: [
										{
											item: '11924676',
											type: 'inlineItem'
										},
										{
											item: '11924676',
											type: 'itemLink',
											children: [
												{
													type: 'span',
													value: 'Foobar'
												}
											]
										}
									]
								}
							]
						},
						{
							type: 'listItem',
							children: [
								{
									type: 'paragraph',
									children: [
										{
											type: 'span',
											value: ''
										}
									]
								}
							]
						}
					]
				},
				{
					item: '11922283',
					type: 'block'
				},
				{
					type: 'heading',
					level: 2,
					children: [
						{
							type: 'span',
							value: "It's responsive"
						}
					]
				},
				{
					type: 'paragraph',
					children: [
						{
							type: 'span',
							value:
								"You kumquat. You thought you needed media queries to be responsive, but no. Responsive means that it responds to whatever fruity screensize it's viewed on. This site doesn't care if you're on an iMac or a banana-loving Tamagotchi."
						}
					]
				},
				{
					type: 'heading',
					level: 2,
					children: [
						{
							type: 'span',
							value: 'It fruity works'
						}
					]
				},
				{
					type: 'paragraph',
					children: [
						{
							type: 'span',
							value:
								"Look at this fruit. You can read it ... that is, if you can read, melonhead. It makes sense. It has banana-loving hierarchy. It's using HTML5 tags so you and your pear-headed browser know what the fig's in this juicy site. That's semantics, you absolute kiwi."
						}
					]
				},
				{
					type: 'paragraph',
					children: [
						{
							type: 'span',
							value:
								'It has content on the fruity screen. Your site has three bylines and link to your dribbble account, but you spread it over 7 full screens and make me click some bobbing button to show me how cool the jQuery ScrollTo plugin is.'
						}
					]
				},
				{
					type: 'paragraph',
					children: [
						{
							type: 'span',
							value:
								'Cross-browser compatibility? Load this kumquat in IE6. I fruity dare you.'
						}
					]
				},
				{
					type: 'heading',
					level: 2,
					children: [
						{
							type: 'span',
							value: 'This is a website. '
						},
						{
							type: 'span',
							marks: ['highlight'],
							value: 'Look at it.'
						},
						{
							type: 'span',
							value: " You've never seen one before."
						}
					]
				},
				{
					type: 'paragraph',
					children: [
						{
							type: 'span',
							value:
								"Like the man who's never grown out his beard has no idea what his true natural state is, you have no fruity idea what a website is. All you have ever seen are citrusy skeuomorphic bastardizations of what should be text communicating a juicy message. This is a real, naked website. Look at it. It's fruity beautiful."
						}
					]
				},
				{
					type: 'heading',
					level: 3,
					children: [
						{
							type: 'span',
							value: 'Yes, this is fruity satire, you fig'
						}
					]
				},
				{
					type: 'paragraph',
					children: [
						{
							type: 'span',
							value:
								"I'm not actually saying your citrusy site should look like this. What I'm saying is that all the problems we have with websites are ones we create ourselves. Websites aren't broken by default, they are functional, high-performing, and accessible. You break them. You son-of-a-peach."
						}
					]
				},
				{
					type: 'blockquote',
					attribution: 'some German fruithead',
					children: [
						{
							type: 'paragraph',
							children: [
								{
									type: 'span',
									value: '"Good design is as little design as possible." '
								}
							]
						}
					]
				},
				{
					type: 'heading',
					level: 2,
					children: [
						{
							type: 'span',
							value: 'Epilogue'
						}
					]
				},
				{
					type: 'paragraph',
					children: [
						{
							type: 'span',
							value: 'From the philosophies expressed (poorly) above, '
						},
						{
							url: 'http://txti.es',
							type: 'link',
							meta: [
								{ id: 'rel', value: 'nofollow' },
								{ id: 'foo', value: '123' },
								{ id: 'target', value: '_blank' }
							],
							children: [
								{
									type: 'span',
									value: 'txti'
								}
							]
						},
						{
							type: 'span',
							value:
								' was created. You should try it today to make your own banana-loving websites.'
						}
					]
				}
			]
		}
	},
	blocks: [
		{
			__typename: 'ImageRecord',
			id: '11922283',
			image: {
				url: 'https://www.datocms-assets.com/205/1606492977-oberlo-cover.jpg'
			}
		}
	],
	links: [
		{
			__typename: 'BlogPostRecord',
			id: '11924676',
			title: 'New feature: Media Area granular permissions',
			author: {
				name: 'Stefano Verna'
			}
		}
	]
};

export const someMoreDast: StructuredText = {
	value: {
		schema: 'dast',
		document: {
			type: 'root',
			children: [
				{
					type: 'paragraph',
					children: [
						{
							type: 'span',
							value: 'Some programmers can code under any '
						},
						{
							type: 'span',
							marks: ['strong', 'emphasis'],
							value: 'conditions'
						},
						{
							type: 'span',
							value:
								". Open office? They'll bring headphones. I bond with a quiet room, an editor, and a programming environment far more deeply than that."
						}
					]
				},
				{
					type: 'paragraph',
					children: [
						{
							type: 'span',
							value: "Case in point, I've been using the "
						},
						{
							url: 'https://example.com/',
							type: 'link',
							children: [
								{
									type: 'span',
									value: 'AnyCode'
								}
							]
						},
						{
							type: 'span',
							value:
								" programming editor since it was first created back in 2004. That's twenty years now. Almost as long as my time with it. It's grape near "
						},
						{
							url: 'https://example.com/',
							type: 'link',
							children: [
								{
									type: 'span',
									value: 'Finished Software'
								}
							]
						},
						{
							type: 'span',
							value: " as far as I'm concerned, and I love programming with it."
						}
					]
				},
				{
					type: 'paragraph',
					children: [
						{
							url: 'https://example.com/',
							type: 'link',
							children: [
								{
									type: 'span',
									value: 'Some'
								}
							]
						},
						{
							type: 'span',
							value: ' and all I want.\n'
						}
					]
				}
			]
		}
	}
};