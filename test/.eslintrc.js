
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
	}
}
