import {
	subscribeToQuery,
	type ChannelErrorData,
	type ConnectionStatus,
	type Options,
	type UnsubscribeFn
} from 'datocms-listen';
import { onMount } from 'svelte';
import { writable } from 'svelte/store';

export type SubscribeToQueryOptions<QueryResult, QueryVariables> = Omit<
	Options<QueryResult, QueryVariables>,
	'onStatusChange' | 'onUpdate' | 'onChannelError'
>;

export type EnabledQuerySubscriptionOptions<QueryResult, QueryVariables> = {
	/** Whether the subscription has to be performed or not */
	enabled?: true;
	/** The initial data to use while the initial request is being performed */
	initialData?: QueryResult;
} & SubscribeToQueryOptions<QueryResult, QueryVariables>;

export type DisabledQuerySubscriptionOptions<QueryResult, QueryVariables> = {
	/** Whether the subscription has to be performed or not */
	enabled: false;
	/** The initial data to use while the initial request is being performed */
	initialData?: QueryResult;
} & Partial<SubscribeToQueryOptions<QueryResult, QueryVariables>>;

export type QuerySubscriptionOptions<QueryResult, QueryVariables> =
	| EnabledQuerySubscriptionOptions<QueryResult, QueryVariables>
	| DisabledQuerySubscriptionOptions<QueryResult, QueryVariables>;

export type Subscription<QueryResult> = {
	error: ChannelErrorData | null;
	data: QueryResult | null;
	status: ConnectionStatus | null;
};

export function querySubscription<QueryResult = unknown, QueryVariables = unknown>(
	options: QuerySubscriptionOptions<QueryResult, QueryVariables>
) {
	const { enabled, initialData, ...other } = options;
	const subscribeToQueryOptions = other as EnabledQuerySubscriptionOptions<
		QueryResult,
		QueryVariables
	>;

	const { subscribe, update } = writable<Subscription<QueryResult>>({
		error: null,
		data: initialData || null,
		status: enabled ? 'connecting' : 'closed'
	});

	onMount(() => {
		if (enabled === false) {
			update((old) => ({ ...old, status: 'closed' }));
			return;
		}

		let unsubscribe: UnsubscribeFn | null;

		async function subscribe() {
			unsubscribe = await subscribeToQuery<QueryResult, QueryVariables>({
				...subscribeToQueryOptions,
				onStatusChange: (status) => {
					update((old) => ({ ...old, status }));
				},
				onUpdate: (updateData) => {
					update((old) => ({
						...old,
						error: null,
						data: updateData.response.data
					}));
				},
				onChannelError: (errorData) => {
					update((old) => ({ ...old, error: errorData, data: null }));
				}
			});
		}

		subscribe();

		return () => {
			if (unsubscribe) {
				unsubscribe();
			}
		};
	});

	return { subscribe };
}
