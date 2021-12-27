
import { Nothing } from './Nothing'

export type Many <T> = T[] & { readonly many: unique symbol }

declare const Many:
{
	<T> (...args: (T | Nothing)[]): Many<T>,
	last <T> (value: T | Many<T>): T,
	is (it: any): it is Many<any>,
}

export default Many
