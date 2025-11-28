import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\LoanController::store
 * @see app/Http/Controllers/LoanController.php:26
 * @route '/loans'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/loans',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\LoanController::store
 * @see app/Http/Controllers/LoanController.php:26
 * @route '/loans'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LoanController::store
 * @see app/Http/Controllers/LoanController.php:26
 * @route '/loans'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\LoanController::store
 * @see app/Http/Controllers/LoanController.php:26
 * @route '/loans'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\LoanController::store
 * @see app/Http/Controllers/LoanController.php:26
 * @route '/loans'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\LoanController::approve
 * @see app/Http/Controllers/LoanController.php:0
 * @route '/loans/approve/{loan}'
 */
export const approve = (args: { loan: string | number } | [loan: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

approve.definition = {
    methods: ["post"],
    url: '/loans/approve/{loan}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\LoanController::approve
 * @see app/Http/Controllers/LoanController.php:0
 * @route '/loans/approve/{loan}'
 */
approve.url = (args: { loan: string | number } | [loan: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { loan: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    loan: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        loan: args.loan,
                }

    return approve.definition.url
            .replace('{loan}', parsedArgs.loan.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LoanController::approve
 * @see app/Http/Controllers/LoanController.php:0
 * @route '/loans/approve/{loan}'
 */
approve.post = (args: { loan: string | number } | [loan: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\LoanController::approve
 * @see app/Http/Controllers/LoanController.php:0
 * @route '/loans/approve/{loan}'
 */
    const approveForm = (args: { loan: string | number } | [loan: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: approve.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\LoanController::approve
 * @see app/Http/Controllers/LoanController.php:0
 * @route '/loans/approve/{loan}'
 */
        approveForm.post = (args: { loan: string | number } | [loan: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: approve.url(args, options),
            method: 'post',
        })
    
    approve.form = approveForm
/**
* @see \App\Http\Controllers\LoanController::reject
 * @see app/Http/Controllers/LoanController.php:0
 * @route '/loans/reject/{loan}'
 */
export const reject = (args: { loan: string | number } | [loan: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reject.url(args, options),
    method: 'post',
})

reject.definition = {
    methods: ["post"],
    url: '/loans/reject/{loan}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\LoanController::reject
 * @see app/Http/Controllers/LoanController.php:0
 * @route '/loans/reject/{loan}'
 */
reject.url = (args: { loan: string | number } | [loan: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { loan: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    loan: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        loan: args.loan,
                }

    return reject.definition.url
            .replace('{loan}', parsedArgs.loan.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LoanController::reject
 * @see app/Http/Controllers/LoanController.php:0
 * @route '/loans/reject/{loan}'
 */
reject.post = (args: { loan: string | number } | [loan: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reject.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\LoanController::reject
 * @see app/Http/Controllers/LoanController.php:0
 * @route '/loans/reject/{loan}'
 */
    const rejectForm = (args: { loan: string | number } | [loan: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: reject.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\LoanController::reject
 * @see app/Http/Controllers/LoanController.php:0
 * @route '/loans/reject/{loan}'
 */
        rejectForm.post = (args: { loan: string | number } | [loan: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: reject.url(args, options),
            method: 'post',
        })
    
    reject.form = rejectForm
/**
* @see \App\Http\Controllers\LoanController::close
 * @see app/Http/Controllers/LoanController.php:0
 * @route '/loans/close/{loan}'
 */
export const close = (args: { loan: string | number } | [loan: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: close.url(args, options),
    method: 'post',
})

close.definition = {
    methods: ["post"],
    url: '/loans/close/{loan}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\LoanController::close
 * @see app/Http/Controllers/LoanController.php:0
 * @route '/loans/close/{loan}'
 */
close.url = (args: { loan: string | number } | [loan: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { loan: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    loan: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        loan: args.loan,
                }

    return close.definition.url
            .replace('{loan}', parsedArgs.loan.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LoanController::close
 * @see app/Http/Controllers/LoanController.php:0
 * @route '/loans/close/{loan}'
 */
close.post = (args: { loan: string | number } | [loan: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: close.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\LoanController::close
 * @see app/Http/Controllers/LoanController.php:0
 * @route '/loans/close/{loan}'
 */
    const closeForm = (args: { loan: string | number } | [loan: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: close.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\LoanController::close
 * @see app/Http/Controllers/LoanController.php:0
 * @route '/loans/close/{loan}'
 */
        closeForm.post = (args: { loan: string | number } | [loan: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: close.url(args, options),
            method: 'post',
        })
    
    close.form = closeForm
const LoanController = { store, approve, reject, close }

export default LoanController