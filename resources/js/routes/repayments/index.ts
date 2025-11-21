import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\RepaymentController::index
 * @see app/Http/Controllers/RepaymentController.php:10
 * @route '/Repayments'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/Repayments',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RepaymentController::index
 * @see app/Http/Controllers/RepaymentController.php:10
 * @route '/Repayments'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RepaymentController::index
 * @see app/Http/Controllers/RepaymentController.php:10
 * @route '/Repayments'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\RepaymentController::index
 * @see app/Http/Controllers/RepaymentController.php:10
 * @route '/Repayments'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\RepaymentController::index
 * @see app/Http/Controllers/RepaymentController.php:10
 * @route '/Repayments'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\RepaymentController::index
 * @see app/Http/Controllers/RepaymentController.php:10
 * @route '/Repayments'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\RepaymentController::index
 * @see app/Http/Controllers/RepaymentController.php:10
 * @route '/Repayments'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\RepaymentController::add
 * @see app/Http/Controllers/RepaymentController.php:57
 * @route '/Repayments/add'
 */
export const add = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: add.url(options),
    method: 'get',
})

add.definition = {
    methods: ["get","head"],
    url: '/Repayments/add',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RepaymentController::add
 * @see app/Http/Controllers/RepaymentController.php:57
 * @route '/Repayments/add'
 */
add.url = (options?: RouteQueryOptions) => {
    return add.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RepaymentController::add
 * @see app/Http/Controllers/RepaymentController.php:57
 * @route '/Repayments/add'
 */
add.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: add.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\RepaymentController::add
 * @see app/Http/Controllers/RepaymentController.php:57
 * @route '/Repayments/add'
 */
add.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: add.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\RepaymentController::add
 * @see app/Http/Controllers/RepaymentController.php:57
 * @route '/Repayments/add'
 */
    const addForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: add.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\RepaymentController::add
 * @see app/Http/Controllers/RepaymentController.php:57
 * @route '/Repayments/add'
 */
        addForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: add.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\RepaymentController::add
 * @see app/Http/Controllers/RepaymentController.php:57
 * @route '/Repayments/add'
 */
        addForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: add.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    add.form = addForm
const repayments = {
    index: Object.assign(index, index),
add: Object.assign(add, add),
}

export default repayments