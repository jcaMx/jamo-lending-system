import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import dcprE951ef from './dcpr'
import monthlyC7a835 from './monthly'
/**
 * @see routes/web.php:107
 * @route '/Reports/DCPR'
 */
export const dcpr = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dcpr.url(options),
    method: 'get',
})

dcpr.definition = {
    methods: ["get","head"],
    url: '/Reports/DCPR',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:107
 * @route '/Reports/DCPR'
 */
dcpr.url = (options?: RouteQueryOptions) => {
    return dcpr.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:107
 * @route '/Reports/DCPR'
 */
dcpr.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dcpr.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:107
 * @route '/Reports/DCPR'
 */
dcpr.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dcpr.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:107
 * @route '/Reports/DCPR'
 */
    const dcprForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: dcpr.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:107
 * @route '/Reports/DCPR'
 */
        dcprForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dcpr.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:107
 * @route '/Reports/DCPR'
 */
        dcprForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dcpr.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    dcpr.form = dcprForm
/**
 * @see routes/web.php:111
 * @route '/Reports/MonthlyReport'
 */
export const monthly = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: monthly.url(options),
    method: 'get',
})

monthly.definition = {
    methods: ["get","head"],
    url: '/Reports/MonthlyReport',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:111
 * @route '/Reports/MonthlyReport'
 */
monthly.url = (options?: RouteQueryOptions) => {
    return monthly.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:111
 * @route '/Reports/MonthlyReport'
 */
monthly.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: monthly.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:111
 * @route '/Reports/MonthlyReport'
 */
monthly.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: monthly.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:111
 * @route '/Reports/MonthlyReport'
 */
    const monthlyForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: monthly.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:111
 * @route '/Reports/MonthlyReport'
 */
        monthlyForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: monthly.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:111
 * @route '/Reports/MonthlyReport'
 */
        monthlyForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: monthly.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    monthly.form = monthlyForm
const reports = {
    dcpr: Object.assign(dcpr, dcprE951ef),
monthly: Object.assign(monthly, monthlyC7a835),
}

export default reports