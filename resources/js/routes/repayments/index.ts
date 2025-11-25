import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\RepaymentController::index
 * @see app/Http/Controllers/RepaymentController.php:57
 * @route '/repayments'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/repayments',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RepaymentController::index
 * @see app/Http/Controllers/RepaymentController.php:57
 * @route '/repayments'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RepaymentController::index
 * @see app/Http/Controllers/RepaymentController.php:57
 * @route '/repayments'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\RepaymentController::index
 * @see app/Http/Controllers/RepaymentController.php:57
 * @route '/repayments'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\RepaymentController::index
 * @see app/Http/Controllers/RepaymentController.php:57
 * @route '/repayments'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\RepaymentController::index
 * @see app/Http/Controllers/RepaymentController.php:57
 * @route '/repayments'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\RepaymentController::index
 * @see app/Http/Controllers/RepaymentController.php:57
 * @route '/repayments'
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
 * @see app/Http/Controllers/RepaymentController.php:13
 * @route '/repayments/add'
 */
export const add = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: add.url(options),
    method: 'get',
})

add.definition = {
    methods: ["get","head"],
    url: '/repayments/add',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RepaymentController::add
 * @see app/Http/Controllers/RepaymentController.php:13
 * @route '/repayments/add'
 */
add.url = (options?: RouteQueryOptions) => {
    return add.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RepaymentController::add
 * @see app/Http/Controllers/RepaymentController.php:13
 * @route '/repayments/add'
 */
add.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: add.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\RepaymentController::add
 * @see app/Http/Controllers/RepaymentController.php:13
 * @route '/repayments/add'
 */
add.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: add.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\RepaymentController::add
 * @see app/Http/Controllers/RepaymentController.php:13
 * @route '/repayments/add'
 */
    const addForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: add.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\RepaymentController::add
 * @see app/Http/Controllers/RepaymentController.php:13
 * @route '/repayments/add'
 */
        addForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: add.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\RepaymentController::add
 * @see app/Http/Controllers/RepaymentController.php:13
 * @route '/repayments/add'
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
/**
* @see \App\Http\Controllers\RepaymentController::store
 * @see app/Http/Controllers/RepaymentController.php:34
 * @route '/repayments/store'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/repayments/store',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\RepaymentController::store
 * @see app/Http/Controllers/RepaymentController.php:34
 * @route '/repayments/store'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RepaymentController::store
 * @see app/Http/Controllers/RepaymentController.php:34
 * @route '/repayments/store'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\RepaymentController::store
 * @see app/Http/Controllers/RepaymentController.php:34
 * @route '/repayments/store'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\RepaymentController::store
 * @see app/Http/Controllers/RepaymentController.php:34
 * @route '/repayments/store'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
const repayments = {
    index: Object.assign(index, index),
add: Object.assign(add, add),
store: Object.assign(store, store),
}

export default repayments