
import End from './End'


export default function drain (bud)
{
	return new Promise(rs =>
	{
		bud.on(value =>
		{
			if (value === End)
			{
				rs()
			}
		})
	})
}
