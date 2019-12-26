
module.exports =
{
	env:
	{
		mocha: true,
	},

	globals:
	{
		expect: true,
		spy: true,
		log: true,
	},

	rules:
	{
		'no-unused-expressions': 0,
		'max-statements': [ 1, 35 ],
		'node/no-missing-import': 0,
		'node/no-unsupported-features/es-syntax': 0,
	},
}
