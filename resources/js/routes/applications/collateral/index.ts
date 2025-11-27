import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\ApplicationController::store
 * @see app/Http/Controllers/ApplicationController.php:90
 * @route '/applications/{application}/collateral'
 */
export const store = (args: { application: string | number | { id: string | number } } | [application: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/applications/{application}/collateral',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ApplicationController::store
 * @see app/Http/Controllers/ApplicationController.php:90
 * @route '/applications/{application}/collateral'
 */
store.url = (args: { application: string | number | { id: string | number } } | [application: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { application: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { application: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    application: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        application: typeof args.application === 'object'
                ? args.application.id
                : args.application,
                }

    return store.definition.url
            .replace('{application}', parsedArgs.application.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ApplicationController::store
 * @see app/Http/Controllers/ApplicationController.php:90
 * @route '/applications/{application}/collateral'
 */
store.post = (args: { application: string | number | { id: string | number } } | [application: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ApplicationController::store
 * @see app/Http/Controllers/ApplicationController.php:90
 * @route '/applications/{application}/collateral'
 */
    const storeForm = (args: { application: string | number | { id: string | number } } | [application: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ApplicationController::store
 * @see app/Http/Controllers/ApplicationController.php:90
 * @route '/applications/{application}/collateral'
 */
        storeForm.post = (args: { application: string | number | { id: string | number } } | [application: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
const collateral = {
    store: Object.assign(store, store),
}

export default collateral