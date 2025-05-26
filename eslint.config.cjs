
var outlander = require('outlander/typescript')
var globals = require('outlander/globals')


module.exports =
[
	...outlander,
	{
		languageOptions:
		{
			sourceType: 'module',
			globals:
			{
				...globals.node,
			}
		}
	},
	{
		rules:
		{
		},
	},
	{
		files: [ '**/*.js', '**/*.ts' ],
	},
	{
		ignores:
		[
			'release/',
			'examples/',
			'test/',
		],
	},
	{
		files: [ 'test/**/*.js' ],
		languageOptions:
		{
			globals:
			{
				...globals.mocha,
				...globals.chai,
				spy: true,
			}
		}
	}
]
