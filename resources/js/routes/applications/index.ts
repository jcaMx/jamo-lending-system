import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
import coBorrower from './coBorrower'
import collateral from './collateral'
import loan from './loan'
/**
* @see \App\Http\Controllers\ApplicationController::store
 * @see app/Http/Controllers/ApplicationController.php:0
 * @route '/applications'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/applications',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ApplicationController::store
 * @see app/Http/Controllers/ApplicationController.php:0
 * @route '/applications'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ApplicationController::store
 * @see app/Http/Controllers/ApplicationController.php:0
 * @route '/applications'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ApplicationController::store
 * @see app/Http/Controllers/ApplicationController.php:0
 * @route '/applications'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ApplicationController::store
 * @see app/Http/Controllers/ApplicationController.php:0
 * @route '/applications'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\ApplicationController::confirm
 * @see app/Http/Controllers/ApplicationController.php:143
 * @route '/applications/{application}/confirm'
 */
export const confirm = (args: { application: string | number | { id: string | number } } | [application: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: confirm.url(args, options),
    method: 'post',
})

confirm.definition = {
    methods: ["post"],
    url: '/applications/{application}/confirm',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ApplicationController::confirm
 * @see app/Http/Controllers/ApplicationController.php:143
 * @route '/applications/{application}/confirm'
 */
confirm.url = (args: { application: string | number | { id: string | number } } | [application: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return confirm.definition.url
            .replace('{application}', parsedArgs.application.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ApplicationController::confirm
 * @see app/Http/Controllers/ApplicationController.php:143
 * @route '/applications/{application}/confirm'
 */
confirm.post = (args: { application: string | number | { id: string | number } } | [application: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: confirm.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ApplicationController::confirm
 * @see app/Http/Controllers/ApplicationController.php:143
 * @route '/applications/{application}/confirm'
 */
    const confirmForm = (args: { application: string | number | { id: string | number } } | [application: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: confirm.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ApplicationController::confirm
 * @see app/Http/Controllers/ApplicationController.php:143
 * @route '/applications/{application}/confirm'
 */
        confirmForm.post = (args: { application: string | number | { id: string | number } } | [application: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: confirm.url(args, options),
            method: 'post',
        })
    
    confirm.form = confirmForm
/**
* @see \App\Http\Controllers\ApplicationController::show
 * @see app/Http/Controllers/ApplicationController.php:157
 * @route '/applications/{application}'
 */
export const show = (args: { application: string | number | { id: string | number } } | [application: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/applications/{application}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ApplicationController::show
 * @see app/Http/Controllers/ApplicationController.php:157
 * @route '/applications/{application}'
 */
show.url = (args: { application: string | number | { id: string | number } } | [application: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return show.definition.url
            .replace('{application}', parsedArgs.application.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ApplicationController::show
 * @see app/Http/Controllers/ApplicationController.php:157
 * @route '/applications/{application}'
 */
show.get = (args: { application: string | number | { id: string | number } } | [application: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ApplicationController::show
 * @see app/Http/Controllers/ApplicationController.php:157
 * @route '/applications/{application}'
 */
show.head = (args: { application: string | number | { id: string | number } } | [application: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ApplicationController::show
 * @see app/Http/Controllers/ApplicationController.php:157
 * @route '/applications/{application}'
 */
    const showForm = (args: { application: string | number | { id: string | number } } | [application: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ApplicationController::show
 * @see app/Http/Controllers/ApplicationController.php:157
 * @route '/applications/{application}'
 */
        showForm.get = (args: { application: string | number | { id: string | number } } | [application: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ApplicationController::show
 * @see app/Http/Controllers/ApplicationController.php:157
 * @route '/applications/{application}'
 */
        showForm.head = (args: { application: string | number | { id: string | number } } | [application: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
const applications = {
    store: Object.assign(store, store),
coBorrower: Object.assign(coBorrower, coBorrower),
collateral: Object.assign(collateral, collateral),
loan: Object.assign(loan, loan),
confirm: Object.assign(confirm, confirm),
show: Object.assign(show, show),
}

export default applications