import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\ApplicationController::store
 * @see app/Http/Controllers/ApplicationController.php:118
 * @route '/applications/{application}/loan-details'
 */
export const store = (args: { application: string | number } | [application: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/applications/{application}/loan-details',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ApplicationController::store
 * @see app/Http/Controllers/ApplicationController.php:118
 * @route '/applications/{application}/loan-details'
 */
store.url = (args: { application: string | number } | [application: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { application: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    application: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        application: args.application,
                }

    return store.definition.url
            .replace('{application}', parsedArgs.application.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ApplicationController::store
 * @see app/Http/Controllers/ApplicationController.php:118
 * @route '/applications/{application}/loan-details'
 */
store.post = (args: { application: string | number } | [application: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ApplicationController::store
 * @see app/Http/Controllers/ApplicationController.php:118
 * @route '/applications/{application}/loan-details'
 */
    const storeForm = (args: { application: string | number } | [application: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ApplicationController::store
 * @see app/Http/Controllers/ApplicationController.php:118
 * @route '/applications/{application}/loan-details'
 */
        storeForm.post = (args: { application: string | number } | [application: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
const loan = {
    store: Object.assign(store, store),
}

export default loan