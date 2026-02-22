
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	export interface AppTypes {
		RouteId(): "/" | "/api" | "/api/goals" | "/api/goals/[id]" | "/api/goals/[id]/artifacts" | "/api/goals/[id]/metrics" | "/api/goals/[id]/outcomes" | "/api/goals/[id]/updates" | "/api/report" | "/goals" | "/goals/[id]" | "/portfolio";
		RouteParams(): {
			"/api/goals/[id]": { id: string };
			"/api/goals/[id]/artifacts": { id: string };
			"/api/goals/[id]/metrics": { id: string };
			"/api/goals/[id]/outcomes": { id: string };
			"/api/goals/[id]/updates": { id: string };
			"/goals/[id]": { id: string }
		};
		LayoutParams(): {
			"/": { id?: string };
			"/api": { id?: string };
			"/api/goals": { id?: string };
			"/api/goals/[id]": { id: string };
			"/api/goals/[id]/artifacts": { id: string };
			"/api/goals/[id]/metrics": { id: string };
			"/api/goals/[id]/outcomes": { id: string };
			"/api/goals/[id]/updates": { id: string };
			"/api/report": Record<string, never>;
			"/goals": { id?: string };
			"/goals/[id]": { id: string };
			"/portfolio": Record<string, never>
		};
		Pathname(): "/" | "/api/goals" | `/api/goals/${string}` & {} | `/api/goals/${string}/artifacts` & {} | `/api/goals/${string}/metrics` & {} | `/api/goals/${string}/outcomes` & {} | `/api/goals/${string}/updates` & {} | "/api/report" | `/goals/${string}` & {} | "/portfolio";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): string & {};
	}
}