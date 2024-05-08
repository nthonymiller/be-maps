import axios from 'axios'
import type { Address } from './address-type';

const COUNTRY_CODE = 'AUS';

export function isNullOrEmpty(value: unknown): boolean {
	return value == null || (typeof value === 'string' && value.trim() === '');
}

export async function getAutoCompleteDetails(address: any): Promise<Address[]> {
	const apiKey = process.env.TOMTOM_API_KEY || '';

	// get autocomplete results
	return getPlaceAutocomplete(apiKey, address);
}

// https://developer.tomtom.com/search-api/documentation/search-service/fuzzy-search
export async function getPlaceAutocomplete(key: string, address: string): Promise<Address[]> {
	if (isNullOrEmpty(key)) {
		throw new Error('API key is required');
	}
	if (isNullOrEmpty(address)) {
		throw new Error('Address is required');
	}

	const encodedAddress = encodeURIComponent(address);

	try {
		const autocomplete = await axios.get(`https://api.tomtom.com/search/2/search/${encodedAddress}.json'`, {
			params: {
				key,
				limit: 100,
				countrySet: COUNTRY_CODE
			}
		});

		if (autocomplete.status !== 200) {
			throw new Error('Bad address request');
		}

		return autocomplete.data.results.map((result: any) => {
			return {
				placeId: result.id,
				streetNumber: result.address.streetNumber,
				countryCode: result.address.countryCode,
				country: result.address.country,
				freeformAddress: result.address.freeformAddress,
				municipality: result.address.municipality,
			}
		});
		
	} catch (error) {
		throw new Error('Failed to fetch results');
	}
}
