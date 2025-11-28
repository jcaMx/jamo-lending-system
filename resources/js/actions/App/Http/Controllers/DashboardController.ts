import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\DashboardController::stats
 * @see app/Http/Controllers/DashboardController.php:11
 * @route '/dashboard-stats'
 */
export const stats = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: stats.url(options),
    method: 'get',
})

stats.definition = {
    methods: ["get","head"],
    url: '/dashboard-stats',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DashboardController::stats
 * @see app/Http/Controllers/DashboardController.php:11
 * @route '/dashboard-stats'
 */
stats.url = (options?: RouteQueryOptions) => {
    return stats.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::stats
 * @see app/Http/Controllers/DashboardController.php:11
 * @route '/dashboard-stats'
 */
stats.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: stats.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DashboardController::stats
 * @see app/Http/Controllers/DashboardController.php:11
 * @route '/dashboard-stats'
 */
stats.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: stats.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DashboardController::stats
 * @see app/Http/Controllers/DashboardController.php:11
 * @route '/dashboard-stats'
 */
    const statsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: stats.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DashboardController::stats
 * @see app/Http/Controllers/DashboardController.php:11
 * @route '/dashboard-stats'
 */
        statsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: stats.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DashboardController::stats
 * @see app/Http/Controllers/DashboardController.php:11
 * @route '/dashboard-stats'
 */
        statsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: stats.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    stats.form = statsForm
/**
* @see \App\Http\Controllers\DashboardController::loans
 * @see app/Http/Controllers/DashboardController.php:23
 * @route '/dashboard-loans'
 */
export const loans = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: loans.url(options),
    method: 'get',
})

loans.definition = {
    methods: ["get","head"],
    url: '/dashboard-loans',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DashboardController::loans
 * @see app/Http/Controllers/DashboardController.php:23
 * @route '/dashboard-loans'
 */
loans.url = (options?: RouteQueryOptions) => {
    return loans.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::loans
 * @see app/Http/Controllers/DashboardController.php:23
 * @route '/dashboard-loans'
 */
loans.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: loans.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DashboardController::loans
 * @see app/Http/Controllers/DashboardController.php:23
 * @route '/dashboard-loans'
 */
loans.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: loans.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DashboardController::loans
 * @see app/Http/Controllers/DashboardController.php:23
 * @route '/dashboard-loans'
 */
    const loansForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: loans.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DashboardController::loans
 * @see app/Http/Controllers/DashboardController.php:23
 * @route '/dashboard-loans'
 */
        loansForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: loans.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DashboardController::loans
 * @see app/Http/Controllers/DashboardController.php:23
 * @route '/dashboard-loans'
 */
        loansForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: loans.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    loans.form = loansForm
/**
* @see \App\Http\Controllers\DashboardController::collections
 * @see app/Http/Controllers/DashboardController.php:34
 * @route '/dashboard-collections'
 */
export const collections = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: collections.url(options),
    method: 'get',
})

collections.definition = {
    methods: ["get","head"],
    url: '/dashboard-collections',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DashboardController::collections
 * @see app/Http/Controllers/DashboardController.php:34
 * @route '/dashboard-collections'
 */
collections.url = (options?: RouteQueryOptions) => {
    return collections.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::collections
 * @see app/Http/Controllers/DashboardController.php:34
 * @route '/dashboard-collections'
 */
collections.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: collections.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DashboardController::collections
 * @see app/Http/Controllers/DashboardController.php:34
 * @route '/dashboard-collections'
 */
collections.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: collections.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DashboardController::collections
 * @see app/Http/Controllers/DashboardController.php:34
 * @route '/dashboard-collections'
 */
    const collectionsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: collections.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DashboardController::collections
 * @see app/Http/Controllers/DashboardController.php:34
 * @route '/dashboard-collections'
 */
        collectionsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: collections.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DashboardController::collections
 * @see app/Http/Controllers/DashboardController.php:34
 * @route '/dashboard-collections'
 */
        collectionsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: collections.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    collections.form = collectionsForm
const DashboardController = { stats, loans, collections }

export default DashboardController