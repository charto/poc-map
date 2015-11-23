export class BSearch {
	/** Similar to C bsearch, but extra callback to handle inexact match. */

	private static neighbor<Key, Member>(
		needle: Key,
		haystack: Member[],
		compare: (a: Key, b: Member) => number,
		handleInexact: (
			needle: Key,
			haystack: Member[],
			compare: (a: Key, b: Member) => number,
			mid: number,
			diff: number
		) => number
	) {
		var mid = 0;
		var first = 0;
		var last = haystack.length - 1;
		var diff: number;

		// Binary search.

		while(first <= last) {
			mid = (first + last) >> 1;
			diff = compare(needle, haystack[mid]);

			if(diff > 0) first = mid + 1;
			else if(diff < 0) last = mid - 1;
			else return(mid);
		}

		// No exact match was found.
		return(handleInexact(needle, haystack, compare, mid, diff));
	}

	private static exactHelper() {
		return(-1);
	}

	/** Find needle in haystack, similar to C bsearch. */

	static exact<Key, Member>(
		needle: Key,
		haystack: Member[],
		compare: (needle: Key, item: Member) => number
	) {
		return(BSearch.neighbor(needle, haystack, compare, BSearch.exactHelper));
	}

	private static closestHelper<Key, Member>(
		needle: Key,
		haystack: Member[],
		compare: (a: Key, b: Member) => number,
		mid: number,
		diff: number
	) {
		// Check if found element is too small and next element is closer.
		if(
			diff > 0 &&
			mid < haystack.length - 1 &&
			Math.abs(compare(needle, haystack[mid + 1])) < diff
		) return(mid + 1);

		// Check if found element is too large and previous element is closer.
		if(
			diff < 0 &&
			mid > 0 &&
			Math.abs(compare(needle, haystack[mid - 1])) < -diff
		) return(mid - 1);

		return(mid);
	}

	/** Find needle or its closest neighbor in haystack. Closeness is based on
	  * the magnitude of compare callback's return value. */

	static closest<Key, Member>(
		needle: Key,
		haystack: Member[],
		compare: (needle: Key, item: Member) => number
	) {
		return(BSearch.neighbor(needle, haystack, compare, BSearch.closestHelper));
	}

	private static atleastHelper<Key, Member>(
		needle: Key,
		haystack: Member[],
		compare: (a: Key, b: Member) => number,
		mid: number,
		diff: number
	) {
		if(diff <= 0) return(mid);

		if(mid < haystack.length - 1) return(mid + 1);

		return(-1);
	}

	/** Find needle in haystack, or the closest value larger than it. */

	static atleast<Key, Member>(
		needle: Key,
		haystack: Member[],
		compare: (needle: Key, item: Member) => number
	) {
		return(BSearch.neighbor(needle, haystack, compare, BSearch.atleastHelper));
	}

	private static uptoHelper<Key, Member>(
		needle: Key,
		haystack: Member[],
		compare: (a: Key, b: Member) => number,
		mid: number,
		diff: number
	) {
		if(diff >= 0) return(mid);

		if(mid > 0) return(mid - 1);

		return(-1);
	}

	/** Find needle in haystack, or the closest value smaller than it. */

	static upto<Key, Member>(
		needle: Key,
		haystack: Member[],
		compare: (needle: Key, item: Member) => number
	) {
		return(BSearch.neighbor(needle, haystack, compare, BSearch.uptoHelper));
	}
}
