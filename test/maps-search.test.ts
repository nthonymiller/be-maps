import { config } from 'dotenv'
import { describe } from '@jest/globals'
import { getPlaceAutocomplete, isNullOrEmpty } from '../src/maps-api'
import { getAutoCompleteDetails } from '../src'

config();

// These are end-to-end tests and need an api key
describe('Tomtom Places E2E Tests', () => {
	describe('getAutoCompleteDetails', () => {
		it('returns a promise', () => {
			const res = getAutoCompleteDetails('Charlotte Street')
			expect(res).toBeInstanceOf(Promise)
		});

		it('can fetch from the autocomplete api', async () => {
			const res = await getAutoCompleteDetails('Charlotte Street')
			const firstRes = res[0];
			expect(firstRes).toHaveProperty('placeId')
			expect(firstRes).toHaveProperty('streetNumber')
			expect(firstRes).toHaveProperty('countryCode')
			expect(firstRes).toHaveProperty('country')
			expect(firstRes).toHaveProperty('freeformAddress')
			expect(firstRes).toHaveProperty('municipality')
		});
	});

	describe('getPlaceAutocomplete', () => {
		
		it('handles no results', async () => {
			const res = await getPlaceAutocomplete(process.env.TOMTOM_API_KEY, 'asfasffasfasafsafs');
			expect(res).toStrictEqual([]);
		});

		it('empty address should throw an error', async () => {
			expect(getPlaceAutocomplete(process.env.TOMTOM_API_KEY, '')).rejects.toThrow('Address is required');
		});

		it('invalid API key should throw an error', async () => {
			expect(getPlaceAutocomplete('abcdedf', 'Charlotte Street')).rejects.toThrow('Failed to fetch results');
		});
		
		it('empty api key should throw an error', async () => {
			expect(getPlaceAutocomplete('', 'Charlotte Street')).rejects.toThrow('API key is required');
		});
	});

});

describe('isNullOrEmpty', () => {
	it('returns true for null', () => {
		expect(isNullOrEmpty(null)).toBe(true);
	});

	it('returns true for undefined', () => {
		expect(isNullOrEmpty(undefined)).toBe(true);
	});

	it('returns true for empty string', () => {
		expect(isNullOrEmpty('')).toBe(true);
	});

	it('returns true for whitespace string', () => {
		expect(isNullOrEmpty('   ')).toBe(true);
	});

	it('returns false for non-empty string', () => {
		expect(isNullOrEmpty('a')).toBe(false);
	});

	it('returns false for long non-empty string', () => {
		expect(isNullOrEmpty('abcdefg')).toBe(false);
	});
});
