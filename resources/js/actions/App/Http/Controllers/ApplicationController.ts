import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ApplicationController::storeBorrower
 * @see app/Http/Controllers/ApplicationController.php:0
 * @route '/applications'
 */
export const storeBorrower = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeBorrower.url(options),
    method: 'post',
})

storeBorrower.definition = {
    methods: ["post"],
    url: '/applications',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ApplicationController::storeBorrower
 * @see app/Http/Controllers/ApplicationController.php:0
 * @route '/applications'
 */
storeBorrower.url = (options?: RouteQueryOptions) => {
    return storeBorrower.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ApplicationController::storeBorrower
 * @see app/Http/Controllers/ApplicationController.php:0
 * @route '/applications'
 */
storeBorrower.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeBorrower.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ApplicationController::storeBorrower
 * @see app/Http/Controllers/ApplicationController.php:0
 * @route '/applications'
 */
    const storeBorrowerForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeBorrower.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ApplicationController::storeBorrower
 * @see app/Http/Controllers/ApplicationController.php:0
 * @route '/applications'
 */
        storeBorrowerForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeBorrower.url(options),
            method: 'post',
        })
    
    storeBorrower.form = storeBorrowerForm
/**
* @see \App\Http\Controllers\ApplicationController::storeCoBorrower
 * @see app/Http/Controllers/ApplicationController.php:61
 * @route '/applications/{application}/co-borrower'
 */
export const storeCoBorrower = (args: { application: string | number } | [application: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeCoBorrower.url(args, options),
    method: 'post',
})

storeCoBorrower.definition = {
    methods: ["post"],
    url: '/applications/{application}/co-borrower',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ApplicationController::storeCoBorrower
 * @see app/Http/Controllers/ApplicationController.php:61
 * @route '/applications/{application}/co-borrower'
 */
storeCoBorrower.url = (args: { application: string | number } | [application: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return storeCoBorrower.definition.url
            .replace('{application}', parsedArgs.application.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ApplicationController::storeCoBorrower
 * @see app/Http/Controllers/ApplicationController.php:61
 * @route '/applications/{application}/co-borrower'
 */
storeCoBorrower.post = (args: { application: string | number } | [application: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeCoBorrower.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ApplicationController::storeCoBorrower
 * @see app/Http/Controllers/ApplicationController.php:61
 * @route '/applications/{application}/co-borrower'
 */
    const storeCoBorrowerForm = (args: { application: string | number } | [application: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeCoBorrower.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ApplicationController::storeCoBorrower
 * @see app/Http/Controllers/ApplicationController.php:61
 * @route '/applications/{application}/co-borrower'
 */
        storeCoBorrowerForm.post = (args: { application: string | number } | [application: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeCoBorrower.url(args, options),
            method: 'post',
        })
    
    storeCoBorrower.form = storeCoBorrowerForm
/**
* @see \App\Http\Controllers\ApplicationController::storeCollateral
 * @see app/Http/Controllers/ApplicationController.php:90
 * @route '/applications/{application}/collateral'
 */
export const storeCollateral = (args: { application: string | number } | [application: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeCollateral.url(args, options),
    method: 'post',
})

storeCollateral.definition = {
    methods: ["post"],
    url: '/applications/{application}/collateral',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ApplicationController::storeCollateral
 * @see app/Http/Controllers/ApplicationController.php:90
 * @route '/applications/{application}/collateral'
 */
storeCollateral.url = (args: { application: string | number } | [application: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return storeCollateral.definition.url
            .replace('{application}', parsedArgs.application.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ApplicationController::storeCollateral
 * @see app/Http/Controllers/ApplicationController.php:90
 * @route '/applications/{application}/collateral'
 */
storeCollateral.post = (args: { application: string | number } | [application: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeCollateral.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ApplicationController::storeCollateral
 * @see app/Http/Controllers/ApplicationController.php:90
 * @route '/applications/{application}/collateral'
 */
    const storeCollateralForm = (args: { application: string | number } | [application: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeCollateral.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ApplicationController::storeCollateral
 * @see app/Http/Controllers/ApplicationController.php:90
 * @route '/applications/{application}/collateral'
 */
        storeCollateralForm.post = (args: { application: string | number } | [application: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeCollateral.url(args, options),
            method: 'post',
        })
    
    storeCollateral.form = storeCollateralForm
/**
* @see \App\Http\Controllers\ApplicationController::storeLoanDetails
 * @see app/Http/Controllers/ApplicationController.php:118
 * @route '/applications/{application}/loan-details'
 */
export const storeLoanDetails = (args: { application: string | number } | [application: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeLoanDetails.url(args, options),
    method: 'post',
})

storeLoanDetails.definition = {
    methods: ["post"],
    url: '/applications/{application}/loan-details',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ApplicationController::storeLoanDetails
 * @see app/Http/Controllers/ApplicationController.php:118
 * @route '/applications/{application}/loan-details'
 */
storeLoanDetails.url = (args: { application: string | number } | [application: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return storeLoanDetails.definition.url
            .replace('{application}', parsedArgs.application.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ApplicationController::storeLoanDetails
 * @see app/Http/Controllers/ApplicationController.php:118
 * @route '/applications/{application}/loan-details'
 */
storeLoanDetails.post = (args: { application: string | number } | [application: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeLoanDetails.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ApplicationController::storeLoanDetails
 * @see app/Http/Controllers/ApplicationController.php:118
 * @route '/applications/{application}/loan-details'
 */
    const storeLoanDetailsForm = (args: { application: string | number } | [application: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeLoanDetails.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ApplicationController::storeLoanDetails
 * @see app/Http/Controllers/ApplicationController.php:118
 * @route '/applications/{application}/loan-details'
 */
        storeLoanDetailsForm.post = (args: { application: string | number } | [application: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeLoanDetails.url(args, options),
            method: 'post',
        })
    
    storeLoanDetails.form = storeLoanDetailsForm
/**
* @see \App\Http\Controllers\ApplicationController::confirm
 * @see app/Http/Controllers/ApplicationController.php:143
 * @route '/applications/{application}/confirm'
 */
export const confirm = (args: { application: string | number } | [application: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
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
confirm.url = (args: { application: string | number } | [application: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return confirm.definition.url
            .replace('{application}', parsedArgs.application.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ApplicationController::confirm
 * @see app/Http/Controllers/ApplicationController.php:143
 * @route '/applications/{application}/confirm'
 */
confirm.post = (args: { application: string | number } | [application: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: confirm.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ApplicationController::confirm
 * @see app/Http/Controllers/ApplicationController.php:143
 * @route '/applications/{application}/confirm'
 */
    const confirmForm = (args: { application: string | number } | [application: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: confirm.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ApplicationController::confirm
 * @see app/Http/Controllers/ApplicationController.php:143
 * @route '/applications/{application}/confirm'
 */
        confirmForm.post = (args: { application: string | number } | [application: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: confirm.url(args, options),
            method: 'post',
        })
    
    confirm.form = confirmForm
/**
* @see \App\Http\Controllers\ApplicationController::show
 * @see app/Http/Controllers/ApplicationController.php:157
 * @route '/applications/{application}'
 */
export const show = (args: { application: string | number } | [application: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
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
show.url = (args: { application: string | number } | [application: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return show.definition.url
            .replace('{application}', parsedArgs.application.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ApplicationController::show
 * @see app/Http/Controllers/ApplicationController.php:157
 * @route '/applications/{application}'
 */
show.get = (args: { application: string | number } | [application: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ApplicationController::show
 * @see app/Http/Controllers/ApplicationController.php:157
 * @route '/applications/{application}'
 */
show.head = (args: { application: string | number } | [application: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ApplicationController::show
 * @see app/Http/Controllers/ApplicationController.php:157
 * @route '/applications/{application}'
 */
    const showForm = (args: { application: string | number } | [application: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ApplicationController::show
 * @see app/Http/Controllers/ApplicationController.php:157
 * @route '/applications/{application}'
 */
        showForm.get = (args: { application: string | number } | [application: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ApplicationController::show
 * @see app/Http/Controllers/ApplicationController.php:157
 * @route '/applications/{application}'
 */
        showForm.head = (args: { application: string | number } | [application: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
const ApplicationController = { storeBorrower, storeCoBorrower, storeCollateral, storeLoanDetails, confirm, show }

export default ApplicationController