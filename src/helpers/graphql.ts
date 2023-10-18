export class GraphQLClient {
	constructor(public readonly base_url: string) {}

	async query<T>(query: string, variables: Object = {}): Promise<T> {
		let req = {
			query,
			variables,
		};

		let resp = await fetch(this.base_url, {
			method: 'POST',
			body: JSON.stringify(req),
		});

		let resp_json = (await resp.json()) as { data: T; errors: any };

		if (resp_json.errors != null) {
			throw new Error(resp_json.errors);
		}

		return resp_json.data;
	}
}
